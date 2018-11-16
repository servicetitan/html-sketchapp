import {isGroup, isLayers, renameTextLayerInArray, renameTextLayerInGroup} from './utils';

export default function applyTextlabel(node, element) {
  const textlabel = node.getAttribute('data-sketch-textlabel') || false;

  if (textlabel && typeof textlabel === 'string') {
    //console.log(`Textlabel (${textlabel}) @`, element);

    if (isGroup(element)) {
      renameTextLayerInGroup(element, textlabel);
    }
    if (isLayers(element)) {
      renameTextLayerInArray(element, textlabel);
    }
  }

  return element;
}
