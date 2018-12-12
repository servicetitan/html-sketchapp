import {isGroup, isLayers, constraintToArray} from './utils';

export const constraints = (node) => node.getAttribute('data-sketch-constraints') || false;

export default function applyConstraints(node, element) {
  if (constraints(node)) {
    //console.log(`Constraints (${constraints}) @`, element);

    if (isGroup(element)) {
      element._resizingConstraint = constraints(node);
    }
    if (isLayers(element)) {
      element.forEach(layer => {
        layer._resizingConstraint = constraints(node);
      });
    }
  }

  return element;
}

export function applyConstraintsToText(textNode, text) {
  const parent = textNode.parentNode;

  // Exit early if no constraint defined
  if (!constraints(parent)) {
    return text;
  }

  const parentBCR = parent.getBoundingClientRect();
  const parentPadding = {
    left: parseFloat(getComputedStyle(parent).paddingLeft),
    right: parseFloat(getComputedStyle(parent).paddingRight),
    top: parseFloat(getComputedStyle(parent).paddingTop),
    bottom: parseFloat(getComputedStyle(parent).paddingBottom),
    x: parseFloat(getComputedStyle(parent).paddingLeft) + parseFloat(getComputedStyle(parent).paddingRight),
    y: parseFloat(getComputedStyle(parent).paddingTop) + parseFloat(getComputedStyle(parent).paddingBottom)
  };
  const isSole = parent.childNodes.length === 1;

  if (isSole) {
    // Setting text's constraints same as on container
    text._resizingConstraint = constraints(parent);

    const availiableSpaceX = parentBCR.right - parentBCR.left - parentPadding.x;
    const availiableSpaceY = parentBCR.bottom - parentBCR.top - parentPadding.y;

    if (!text._multiline) {
      // Always use height of the parent instead of rangeHelper.getBoundingClientRect()
      text._height = availiableSpaceY;
      text._textBehaviour = 2;

      const textWidthToSpaceRatio = text._width / availiableSpaceX;

      // Setting proper width of text, if width of available space is much wider than text
      if (textWidthToSpaceRatio < .96) {
        //console.log('non-inline element', text._text, text);
        text._x = parentBCR.left + parentPadding.left;
        text._width = availiableSpaceX;
      } else {
        //console.log('inline element', text._text, text._style._textAlign);
      }
    }

    // Handling text nodes that are pinned to both left and right or top and bottom
    const constraintSet = new Set(constraintToArray(constraints(parent)));
    const isPinnedHorizontally =
      constraintSet.has('Align Left') && constraintSet.has('Align Right') && !constraintSet.has('Fixed Width');

    if (isPinnedHorizontally) {
      text._x = parentBCR.left + parentPadding.left;
      text._width = availiableSpaceX;
      text._textBehaviour = 2;
    }

    const isPinnedVertically =
      constraintSet.has('Align Top') && constraintSet.has('Align Bottom') && !constraintSet.has('Fixed Height');

    if (isPinnedVertically) {
      text._y = parentBCR.top + parentPadding.top;
      text._height = availiableSpaceY;
    }
  }

  // Vertical alignment is not yet supported, see https://github.com/airbnb/react-sketchapp/issues/366
  text._verticalAlignment = detectVerticalAlignment();

  return text;
}

// Returns 'top', 'center' or 'bottom'
export const detectVerticalAlignment = () => {
  // Detecting unusual grandparent
  if (!parent.hasOwnProperty('parentNode') || !parent.parentNode.hasOwnProperty('getBoundingClientRect')) {
    return 'undefined';
  }

  const parentHeight = parentBCR.bottom - parentBCR.top;
  const grandpa = parent.parentNode;
  const grandpaBCR = parent.parentNode.getBoundingClientRect();
  const grandpaHeight = grandpaBCR.bottom - grandpaBCR.top;
  const relativeTopOffset = (grandpaHeight - (parentBCR.top - grandpaBCR.top + parentHeight / 2)) / grandpaHeight;

  if (0 <= relativeTopOffset && relativeTopOffset < .332) {
    return 'top';
  }
  if (.332 <= relativeTopOffset && relativeTopOffset <= .667) {
    return 'center';
  }
  if (.667 < relativeTopOffset && relativeTopOffset <= 1) {
    return 'bottom';
  }
  return 'undefined';
};
