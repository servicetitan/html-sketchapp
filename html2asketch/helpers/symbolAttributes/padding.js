import {isGroup, isLayers, getPaddyPadding, insertPaddyNotationIntoName} from './utils';

export default function applyPadding(node, element) {
  const padding = node.getAttribute('data-sketch-padding') || false;

  if (padding) {
    /*
    Utilising Paddy plugin for Sketch
    Padding may be applied only to fill layers, e.g.:
    [10 12] – is equal to padding: 10px 12px;
    */
    const paddyPadding = padding === 'auto' ? getPaddyPadding(node) : padding; // Calculate padding if 'auto'

    //console.log(`Padding (${padding}) @`, element);

    // Looking for shapeGroup layer
    if (isLayers(element)) {
      element.forEach(layer => {
        let counter = 0;

        if (layer._class === 'shapeGroup') {
          counter++;
          if (counter === 1) { // Set padding on one layer only
            layer._name = `bg ${paddyPadding}`;
          }
        }

        if (layer._class === 'text') {
          layer._isPaddyText = true;
          if (layer._heightByLines) {
            // Rounding upward prevents line wrapping
            layer._width = Math.ceil(layer._width);
            // Setting minimal height of text element
            if (layer._height > layer._heightByLines) {
              layer._height = layer._heightByLines;
            }
          }
        }
      });
    }

    if (isGroup(element)) {
      element._name = insertPaddyNotationIntoName(element._name, paddyPadding);
      //console.log('Paddy not works well with grouped layers. Here is the group:', element);
    }
  }

  return element;
}
