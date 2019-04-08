var {
  robust_interrupted_time_series,
  robust_interrupted_time_series_approximated,
  fix_vector
} = require("./model/rts-model.js")
exports.robust_interrupted_time_series = robust_interrupted_time_series
exports.robust_interrupted_time_series_approximated = robust_interrupted_time_series_approximated
exports.fix_vector = fix_vector

exports.supremum_wald_test = (models) => {
  if(!!models.supremum_wald_test)
    return models.supremum_wald_test
  var M = models.length
  var B = np.zeros(2 * M)
  var CVC = np.zeros([2 * M, 2 * M])
  for (var j = 0; j < M; j++) {
    B.set(2 * j, models[j].estimations.parameter_differences.intercept)
    B.set(2 * j + 1, models[j].estimations.parameter_differences.slope)
    var T = models[j].x.length
    var phi = models[j].estimations.before_change.autoregressive_structure.slope;
    var sigma2 = models[j].estimations.before_change.autoregressive_structure.slope_variance;
    var Sj = [...Array(T - 2).keys()].map((i) => ([...Array(T - 2).keys()].map((j) => sigma2 / (1 - phi * phi) * Math.pow(phi, Math.abs(i - j)))));
    var X = models[j].x.filter((i, t) => t < T - 2).map((i) => [1, i])
    var VB_j = st.inv(np.dot(np.dot(np.array(X).T, np.array(st.inv(Sj))), np.array(X)).tolist());
    var C_j = np.array([
      [1, 0],
      [0, 1]
    ])
    var CVC_j = np.dot(C_j.T, np.dot(VB_j, C_j));
    for (let i1 = 0; i1 < 2; i1++)
      for (let i2 = 0; i2 < 2; i2++)
        CVC.set(i1 + 2 * j, i2 + 2 * j, CVC_j.get(i1, i2))
  }
  var CVC_i = st.inv(CVC.tolist());
  var Wald_score = np.dot(B, np.dot(CVC_i, B.T)).tolist()[0];
  var p_value = 1 - st.chisquare.cdf(Wald_score, 2 * M);
  models.supremum_wald_test = {Wald_score, p_value}
  return p_value;
}

const fit_model = (dates, values, theoretical_change_point, candidates_before, candidates_after) => {
  let model = {};
  model.dates = dates
  model.x = [...Array(model.dates.length).keys()]
  model.change_point = {}
  model.change_point.theoretical = theoretical_change_point
  model.change_point.before = candidates_before
  model.change_point.after = candidates_after
  model.y = values
  model.estimations = robust_interrupted_time_series(model.x, model.y, model.change_point.theoretical,
    model.change_point.before, model.change_point.after);
  if(model.estimations.likelihood.change_points === null){
    model.estimations.likelihood.change_points = [0];
  }
  if(model.estimations.likelihood.loglikelihood === null){
    model.estimations.likelihood.loglikelihood = [-1e100];
  }
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