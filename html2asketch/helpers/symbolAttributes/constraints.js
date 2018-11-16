import {isGroup, isLayers} from './utils';

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
