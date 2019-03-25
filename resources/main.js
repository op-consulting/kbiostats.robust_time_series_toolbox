try {
    var _global = global;
} finally {
    var _global = window;
}
var riot = require("./lib/riot@3.13/riot+compiler.js");
_global.riot = riot;
var papaparse = require("./lib/papaparse@4.6.1/papaparse.js");
//require("./lib/three.js@55/three.js");
//require("./lib/three.js@55/loaders/STLLoader.js");
//require("./lib/three.js@55/controls/TrackballControls.js");
require("./lib/nv.d3@1.1.11b/d3.v3.js");
require("./lib/nv.d3@1.1.11b/nv.d3.js");
var sortable = require("./lib/sortable.js@1.8.3/Sortable.js");
var jQuery = require("./lib/jquery@3.3.1/jquery.js");
_global.jQuery = jQuery;
var jQuery = require("./lib/jquery@3.3.1/jquery.js");

var metro = require("./lib/metroui@4.2.38/metro.js");
//
var np = require("./lib/numjs@0.15.1/numjs.js");
_global.np = np;
var st = require("./lib/jstat@1.7.1/jstat.js");
_global.st = st;
var moment = require("./lib/moments.js@2.24.0/moment.js");
_global.moment = moment;
var SVG = require("./lib/svg.js@2.5.0/svg.js");
_global.SVG = SVG;

var ApexCharts = require("./lib/apexcharts@3.5.0/apexcharts.js");
//var ApexCharts = require("./lib/apexcharts@3.6.3/apexcharts.js");
_global.ApexCharts = ApexCharts;

var Split = require("./lib/split.js@1.5.10/split.js");
_global.Split = Split;

var RTSModel = require("./lib/rtsjs@1.0.0/rtsjs.js");

/*
riot.compile("components/rts-main-window@1.0.html");
riot.compile("components/rts-ribbon-menu-bar@1.0.html");
riot.compile("components/rts-configuration-changepoint-panel@1.0.html");
riot.compile("components/rts-configuration-date-panel@1.0.html");
riot.compile("components/rts-configuration-panel@1.0.html");

riot.compile("components/rts-outline-units-panel@1.0.html");
riot.compile("components/rts-outline-plots-panel@1.0.html");
riot.compile("components/rts-outline-panel@1.0.html");

riot.compile("components/rts-three-column-panel@1.0.html");

*/

riot.mount('rts-main-window');


let data_source;
let model_parameters;
let models;
window.models = models;

var plot_collection = null;
var plot_thumbnails = null;
setTimeout(() => {
    console.log(111)
    if (document.querySelector(".plot_container") == null) return;
    Metro.infobox.create(`
        <h3>Rendering plots</h3>
        <p>Please wait until the graphs are plotted...</p>
    `, "", {
        closeButton: false,
        onOpen: function () {
            data_source = new RTSModel.ModelDataSourceLargeTest();
            model_parameters = new RTSModel.ModelParameters();
            model_parameters.theoretical_executive_time_point = 120;
            model_parameters.candidate_before_tet = 20;
            model_parameters.candidate_after_tet = 20;
            models = data_source.units.map(unit_name => {
                let m = new RTSModel.RTSModel(model_parameters, data_source, unit_name);
                //m.logLikelihoodInfo;
                return m;
            });

            var ib = jQuery(this).data("infobox");
            plot_collection = new RTSModel.PlotCollector(document.querySelector(".plot_container"), models);
            plot_thumbnails = new RTSModel.PlotThumbnailsCollector(models);
            plot_collection.filterByUnits.apply(plot_collection, data_source.units);
            setTimeout(() => {
                ib.close();
            }, 100);
        }
    });
    
    //
    data_source.units.forEach((unit_name, k) => {
        const data_values = data_source.valuesOfUnit(unit_name);
        const max_data_values = np.max(data_values);
        const min_data_values = np.min(data_values);
        const L = 100.0;
        const N = data_values.length;
        const m = 50;
        let x_y = [
            [0, 100]
        ];
        for (let _t = 0; _t < m; _t++) {
            let d = L - L * (data_values[Number.parseInt(_t * N / m)] - min_data_values) / (max_data_values - min_data_values);
            x_y.push([_t * L / m, d - 6]);
        }
        x_y.push([100, 100]);
        //////
        var elements = SVG.select('.unit-miniplot.unit-' + (k + 1)).fill('rgb(58, 139, 199)')
        elements.members.forEach((element) => {
            element.clear();
            let polyline = element.polyline().style({
                "stroke": "#1979ca",
                "stroke-width": "5px",
                "fill": "rgba(25, 121, 202, 0.6)",
            });
            polyline.plot(x_y);
        });
        //////
    });
}, 3600*1000);
//