import {isGroup, isLayers, constraintToArray} from './utils';

export default function applyConstraints(node, element) {
  const constraints = node.getAttribute('data-sketch-constraints') || false;

  if (constraints) {
    //console.log(`Constraints (${constraints}) @`, element);

    if (isGroup(element)) {
      element._resizingConstraint = constraints;
    }
    if (constraints && isLayers(element)) {
      element.forEach(layer => {
        layer._resizingConstraint = constraints;
      });
    }
  }

  return element;
}

export function applyConstraintToText(textNode, text) {
  const parent = textNode.parentNode;
  const parentBCR = parent.getBoundingClientRect();
  const isSole = parent.childNodes.length === 1;
  const constraint = parent.getAttribute('data-sketch-constraints');

  // Setting text's constraint same as on node
  text._resizingConstraint = constraint;

  if (isSole && constraint) {
    if (!text._multiline) {
      // Setting width for non-inline elements (width of their wrapper much wider than text)
      if (1.3 < (parentBCR.right - parentBCR.left) / text._width) {
        text._width = parentBCR.right - parentBCR.left;
        text._x = parentBCR.left;
        //console.log('Setting large width of text for non-inline elements', text);
      }

      // Always using height of the parent instead of rangeHelper.getBoundingClientRect()...
      text._height = parentBCR.bottom - parentBCR.top;
      text._textBehaviour = 2;
      text._multiline = true;
    }

    // Handling text nodes that are pinned to both left and right or top and bottom
    const constraintSet = new Set(constraintToArray(constraint));
    const isPinnedHorizontally =
      constraintSet.has('Align Left') && constraintSet.has('Align Right') && !constraintSet.has('Fixed Width');
    const isPinnedVertically =
      constraintSet.has('Align Top') && constraintSet.has('Align Bottom') && !constraintSet.has('Fixed Height');

    if (isPinnedHorizontally) {
      //console.log('isPinnedHorizontally', text);
      text._x = parentBCR.left;
      text._width = parentBCR.right - parentBCR.left;
      text._textBehaviour = 2;
      text._multiline = true;
    }

    // Pinned vertically case...
    if (isPinnedVertically) {
      //console.log('isPinnedVertically', text);
      text._y = parentBCR.top;
      text._height = parentBCR.bottom - parentBCR.top;
    }
  }

  // Returns 'top', 'center' or 'bottom'
  const detectVerticalAlignment = () => {
    const parentHeight = parentBCR.bottom - parentBCR.top;
    const grandpa = parent.parentNode;

    if (!parent.hasOwnProperty('parentNode') || !grandpa.hasOwnProperty('getBoundingClientRect')) {
      return 'undefined';
    }

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

  // Vertical alignment is not yet supported, see https://github.com/airbnb/react-sketchapp/issues/366
  text._verticalAlignment = detectVerticalAlignment();

  return text;
}
