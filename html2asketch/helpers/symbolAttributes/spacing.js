import {isGroup, isLayers, insertPaddyNotationIntoName} from './utils';

export default function applySpacing(node, element) {
  const spacing = node.getAttribute('data-sketch-spacing') || false;

  /*
    Paddy plugin for Sketch
    Automated spacing between elements inside group, e.g.:
    [left] – align all layers left
    [10v c] – space all layers vertically with a spacing of 10, all centered horizontally
    [5h b] – space all layers horizontally with a spacing of 5, all aligned at the bottom
  */

  if (spacing) {
    //console.log(`Spacing (${spacing}) @`, element);

    if (isGroup(element)) {
      element._name = insertPaddyNotationIntoName(element._name, spacing);
    }
    if (isLayers(element)) {
      element.forEach(layer => {
        layer._name = insertPaddyNotationIntoName(layer._name, spacing);
      });
    }
  }

  return element;
}

