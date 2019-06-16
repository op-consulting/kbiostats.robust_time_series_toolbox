var {
  robust_interrupted_time_series,
  robust_interrupted_time_series_approximated,
  existence_change_point_hypothesis
} = require("./model/model")
exports.robust_interrupted_time_series = robust_interrupted_time_series
exports.robust_interrupted_time_series_approximated = robust_interrupted_time_series_approximated
exports.existence_change_point_hypothesis = existence_change_point_hypothesis
console.log(":: LOADING RITS Models")
const fit_model = (dates, values, theoretical_change_point, candidates_before, candidates_after) => {
  let model = {};
  model.dates = dates
  model.x = [...Array(model.dates.length).keys()]
  model.change_point = {}
  //Just for backcompatibility
  model.change_point.theoretical = theoretical_change_point
  model.change_point.before = candidates_before
  model.change_point.after = candidates_after
  //End backcompatibility
  model.change_point.min = theoretical_change_point - candidates_before
  model.change_point.max = theoretical_change_point + candidates_after
  model.y = values
  model.estimations = robust_interrupted_time_series(model.x, model.y,
    model.change_point.min, model.change_point.max);
  return model;
};
exports.fit_model = fit_model;

var {
  ModelDataSource,
  ModelDataSourceJson,
  ModelDataSourceTest,
  ModelDataSourceLargeTest
} = require("./model-datasources.js")
var {
  Stats,
  Model
} = require("./model-core.js")
var {
  CallbackEvent,
  ModelParameters
} = require("./model-parameters.js")
var {
  PlotTimeSeries,
  PlotLikelihood,
  PlotTimeSeriesEstimation,
  PlotPreResidualsHistogram,
  PlotPreResidualsHistogram,
  PlotPreResidualsACF,
  PlotPostResidualsHistogram,
  PlotPostResidualsACF,
  PlotCollector,
  PlotThumbnailsCollector
} = require("./model-plots.js")


exports.ModelDataSource = ModelDataSource;
exports.ModelDataSourceJson = ModelDataSourceJson;
exports.ModelDataSourceTest = ModelDataSourceTest;
exports.ModelDataSourceLargeTest = ModelDataSourceLargeTest;

exports.CallbackEvent = CallbackEvent;
exports.ModelParameters = ModelParameters;

exports.Stats = Stats;
exports.RTSModel = Model;

//exports.UnitModelPlotter = UnitModelPlotter;
exports.PlotTimeSeries = PlotTimeSeries;
exports.PlotLikelihood = PlotLikelihood;
exports.PlotTimeSeriesEstimation = PlotTimeSeriesEstimation;
exports.PlotPreResidualsHistogram = PlotPreResidualsHistogram;
exports.PlotPreResidualsACF = PlotPreResidualsACF;
exports.PlotPostResidualsHistogram = PlotPostResidualsHistogram;
exports.PlotPostResidualsACF = PlotPostResidualsACF;
exports.PlotCollector = PlotCollector;
exports.PlotThumbnailsCollector = PlotThumbnailsCollector;