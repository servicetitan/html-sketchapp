import applyConstraints from './constraints';
import applyRotation from './rotation';
import applyPadding from './padding';
import applySpacing from './spacing';
import applyTextlabel from './textlabel';
import applyLocked from './locked';
import applyUngroup from './ungroup';

import {isGroup, isLayers} from './utils';

export function handleSymbolAttributes(node, element) {
  const debug = false;

  if (debug) {
    if (isGroup(element)) {
      console.log('Group:', element);
    }
    if (isLayers(element)) {
      console.log('Layers:', element);
    }
    if (!isGroup(element) && !isLayers(element)) {
      console.log('Wrong element. Not a group, nor array of layers:', element);
    }
  }

  element = applyConstraints(node, element);
  element = applyRotation(node, element);
  element = applyTextlabel(node, element);
  element = applyLocked(node, element);
  element = applyPadding(node, element);
  element = applySpacing(node, element);

  element = applyUngroup(node, element);

  return element;
}
