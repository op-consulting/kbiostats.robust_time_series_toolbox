import math
import sequtils
import nimstats/nimstats
import nimstats/rits
###########################################################
type RobustInterruptedCandidateModel* = ref object
  after_model*: OLSModel
  before_model*: OLSModel
  after_residual_model*: OLSModel
  before_residual_model*: OLSModel
  loglikelihood*: float
  change_point_candidate*: int
  parameters_mean*: vector
  #
  before_model_covariance_parameters: matrix
  existence_change_point_hypothesis: HypothesisScore[ChiSquare]

type FlattenEstimator* = ref object
  mean*: float
  standard_deviation*: float
  confidence_interval*: seq[float]
  p_value*: float
  t_value*: float
  score*: float

proc flatten[T](estimator: SimpleEstimator[T]): FlattenEstimator =
  new result
  result.mean = estimator.estimate
  result.standard_deviation = estimator.standard_deviation
  result.confidence_interval = estimator.confidence_interval
  result.p_value = estimator.p_value
  result.score = estimator.test_score
  result.t_value = estimator.test_score
  
type FlattenHypothesisTest* = ref object
  score: float
  p_value: float
  null_confidence_interval: seq[float]
  distribution: string

proc flatten[T](test: HypothesisScore[T]): FlattenHypothesisTest =
  new result
  result.score = test.test_score
  result.p_value = test.p_value
  result.null_confidence_interval = test.null_confidence_interval
  result.distribution = $(test.distribution)

type RITSResiduals* = ref object
  values: seq[float]
  autocorrelation: seq[float]
  autocorrelation_null_confidence_interval: seq[float]

type RITSPeriod* = ref object
  slope*: FlattenEstimator
  intercept*: FlattenEstimator
  autocorrelation*: FlattenEstimator
  noise*: FlattenEstimator
  residuals*: RITSResiduals

proc newRITSPeriod(): RITSPeriod =
  new result
  new result.slope
  new result.intercept
  new result.autocorrelation
  new result.noise
  new result.residuals

type RobustInterruptedModel* = ref object
  change_point_candidates*: seq[int]
  loglikelihood_candidates*: seq[float]

  change_point_index*: int
  change_point_x*: float

  initial*: RITSPeriod
  increment_change*: RITSPeriod

  existence_change_point_hypothesis*: FlattenHypothesisTest

type RobustInterruptedModelSet* = ref object
  models*: seq[RobustInterruptedModel]
  existence_change_point_hypothesis*: FlattenHypothesisTest

proc clean_nan(v: vector, d: float=NegInf): vector = v.mapIt(if it.classify == fcNan: d else: it)

proc flatten(model: RITSModel): RobustInterruptedModel =
  new result
  result.initial = newRITSPeriod()
  result.increment_change = newRITSPeriod()

  result.change_point_candidates = model.change_point_candidates
  result.loglikelihood_candidates = model.loglikelihood_candidates.clean_nan
  #
  result.change_point_index = model.change_point_index
  result.change_point_x = model.change_point_x
  #
  let
    acf1 = model.model.before_residual_model.residuals.clean_nan.autocorrelation_function(max_lags=100)
    acf2 = model.model.after_residual_model.residuals.clean_nan.autocorrelation_function(max_lags=100)
  result.initial.slope = model.model.before_model.coefficients[0].flatten
  result.initial.intercept = model.model.before_model.coefficients[1].flatten
  result.initial.autocorrelation = model.model.before_residual_model.coefficients[0].flatten
  result.initial.noise = model.model.before_residual_model.noise_variance.flatten
  result.initial.residuals.values = model.model.before_residual_model.residuals.clean_nan
  result.initial.residuals.autocorrelation = acf1.estimators_mean.clean_nan(0.0)
  result.initial.residuals.autocorrelation_null_confidence_interval = acf1.null_distribution.confidence_interval
  result.increment_change.slope = model.model.after_model.coefficients[0].flatten
  result.increment_change.intercept = model.model.after_model.coefficients[1].flatten
  result.increment_change.autocorrelation = model.model.after_residual_model.coefficients[0].flatten
  result.increment_change.noise = model.model.after_residual_model.noise_variance.flatten
  result.increment_change.residuals.values = model.model.after_residual_model.residuals.clean_nan
  result.increment_change.residuals.autocorrelation = acf2.estimators_mean.clean_nan(0.0)
  result.increment_change.residuals.autocorrelation_null_confidence_interval = acf2.null_distribution.confidence_interval
  #
  result.existence_change_point_hypothesis = model.model.existence_change_point_hypothesis.flatten

proc existence_change_point_hypothesis(test_scores: seq[float]): FlattenHypothesisTest {.exportc: "existence_change_point_hypothesis".} =
  let total_score = test_scores.len.toFloat * test_scores.min
  chisquare(dof=2.0*test_scores.len.toFloat).htest_score(total_score, test_type=oneTailed).flatten

proc robust_interrupted_time_series(x: vector, y: vector, change_point_candidates_start: int, change_point_candidates_end: int): RobustInterruptedModel  {.exportc: "robust_interrupted_time_series".} =
  let model = rits_model(x, y, change_point_candidates_start, change_point_candidates_end)
  echo model
  model.flatten
  
proc robust_interrupted_time_series_approximated(sampling: int, x: vector, y: vector, change_point_candidates_start: int, change_point_candidates_end: int): RobustInterruptedModel  {.exportc: "robust_interrupted_time_series_approximated".} =
  let model = rits_model(x.subsample(sampling), y, (change_point_candidates_start.toFloat/sampling.toFloat).toInt, (change_point_candidates_end.toFloat/sampling.toFloat).toInt)
  echo model
  model.flatten
  