import Group from './model/group';
import Style from './model/style';
import nodeToSketchLayers from './nodeToSketchLayers';
import {isNodeVisible} from './helpers/visibility';
import {handleSymbolAttributes} from './helpers/symbolAttributes';

export default function nodeTreeToSketchGroup(node, options) {
  const bcr = node.getBoundingClientRect();
  const {left, top} = bcr;
  const width = bcr.right - bcr.left;
  const height = bcr.bottom - bcr.top;

  // Collect layers for the node level itself
  const layers = nodeToSketchLayers(node, {...options, layerOpacity: false}) || [];

  if (node.nodeName !== 'svg') {
    // Recursively collect child groups for child nodes
    Array.from(node.children).forEach(childNode => {
      if (isNodeVisible(childNode)) {
        layers.push(nodeTreeToSketchGroup(childNode, options));
      }
    });
  }

  // Now build a group for all these children

  const styles = getComputedStyle(node);
  const {opacity} = styles;

  let group = new Group({x: left, y: top, width, height});
  const groupStyle = new Style();

  groupStyle.addOpacity(opacity);
  group.setStyle(groupStyle);

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
