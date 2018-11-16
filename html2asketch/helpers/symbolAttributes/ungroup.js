import {isGroup, isLayers, isNodeUngroup} from './utils';

export default function applyUngroup(node, element) {
  if (isNodeUngroup(node)) {
    if (isGroup(element)) {
      console.log('Groups are not allowed, only layers. Must be ungrouped before applyUngroup():', element);
    }

    if (isLayers(element)) {
      // Applying opacity to groups’ layers
      const styles = getComputedStyle(node);

      element.forEach(layer => {
        if (styles.groupOpacity < 1) {
          const layerOpacity = layer._style._opacity || 1;

          console.log('opa:', styles.groupOpacity);
          console.log('LaySty:', layer._style);
          layer._style._opacity(styles.groupOpacity * layerOpacity);
          console.log('LaySty:', layer._style._opacity);
        }
      });
    }
  }

  return element;
}
