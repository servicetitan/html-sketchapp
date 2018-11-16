import {isGroup, isLayers} from './utils';

export default function applyLocked(node, element) {
  const locked = node.getAttribute('data-sketch-locked') || false;

  if (locked) {
    //console.log('Locked @', element);

    if (isGroup(element)) {
      element._isLocked = true;
    }
    if (isLayers(element)) {
      element.forEach(layer => {
        layer._isLocked = true;
      });
    }
  }

  return element;
}
