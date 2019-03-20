import {generateID, makeColorFromCSS} from '../helpers/utils';

function pageToPageReference(page) {
  return {
    '_class': 'MSJSONFileReference',
    '_ref_class': 'MSImmutablePage',
    '_ref': `pages/${page.getID()}`
  };
}

function textStyleToSharedStyle(textLayer, id) {
  return {
    '_class': 'sharedStyle',
    'do_objectID': textLayer._objectID ? textLayer._objectID : id || generateID(),
    name: textLayer._name,
    'style': textLayer._style.toJSON()
  };
}

class Document {
  constructor() {
    this._objectID = generateID();
    this._colors = [];
    this._colorAssets = [];
    this._textStyles = [];
    this._pages = [];
  }

  setId(id) {
    this._objectID = id;
  }

  setName(name) {
    this._name = name;
  }

  setObjectID(id) {
    this._objectID = id;
  }

  addPage(page) {
    this._pages.push(page);
  }

  addTextStyle(textLayer, id) {
    this._textStyles.push(textStyleToSharedStyle(textLayer, id));
  }

  addColor(color, name) {
    this._colors.push(makeColorFromCSS(color));
    this._colorAssets.push({
      '_class': 'MSImmutableColorAsset',
      'name': name,
      'color': makeColorFromCSS(color)
    });
  }

  toJSON() {
    return {
      '_class': 'document',
      'do_objectID': this._objectID,
      'assets': {
        '_class': 'assetCollection',
        'colors': this._colors,
        'colorAssets':  this._colorAssets
      },
      'currentPageIndex': 0,
      'enableLayerInteraction': true,
      'enableSliceInteraction': true,
      'foreignSymbols': [],
      'layerStyles': {
        '_class': 'sharedStyleContainer',
        'objects': []
      },
      'layerSymbols': {
        '_class': 'symbolContainer',
        'objects': []
      },
      'layerTextStyles': {
        '_class': 'sharedTextStyleContainer',
        'objects': this._textStyles
      },
      'pages': this._pages.map(pageToPageReference)
    };
  }
}

export default Document;
