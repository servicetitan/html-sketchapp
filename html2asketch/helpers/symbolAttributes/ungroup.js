import {isGroup, isLayers, isNodeUngroup} from './utils';

export default function applyUngroup(node, element) {
  if (isNodeUngroup(node)) {
    if (isGroup(element)) {
      console.log('Groups are not allowed, only layers. Must be ungrouped before applyUngroup():', element);
    }

    if (isLayers(element)) {
      // Applying opacity to layers of the group...
      const groupOpacity = getComputedStyle(node).opacity;

      element.forEach(layer => {
        if (groupOpacity < 1) {
          const layerOpacity = layer._style._opacity || 1;

          layer._style._opacity = groupOpacity * layerOpacity;
        }
      });
    }
  }

  return element;
}
