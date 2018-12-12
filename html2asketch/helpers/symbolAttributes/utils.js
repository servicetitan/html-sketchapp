export function isGroup(element) {
  return element._class === 'group';
}

export function isLayers(element) {
  return element && Array.isArray(element);
}

export function isNodeUngroup(node) {
  const attr = node.getAttribute('data-sketch-ungroup');

  return attr === 'true' || attr === true || false;
}

export function isPinnedHorizontally(node) {
  const attr = node.getAttribute('data-sketch-pinned-horizontally');

  return attr === 'true' || attr === true || false;
}

export function isPinnedVertically(node) {
  const attr = node.getAttribute('data-sketch-pinned-vertically');

  return attr === 'true' || attr === true || false;
}

export function isInline(node) {
  const attr = node.getAttribute('data-sketch-pinned-vertically');

  return attr === 'true' || attr === true || false;
}

export function renameTextLayerInArray(el, name) {
  for (const key in el) {
    if (el[key]._class === 'text') {
      el[key]._name = name;
      el[key]._isLabeledText = true;
      return true; // Rename only one layer in array
    }
  }
  return false;
}

export function renameTextLayerInGroup(el, name) {
  if (el._class === 'text') {
    el._name = name;
    el._isLabeledText = true;
    return true; // Rename only one layer in group
  }
  // Recursively renaming text layers in sublayers...
  el._layers.forEach(layer => renameTextLayerInGroup(layer, name));
  return false;
}

export function getPaddyPadding(node) {
  const padding = getComputedStyle(node).padding;
  const paddyPaddingSuffix = `[${padding.replace(/px/g, '')}]`;

  return paddyPaddingSuffix;
}

export function insertPaddyNotationIntoName(name, str) {
  name = name.trim(); // Removing useless spaces
  str = str.replace('[', '').replace(']', '').trim(); // Removing brackets

  if (name.substr(-1, 1) === ']') {
    // Paddy notation detected
    name = name.substr(0, name.length - 1).trim() + ' ' + str + ']';
    return name;
  } else {
    return name + ' [' + str + ']';
  }
}

export function constraintToArray(constraint) {
  const fullConstraintArray = ['Align Top', 'Fixed Height', 'Align Bottom', 'Align Left', 'Fixed Width', 'Align Right'];
  /*
    Sketch stores constraints in JSON as binary data:
    31 (011111) = align top,
    62 (111110) = align right,
    55 (110111) = align bottom,
    59 (111011) = align left,
    61 (111101) = fixed width,
    47 (101111) = fixed height,
    ...and their meaningful combinations.
  */

  let constraintArray = [];

  constraint = parseInt(constraint);

  if (constraint < 0 || constraint > 63) {
    return [];
  }

  const constraintAsBinaryString = (64 + constraint).toString(2).substr(1);

  constraintArray = fullConstraintArray
    .map((item, index) => (constraintAsBinaryString.charAt(index) === '0' ? item : ''))
    .filter(item => item !== '');
  return constraintArray;
}
