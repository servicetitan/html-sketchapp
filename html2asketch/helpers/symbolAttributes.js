export function handleSymbolAttributes(node, element) {

  const constraints = node.getAttribute('data-sketch-constraints') || false;
  const rotation = node.getAttribute('data-sketch-rotation') || false; /* Measured in deg */
  const padding = node.getAttribute('data-sketch-padding') || false;
  const spacing = node.getAttribute('data-sketch-spacing') || false;
  const textLabel = node.getAttribute('data-sketch-textlabel') || false;

  const isGroup = element._class === 'group';
  // Automatic padding with Paddy require set of layers, not group
  const isLayers = element && Array.isArray(element);

  if (constraints && isGroup) {
    element._resizingConstraint = constraints;
  }

  if (rotation && isGroup) {
    // Sketch stores negative value of rotatioin angle!
    element._rotation = -parseInt(rotation, 10);
  }

  if (padding) {
    // Utilising Paddy plugin for Sketch
    // Padding may be applied only to fill layers
    const paddyPadding = padding === 'auto' ? getNodePadding(node) : padding; // Calculate padding if needed

    // Looking for shapeGroup layer
    if (isLayers) {
      for (const key in element) {
        if (element[key]._name === 'shapeGroup') {
          element[key]._name = `bg ${paddyPadding}`;
          break; // Set name to only one layer
        }
      }
    } else {
      console.log('Paddy not works well with grouped layers. Here is the group: ');
      console.log(element);
    }
  }

  if (spacing && isGroup) {
    // Paddy plugin for Sketch
    // Automated spacing between elements inside group

    /*
    Examples:
    [left] – align all layers left
    [10v c] – space all layers vertically with a spacing of 10, all centered horizontally
    [5h b] – space all layers horizontally with a spacing of 5, all aligned at the bottom
    */
    element._name += ` ${spacing}`;
  }

  if (textLabel && typeof textLabel === 'string') {
    if (isLayers) {
      renameTextLayerInArray(element, textLabel);
    }
    if (isGroup) {
      renameTextLayerInGroup(element, textLabel);
    }

  }

  return element;
}

export function getNodePadding(node) {
  const padding = getComputedStyle(node).padding;
  const paddyPadding = `[${padding.replace(/px/g, '')}]`;

  return paddyPadding;
}

export function renameTextLayerInArray(el, name) {
  for (const key in el) {
    if (el[key]._class === 'text') {
      el[key]._name = name;
      return true; // Rename only one layer
    }
  }
  return false;
}

export function renameTextLayerInGroup(el, name) {
  if (el._class === 'text') {
    el._name = name;
    return true; // Rename only one layer in group
  }
  el._layers.forEach(layer => renameTextLayerInGroup(layer, name));
  return false;
}
