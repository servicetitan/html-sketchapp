export function handleSymbolAttributes(node, group) {

  const constraints = node.getAttribute('data-sketch-constraints') || false;
  const rotation = node.getAttribute('data-sketch-rotation') || false; /* Measured in deg */
  const padding = node.getAttribute('data-sketch-padding') || false;
  const spacing = node.getAttribute('data-sketch-spacing') || false;

  if (constraints) {
    group._resizingConstraint = constraints;
  }

  if (rotation) {
    group._rotation = -parseInt(rotation, 10);
  }

  if (padding) {
    /* Utilizing Paddy plugin for Sketch */
    //group.name += `[padding]`;
  }

  if (spacing) {
    //group.name += `[padding]`;
  }

  return group;
}

