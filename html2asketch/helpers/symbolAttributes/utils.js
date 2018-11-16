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

export function renameTextLayerInArray(el, name) {
  for (const key in el) {
    if (el[key]._class === 'text') {
      el[key]._name = name;
      el[key]._isLabeledText = true;
      return true; // Rename only one layer
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
