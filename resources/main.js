//////////////////////////////////////////////
// Global variables
//////////////////////////////////////////////
try {
    var _global = global;
} finally {
    var _global = window;
}
//////////////////////////////////////////////
// Component compiler
//////////////////////////////////////////////
_global.riot = require("./lib/riot@3.13/riot+compiler.js");

// CSV library
_global.papaparse = require("./lib/papaparse@4.6.1/papaparse.js");

// 3D library
//require("./lib/three.js@55/three.js");
//require("./lib/three.js@55/loaders/STLLoader.js");
//require("./lib/three.js@55/controls/TrackballControls.js");

// SVG-based charting library
//require("./lib/nv.d3@1.1.11b/d3.v3.js");
//require("./lib/nv.d3@1.1.11b/nv.d3.js");

// Sortable list
_global.sortable = require("./lib/sortable.js@1.8.3/Sortable.js");

// HTML's cancer: jQuery
_global.jQuery = require("./lib/jquery@3.3.1/jquery.js");

// UI's interface
_global.metro = require("./lib/metroui@4.2.38/metro.js");

// Math library
_global.np = require("./lib/numjs@0.15.1/numjs.js");

// Math library
_global.mathjs = require("./lib/mathjs@5.8.0/math.js");

// Stat library
_global.st = require("./lib/jstat@1.7.1/jstat.js");

// Time/Date parsing library
_global.moment = require("./lib/moments.js@2.24.0/moment.js");

// SVG manipulation library
_global.SVG = require("./lib/svg.js@2.5.0/svg.js");

// Charting library (modified)
_global.Dygraph = require("./lib/dygraph@2.1.0/dygraph.js");
//require("./lib/dygraph@2.1.0/hairlines.js");
//require("./lib/dygraph@2.1.0/super-annotations.js");
//require("./lib/dygraph@2.1.0/synchronizer.js");
//require("./lib/dygraph@2.1.0/synchronizer-master-slave.js");
//_global.Plotly = require("./lib/plotly.js@1.45.3/plotly.js");

// Charting library (modified)
_global.ApexCharts = require("./lib/apexcharts@3.5.0/apexcharts.js");

// Panel spliting
_global.Split = require("./lib/split.js@1.5.10/split.js");

// Rendering images
_global.domtoimage = require("./lib/dom-to-image@2.6.0/dom-to-image.js");

// Creating report
_global.htmlDocx = require("./lib/html-docx-js@0.3.1/html-docx.js");

// String formatting
_global.formatter = require("./lib/agh.sprintf.js@1.0/agh.sprintf.js");

// Components
require("./src/op-components@2.0/components.js");
//require("./src/rtsjs@2.0/components/components.js");
require("./src/ritsjs@3.0/components/components.js");

// Main Model
//_global.RTSModel = require("./src/rtsjs@2.0/rtsjs.js");
_global.RTSModel = require("./src/ritsjs@3.0/ritsjs.js");

riot.mount('rts-main-window');

