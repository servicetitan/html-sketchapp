
# html-sketchapp [![npm version](https://badgen.now.sh/npm/v/@servicetitan/html-sketchapp)](https://www.npmjs.com/package/@servicetitan/html-sketchapp) [![npm downloads](https://badgen.now.sh/npm/dm/@servicetitan/html-sketchapp)](https://www.npmjs.com/package/@servicetitan/html-sketchapp)

[HTML to Sketch export solution](https://github.com/brainly/html-sketchapp/) customized by Servicetitan's team.

### Changes list
Added attributes that provide control over internal features of Sketch:
1. `data-sketch-constraints="31"` to set [resizing constrants](https://sketchapp.com/docs/layer-basics/constraints/), more info [here](https://medium.com/zendesk-engineering/reverse-engineering-sketchs-resizing-functionality-23f6aae2da1a) 
2. `data-sketch-rotation="18"` to control layer's rotation, similar to CSS's instruction `transform: 'rotate(18deg)`
(https://github.com/DWilliames/paddy-sketch-plugin))
3. `data-sketch-textlabel="Placeholder"` to add a label on closest text layer
4. `data-sketch-locked` to lock layer
5. `data-sketch-ungroup` to ungroup node's layer
6. `data-sketch-padding="10 16"` to add padding around layer (utilizing [Paddy plugin](https://github.com/DWilliames/paddy-sketch-plugin))
7. `data-sketch-spacing="10 20"` to add some spacing between same level layers (utilizing  [Paddy plugin](https://github.com/DWilliames/paddy-sketch-plugin))

Added some other crucial changes:
1. ability to set constraint on text layers
2. support of SVG rendering 
3. support of dashed borders 
4. support of updatable shared text styles
5. support for shared colors with names in Sketch (aka color presets)

### Fixes
* Fix of shadowObj.spread miscalculation
* Fix unexpected line wrapping of texts in Sketch for on half of a pixel rounding
* Ability to manually set `_objectID` with `setObjectID()` on any object
* Added console.log() message with imported objects count on importing asketch.json in Sketch (asketch2sketch plugin)
* Added warning for unsupported Sketch styles (different borders, outlines, rotations)

### Install html-sketchapp

You can get Servicetitan's version of html-sketchapp from NPM.

```
npm i @servicetian/html-sketchapp
```
