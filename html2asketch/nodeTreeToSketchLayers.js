import nodeToSketchLayers from './nodeToSketchLayers';
import {isNodeVisible} from './helpers/visibility';
import {handleSymbolAttributes} from './helpers/symbolAttributes';

export default function nodeTreeToSketchLayers(node, options) {
  // Collect layers for the node level itself
  let layers = nodeToSketchLayers(node, {...options, layerOpacity: false}) || [];

  if (node.nodeName !== 'svg') {
    // Recursively collect child layers for child nodes
    Array.from(node.children).forEach(childNode => {
      if (isNodeVisible(childNode)) {
        const sublayers = nodeTreeToSketchLayers(childNode, options);

        sublayers.forEach(sublayer => layers.push(sublayer));
      }
    });
  }

  // Handling 'data-sketchapp-...' attributes
  layers = handleSymbolAttributes(node, layers);

  return layers;
}
