import UI from 'sketch/ui';
import {fromSJSONDictionary} from 'sketchapp-json-plugin';
import {fixTextLayer, fixSharedTextStyle} from './helpers/fixFont';
import fixImageFillsInLayer from './helpers/fixImageFill';
import fixBitmap from './helpers/fixBitmap';
import fixSVGLayer from './helpers/fixSVG';
import zoomToFit from './helpers/zoomToFit';
import collapseAllGroups from './helpers/collapseAllGroups';

function removeExistingLayers(context) {
  if (context.containsLayers()) {
    const loop = context.children().objectEnumerator();
    let currLayer = loop.nextObject();

    while (currLayer) {
      if (currLayer !== context) {
        currLayer.removeFromParent();
      }
      currLayer = loop.nextObject();
    }
  }
}

function getNativeLayer(failingLayers, layer) {
  // debug
  // console.log('Processing ' + layer.name + ' (' + layer._class + ')');

  if (layer._class === 'text') {
    fixTextLayer(layer);
  } else if (layer._class === 'svg') {
    fixSVGLayer(layer);
  } else if (layer._class === 'bitmap') {
    fixBitmap(layer);
  } else {
    fixImageFillsInLayer(layer);
  }

  // Create native object for the current layer, ignore the children for now
  // this alows us to catch and ignore failing layers and finish the import
  const children = layer.layers;
  let nativeObj = null;

  layer.layers = [];

  try {
    nativeObj = fromSJSONDictionary(layer);
  } catch (e) {
    failingLayers.push(layer.name);

    console.log('Layer failed to import: ' + layer.name);
    return null;
  }

  // Get native object for all child layers and append them to the current object
  if (children && children.length) {
    children.forEach(child => {
      const nativeChild = getNativeLayer(failingLayers, child);

      if (nativeChild) {
        nativeObj.addLayer(nativeChild);
      }
    });
  }

  return nativeObj;
}

function removeSharedTextStyles(document) {
  document.documentData().layerTextStyles().setObjects([]);
}

function addSharedTextStyle(document, style) {
  const textStyles = context.document.documentData().layerTextStyles();

  if (textStyles.addSharedStyleWithName_firstInstance) {
    // Sketch < 50
    textStyles.addSharedStyleWithName_firstInstance(style.name, fromSJSONDictionary(style.value));
  } else {
    // Sketch 50, 51
    // addSharedStyleWithName_firstInstance was removed in Sketch 50
    const allocator = MSSharedStyle.alloc();
    let sharedStyle;

    if (allocator.initWithName_firstInstance) {
      sharedStyle = allocator.initWithName_firstInstance(style.name, fromSJSONDictionary(style.value));
    } else {
      sharedStyle = allocator.initWithName_style(style.name, fromSJSONDictionary(style.value));
    }

    textStyles.addSharedObject(sharedStyle);

    if (style.value.sharedObjectID) {
      sharedStyle.objectID = style.value.sharedObjectID;
    }

    const sharedStyles = textStyles.sharedStyles();

    for (let i = 0; i < sharedStyles.length; ++i) {
      if (String(sharedStyles[i].objectID()) === style.value.sharedObjectID) {
        sharedStyles[i].value().sharedObjectID = style.value.sharedObjectID;
        console.log('Style added for sharedObjectID: ' + style.value.sharedObjectID);
      }
    }
  }
}

function removeSharedColors(document) {
  const assets = document.documentData().assets();

  assets.removeAllColors();
}

function addSharedColor(document, colorJSON) {
  const assets = document.documentData().assets();
  const color = fromSJSONDictionary(colorJSON);

  assets.addColor(color);
}

export default function asketch2sketch(context, asketchFiles) {
  const document = context.document;
  const page = document.currentPage();

  let asketchDocument = null;
  let asketchPage = null;

  asketchFiles.forEach(asketchFile => {
    if (asketchFile && asketchFile._class === 'document') {
      asketchDocument = asketchFile;
    } else if (asketchFile && asketchFile._class === 'page') {
      asketchPage = asketchFile;
    }
  });

  if (asketchDocument) {
    removeSharedColors(document);
    removeSharedTextStyles(document);

    let alertMsg = '';

    if (asketchDocument.assets.colors) {
      asketchDocument.assets.colors.forEach(color => addSharedColor(document, color));

      const colorsMsg = 'Shared colors added: ' + asketchDocument.assets.colors.length;

      console.log(colorsMsg);
      alertMsg += colorsMsg + '\n';
    }

    if (asketchDocument.layerTextStyles && asketchDocument.layerTextStyles.objects) {
      asketchDocument.layerTextStyles.objects.forEach(style => {
        fixSharedTextStyle(style);
        addSharedTextStyle(document, style);
      });

      const textStylesMsg = 'Shared text styles added: ' + asketchDocument.layerTextStyles.objects.length;

      console.log(textStylesMsg);
      alertMsg += textStylesMsg + '\n';
    }
    if (alertMsg) {
      UI.alert('asketch2sketch', alertMsg);
    }
  }

  if (asketchPage) {
    removeExistingLayers(page);

    page.name = asketchPage.name;

    const failingLayers = [];

    asketchPage.layers
      .map(getNativeLayer.bind(null, failingLayers))
      .forEach(layer => layer && page.addLayer(layer));

    if (failingLayers.length === 1) {
      UI.alert('asketch2sketch', `One layer couldn't be imported and was skipped. 
        layer.name: ${failingLayers[0].name} 
        layer.do_objectID: ${failingLayers[0].do_objectID} 
        layer.toString(): ${failingLayers[0].toString()}`);
    } else if (failingLayers.length > 1) {
      UI.alert('asketch2sketch', `${failingLayers.length} layers couldn't be imported and were skipped. 
        Failing layers: ${failingLayers.toString().substring(0, 300)}`);
    } else {
      const emojis = ['👌', '👍', '✨', '😍', '🍾', '🤩', '🎉', '👏', '💪', '🤘', '💅', '🏆', '🚀'];

      UI.message(`Import successful ${emojis[Math.floor(emojis.length * Math.random())]}`);
    }

    zoomToFit(context);
    collapseAllGroups(context);
  }
}
