# SVG-Controller
#### JavaScript library that allows you to control SVG files with touches (pan and zoom). Best suited for mobile devices.
#### The controller do not require any additional libraries.
## Usage:

### Initialization:
1.  Add `svgController.js` to your work directory;
2.  Include the file to your project (`<script src="your path/svgController.js"></script>`);
3.  Create instance: `var svg = new svgController;`;
4.  Initialize the instance by passing the identifier of the svg tag you want to control `svg.Init('your id');`.

### Settings:
* To control pan sensitivity use `svg.sens = your value`;
* Use `svg.zoomFrom` and `svg.zoomTo` to adjust how much to zoom the svg.
