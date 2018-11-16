import {isGroup, isLayers} from './utils';

export default function applyRotation(node, element) {
  const rotation = node.getAttribute('data-sketch-rotation') || false;

  if (rotation) {
    //console.log('Rotation @', element);

    if (isGroup(element)) {
      // Sketch use negative value of rotation angle in comparison to transform: rotate(...)
      element._rotation = -parseInt(rotation, 10);
    }
    if (isLayers(element)) {
      element.forEach(layer => {
        // Where is rotation origin point?
        layer._rotation = -parseInt(rotation, 10);
      });
    }
  }

  return element;
}
