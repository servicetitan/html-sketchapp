import Group from './model/group';
import Style from './model/style';
import nodeToSketchLayers from './nodeToSketchLayers';
import {isNodeVisible} from './helpers/visibility';
import {handleSymbolAttributes} from './helpers/symbolAttributes/';
import {isNodeUngroup} from './helpers/symbolAttributes/utils';

export default function nodeTreeToSketchGroup(node, options) {
  const bcr = node.getBoundingClientRect();
  const {left, top} = bcr;
  const width = bcr.right - bcr.left;
  const height = bcr.bottom - bcr.top;

  // Collect layers for the node level itself
  let layers = nodeToSketchLayers(node, {...options, layerOpacity: isNodeUngroup(node) ? true : false}) || [];

  if (node.nodeName.toLowerCase() !== 'svg') {
    // Recursively collect child groups for child nodes
    Array.from(node.children)
      .filter(node => isNodeVisible(node))
      .forEach(childNode => {
        const childLayers = nodeTreeToSketchGroup(childNode, options) || [];

        if (isNodeUngroup(childNode)) {
          // Unwarapping array of layers if needed
          layers.push(...childLayers);
        } else {
          layers.push(childLayers);
        }

        // Traverse the shadow DOM if present
        if (childNode.shadowRoot) {
          Array.from(childNode.shadowRoot.children)
            .filter(node => isNodeVisible(node))
            .map(nodeTreeToSketchGroup)
            .forEach(layer => layers.push(layer));
        }
      });
  }

  if (isNodeUngroup(node)) {
    const parent = node.parentNode;
    const isParentSymbol = parent.dataset.sketchSymbolName !== undefined;
    const isParentUnwrapped =
      parent.dataset.sketchSymbolDisableUnwrapping === undefined ||
      parent.dataset.sketchUngroup !== undefined;

    // Special ungrouping is required for Symbol’s children
    if (isParentSymbol && isParentUnwrapped) {
      const symbolBcr = parent.getBoundingClientRect();

      // Layer positions are relative to Symbol’s position
      layers.forEach(layer => {
        layer._x -= symbolBcr.left;
        layer._y -= symbolBcr.top;
      });
    }

    layers = handleSymbolAttributes(node, layers) || [];

    // Exit when grouping is not needed
    return layers;
  }

  // Now build a group for all these children
  const styles = getComputedStyle(node);
  const {opacity} = styles;

  let group = new Group({x: left, y: top, width, height});
  const groupStyle = new Style();

  groupStyle.addOpacity(opacity);
  group.setStyle(groupStyle);
  group._nodeName = node.nodeName.toLowerCase();

  layers.forEach(layer => {
    // Layer positions are relative, and as we put the node position to the group,
    // we have to shift back the layers by that distance.
    layer._x -= left;
    layer._y -= top;

    group.addLayer(layer);
  });

  // Set the group name to the node's name, unless there is a name provider in the options
  if (options && options.getGroupName) {
    group.setName(options.getGroupName(node));
  } else {
    group.setName(`${node.nodeName.toLowerCase()}`);
  }

  // Handling 'data-sketchapp-...' attributes
  group = handleSymbolAttributes(node, group);

  return group;
}
