import math
import stats
import strformat


###########################################################
# OPERATIONS
#const M = 120000
const M = 50000
type Vector = object
  length: int
  data*: ref array[M, float32]

proc vector(v: openArray[int]): Vector =
  new result.data
  result.length = v.len
  var i: int = 0
  for k in v.low..v.high:
    result.data[i] = v[k].float;
    inc(i)
  result.length = i
  result

proc vector(v: openArray[float]): Vector =
  new result.data
  result.length = v.len
  var i: int = 0
  for k in v.low..v.high:
    result.data[i] = v[k];
    inc(i)
  result.length = i
  result

# SIZE 
proc len(v: Vector): int {.inline.} = v.length
proc high(v: Vector): int {.inline.} = v.length - 1
proc low(v: Vector): int {.inline.} = 0

# TO STRING
proc `$`(v: Vector): string {.inline.} =
  result = "["
  for k in v.low..v.high:
    result &= fmt"{v.data[k]:.04f}"
    if k != v.high:
      result &= ", "
  result &= "]"



# ACCESSORS
proc `[]`*(v: Vector, i: int): float {.inline.} =
  assert(i >= 0, "Negative index")
  assert(i < v.len, "Index out of bounds")
  v.data[i]

proc `[]=`*(v: var Vector, i: int, val:float) {.inline.} =
  assert(i >= 0, "Negative index")
  assert(i < M, "Index out of bounds")
  if i >= v.length:
    v.length = i + 1
  v.data[i] = val

# ACCESSORS
proc `[]`*(v: Vector, idx: HSlice[int, int]): Vector {.inline.} =
  new result.data
  var k = 0
  for i in idx:
    assert(i >= 0, "Negative index")
    assert(i < v.len, "Index out of bounds")
    result.data[k] = v.data[i]
    inc(k)
  result.length = k

proc `[]=`*(v: var Vector, idx: HSlice[int, int], val:float) {.inline.} =
  for i in idx:
    assert(i >= 0, "Negative index")
    assert(i < M, "Index out of bounds")
    if i >= v.length:
      v.length = i + 1
    v.data[i] = val

proc `[]=`*(v: var Vector, idx: HSlice[int, int], w: var Vector) {.inline.} =
  assert(idx.b - idx.a + 1 == w.len, "Assign vector in a wrong size")
  var k = 0
  for i in idx:
    assert(i >= 0, "Negative index")
    assert(i < M, "Index out of bounds")
    if i >= v.length:
      v.length = i + 1
    v.data[i] = w[k]
    inc(k)

# ELEMENT-WISE SUM VECTOR
proc `+`*(v: Vector, w: Vector): Vector {.inline.}=
  new result.data
  for i in v.low..v.high:
    result[i] = v[i] + w[i]

proc `+`*(v: Vector, k: float): Vector {.inline.} =
  new result.data
  for i in v.low..v.high:
    result[i] = v[i] + k

proc `+`*(k: float, v: Vector): Vector {.inline.} = v + k

proc `+`*(v: Vector, k: int): Vector {.inline.} = v + k.float

proc `+`*(k: int, v: Vector): Vector {.inline.} = v + k.float

# ELEMENT-WISE DIFFERENCE VECTOR
proc `-`*(v: Vector, w: Vector): Vector {.inline.}=
  new result.data
  for i in v.low..v.high:
    result[i] = v[i] - w[i]

proc `-`*(v: Vector, k: float): Vector {.inline.} =
  new result.data
  for i in v.low..v.high:
    result[i] = v[i] - k

proc `-`*(k: float, v: Vector): Vector {.inline.} =
  new result.data
  for i in v.low..v.high:
    result[i] = k - v[i]

proc `-`*(v: Vector, k: int): Vector {.inline.} = v - k.float

proc `-`*(k: int, v: Vector): Vector {.inline.} = k.float - v

# ELEMENT-WISE PRODUCT VECTOR
proc `.*`*(v: Vector, w: Vector): Vector {.inline.}=
  new result.data
  for i in v.low..v.high:
    result[i] = v[i] * w[i]

proc `.*`*(v: Vector, k: float): Vector {.inline.} =
  new result.data
  for i in v.low..v.high:
    result[i] = v[i] * k

proc `.*`*(k: float, v: Vector): Vector {.inline.} = v .* k

proc `.*`*(v: Vector, k: int): Vector {.inline.} = v .* k.float

proc `.*`*(k: int, v: Vector): Vector {.inline.} = k.float .* v

proc `*`*(v: Vector, k: float): Vector {.inline.} = v .* k
proc `*`*(k: float, v: Vector): Vector {.inline.} = k .* v
proc `*`*(v: Vector, k: int): Vector {.inline.} = v .* k
proc `*`*(k: int, v: Vector): Vector {.inline.} = k .* v

# ELEMENT-WISE DIVISION VECTOR
proc `./`*(v: Vector, w: Vector): Vector {.inline.}=
  new result.data
  for i in v.low..v.high:
    result[i] = v[i] / w[i]

proc `./`*(v: Vector, k: float): Vector {.inline.} =
  new result.data
  for i in v.low..v.high:
    result[i] = v[i] / k

proc `./`*(k: float, v: Vector): Vector {.inline.} =
  new result.data
  for i in v.low..v.high:
    result[i] = k / v[i]

proc `./`*(v: Vector, k: int): Vector {.inline.} = v ./ k.float

proc `./`*(k: int, v: Vector): Vector {.inline.} = k.float ./ v

proc `/`*(v: Vector, k: float): Vector {.inline.} = v ./ k
proc `/`*(k: float, v: Vector): Vector {.inline.} = k ./ v
proc `/`*(v: Vector, k: int): Vector {.inline.} = v ./ k
proc `/`*(k: int, v: Vector): Vector {.inline.} = k ./ v

# ELEMENT-WISE POWER VECTOR
proc `^` (v: float32, w: float32): float32 {.inline.} = pow(v, w)

proc `.^`*(v: Vector, w: Vector): Vector {.inline.}=
  new result.data
  for i in v.low..v.high:
    result[i] = v[i] ^ w[i]

proc `.^`*(v: Vector, k: float): Vector {.inline.} =
  new result.data
  for i in v.low..v.high:
    result[i] = v[i] ^ k

proc `.^`*(k: float, v: Vector): Vector {.inline.} =
  new result.data
  for i in v.low..v.high:
    result[i] = k ^ v[i]

proc `.^`*(v: Vector, k: int): Vector {.inline.} = v .^ k.float

proc `.^`*(k: int, v: Vector): Vector {.inline.} = k.float .^ v

proc `^`*(v: Vector, k: float): Vector {.inline.} = v .^ k
proc `^`*(k: float, v: Vector): Vector {.inline.} = k .^ v
proc `^`*(v: Vector, k: int): Vector {.inline.} = v .^ k
proc `^`*(k: int, v: Vector): Vector {.inline.} =  k .^ v

# DOT PRODUCT VECTOR
proc dot(v: Vector, w: Vector): float {.inline.} =
  for i in v.low..v.high:
    result += v[i] * w[i]

proc `*`*(v: Vector, w: Vector): float {.inline.} = dot(v, w)

###########################################################
# BASIC STATISTICS
proc sum*(v: Vector): float  {.inline.} = v.data[].sum
proc mean*(v: Vector): float  {.inline.} = v.sum / v.len.float
proc avg*(v: Vector): float  {.inline.} = mean(v)
proc variance*(v: Vector): float  {.inline.}= (v .* v).sum / v.len.float - v.mean ^ 2
proc covariance*(v: Vector, w: Vector): float  {.inline.}= dot(v, w) / v.len.float - v.mean * w.mean

proc student_t_ppf_95p(df: int): float {.inline.} =
  const table_ppf = [1.0e50, 12.71, 4.303, 3.182, 2.776, 2.571, 2.447, 2.365,
  2.306, 2.262, 2.228, 2.201, 2.179, 2.160, 2.145, 2.131,
  2.120, 2.110, 2.101, 2.093, 2.086, 2.080, 2.074, 2.069,
  2.064, 2.060, 2.056, 2.052, 2.048, 2.045, 2.042, 2.021,
  2.009, 2.000, 1.990, 1.984, 1.980, 1.960]
  if df > table_ppf.len:
    return table_ppf[table_ppf.high]
  elif df <= 1:
    return table_ppf[1]
  return table_ppf[df]

proc student_t_ppf_95p(df: float): float {.inline.} =
  student_t_ppf_95p(df.int)

###########################################################

type MeanEstimates = object
  beta_0: float
  beta_1: float
  delta_0: float
  delta_1: float
  variance_pre: float
  variance_post: float

type LinearRegressionParameters = object
  intercept: float
  intercept_variance: float 
  intercept_confidence_interval: array[2, float]
  intercept_width_confidence_interval: float 
  #
  slope: float
  slope_variance: float
  slope_confidence_interval: array[2, float]
  slope_width_confidence_interval: float
  #
  R2: float
  #
  residual_sum_squares: float
  residual_variance: float
  n: int

type AR1Ma1ModelParameters = object
  mean_structure: LinearRegressionParameters
  autoregressive_structure: LinearRegressionParameters

type LikelihoodResult = object
  loglikelihood: float
  before_change: AR1Ma1ModelParameters
  after_change: AR1Ma1ModelParameters

type LikelihoodModel = object
  change_points: seq[int]
  loglikelihood: seq[float]
  best_loglikelihood: float
  best_likelihood: float
  best_time: int

type RobustInterruptedModel = object
  before_change: AR1Ma1ModelParameters
  after_change: AR1Ma1ModelParameters
  likelihood: LikelihoodModel

proc `$`(params: LinearRegressionParameters): string =
  fmt"""
    slope: {params.slope:.3f} (var: {params.slope_variance:.3f}, CI width: {params.slope_width_confidence_interval:.3f})
    intercept: {params.intercept:.3f} (var: {params.intercept_variance:.3f}, CI width: {params.intercept_width_confidence_interval:.3f})
    R2: {params.R2:.3f}
    SSE: {params.residual_sum_squares:.3f}"""

# y = ax + b
proc simple_linear_regression(X: Vector, Y: Vector): LinearRegressionParameters {.exportc.} =
  let
    n = X.len.float
    Sx = X.sum
    Sxx = (X .* X).sum
    Sy = Y.sum
    Sxy = (X .* Y).sum
    Syy = (Y .* Y).sum
  result.n = n.int
  result.slope = (n * Sxy - Sx * Sy) / (n * Sxx - Sx ^ 2)
  result.intercept = (Sy / n - result.slope * Sx / n)
  #
  result.R2 = (n * Sxy - Sx * Sy) ^ 2 / (n * Sxx - Sx ^ 2) / (n * Syy - Sy ^ 2)
  #
  result.residual_sum_squares = ((Y - (result.intercept + result.slope * X)) .^ 2.0).sum
  result.residual_variance = (n * Syy - Sy ^ 2 - result.slope ^ 2 * (n * Sxx - Sx ^ 2))/(n * n - 2 * n)
  #
  result.slope_variance = n * result.residual_variance / (n * Sxx - Sx ^ 2)
  result.intercept_variance = result.slope_variance * Sxx / n
  #
  result.slope_width_confidence_interval = 2.0 * sqrt(result.slope_variance) * student_t_ppf_95p(n - 2)
  result.slope_confidence_interval[0] = result.slope - 0.5 * result.slope_width_confidence_interval
  result.slope_confidence_interval[1] = result.slope + 0.5 * result.slope_width_confidence_interval
  result.intercept_width_confidence_interval = 2.0 * sqrt(result.intercept_variance) * student_t_ppf_95p(n - 2)
  result.intercept_confidence_interval[0] = result.intercept - 0.5 * result.intercept_width_confidence_interval
  result.intercept_confidence_interval[1] = result.intercept + 0.5 * result.intercept_width_confidence_interval

# y = ax + b
proc simple_linear_regression_wo_intercept(X: Vector, Y: Vector): LinearRegressionParameters {.exportc.} =
  let
    n = X.len.float
    Sx = X.sum
    Sxx = (X .* X).sum
    Sy = Y.sum
    Sxy = (X .* Y).sum
    Sxxyy = ((X .* Y) .* (X .* Y)).sum
    Syy = (Y .* Y).sum
  result.n = n.int
  result.slope = (n * Sxy - Sx * Sy + Sx * Sy) / (n * Sxx - Sx ^ 2 + Sx * Sx)
  result.intercept = 0
  #
  result.R2 = Sxy ^ 2 / (Sxx * Syy) # Sample R2, by the model it is assumed that E[Y] = 0
  #
  result.residual_sum_squares = ((Y - (result.slope .* X)) .^ 2.0).sum
  result.residual_variance = result.residual_sum_squares / (n - 1)
  #
  result.slope_variance = result.residual_variance / (Sxx)
  result.intercept_variance = 0
  #
  result.slope_width_confidence_interval = 2.0 * sqrt(result.slope_variance) * student_t_ppf_95p(n - 1)
  result.slope_confidence_interval[0] = result.slope - 0.5 * result.slope_width_confidence_interval
  result.slope_confidence_interval[1] = result.slope + 0.5 * result.slope_width_confidence_interval
  result.intercept_width_confidence_interval = 0
  result.intercept_confidence_interval[0] = 0
  result.intercept_confidence_interval[1] = 0

# OLS Method
# y[t] = a x[t] + b + r[t]
# r[t] = p r[t-1] + e
#   =>  r[t:1] = p r[t-1:0] + e[t: 1]
proc arma(X: Vector, Y: Vector): AR1Ma1ModelParameters {.exportc.} =
  result.mean_structure = simple_linear_regression(X, Y)
  let residuals = Y - (result.mean_structure.intercept + result.mean_structure.slope * X)
  result.autoregressive_structure = simple_linear_regression_wo_intercept(residuals[0..(residuals.high - 1)], residuals[1..residuals.high])

proc normal_loglikelihood(X: Vector, Y: Vector, slope: float, intercept: float, sigma2: float): float =
  let
    n = X.len.float
  result = -0.5 * n * ln(2 * PI * sigma2)
  result -= ((Y - (intercept + slope * X)) .^ 2).sum / (2 * sigma2)

proc analysis_at_point_t(X: Vector, Y: Vector, change_point: int): LikelihoodResult =
  let
    N = X.len
    #
    X_before = X[0..(change_point-1)]
    Y_before = Y[0..(change_point-1)]
    #
    X_after = X[0..(change_point-1)]
    Y_after = Y[0..(change_point-1)]
  result.before_change = arma(X_before, Y_before)
  result.loglikelihood += normal_loglikelihood(X_before, Y_before, result.before_change.mean_structure.slope, result.before_change.mean_structure.intercept, result.before_change.autoregressive_structure.residual_variance)
  result.after_change = arma(X_after, Y_after)
  result.loglikelihood += normal_loglikelihood(X_after, Y_after, result.after_change.mean_structure.slope, result.after_change.mean_structure.intercept, result.after_change.autoregressive_structure.residual_variance)


proc robust_interrupted_time_series(X: Vector, Y: Vector, change_point: int, candidates_before: int, candidates_after: int): RobustInterruptedModel =
  var
    ll_result: LikelihoodResult
  result.likelihood.best_loglikelihood = -1e-100
  for t in (change_point - candidates_before) .. (change_point + candidates_after):
    ll_result = analysis_at_point_t(X, Y, t)
    result.likelihood.change_points.add t
    result.likelihood.loglikelihood.add ll_result.loglikelihood
    if ll_result.loglikelihood > result.likelihood.best_loglikelihood:
      result.likelihood.best_loglikelihood = ll_result.loglikelihood
      result.likelihood.best_likelihood = exp(ll_result.loglikelihood)
      result.likelihood.best_time = t
      result.before_change = ll_result.before_change
      result.after_change = ll_result.after_change


proc robust_interrupted_time_series(X: openArray[float], Y: openArray[float], change_point: int, candidates_before: int, candidates_after: int): RobustInterruptedModel  {.exportc.} =
  robust_interrupted_time_series(vector(X), vector(Y), change_point, candidates_before, candidates_after)
  

when isMainModule:
  import random
  import times

  proc test_linear_regression() =
    let
      x0 = vector([1.47, 1.50, 1.52, 1.55, 1.57, 1.60, 1.63, 1.65, 1.68, 1.70, 1.73, 1.75, 1.78, 1.80, 1.83])
      y0 = vector([52.21, 53.12, 54.48, 55.84, 57.20, 58.57, 59.93, 61.29, 63.11, 64.47, 66.28, 68.10, 69.92, 72.19, 74.46])
      slr0 = simple_linear_regression(x0, y0)
    echo fmt"X: {x0}"
    echo fmt"Y: {y0}"
    echo $slr0
    assert(abs(slr0.slope - 61.272) < 0.01)
    assert(abs(slr0.slope_variance - 1.776 ^ 2) < 0.01)
    assert(abs(slr0.slope_width_confidence_interval - 7.67328) < 0.01)
    assert(abs(slr0.intercept - -39.062) < 0.01)
    assert(abs(slr0.intercept_variance - 2.938 ^ 2) < 0.01)
    assert(abs(slr0.intercept_width_confidence_interval - 12.6943) < 0.01)
    assert(abs(slr0.R2 - 0.9892) < 0.01)

  proc test_linear_regression_wo_intercept() =
    let
      x0 = vector([1.47, 1.50, 1.52, 1.55, 1.57, 1.60, 1.63, 1.65, 1.68, 1.70, 1.73, 1.75, 1.78, 1.80, 1.83])
      y0 = vector([52.21, 53.12, 54.48, 55.84, 57.20, 58.57, 59.93, 61.29, 63.11, 64.47, 66.28, 68.10, 69.92, 72.19, 74.46])
      slr0 = simple_linear_regression_wo_intercept(x0, y0)
    echo fmt"X: {x0}"
    echo fmt"Y: {y0}"
    echo $slr0
    assert(abs(slr0.slope - 37.7131) < 0.01)
    assert(abs(slr0.slope_variance - 0.4362 ^ 2) < 0.01)
    echo abs(slr0.slope_width_confidence_interval - 1.871)
    assert(abs(slr0.slope_width_confidence_interval - 1.871) < 0.01)
    assert(abs(slr0.intercept - 0) < 0.01)
    assert(abs(slr0.intercept_variance - 0) < 0.01)
    assert(abs(slr0.intercept_width_confidence_interval - 0) < 0.01)
    assert(abs(slr0.R2 - 0.9981) < 0.01)

  proc test_model[T: static[int]](change_point: int, candidates: int, verbose: bool=true) =
    var
      x: array[T, float]
      y: array[T, float]
      x0: Vector
      y0: Vector
    for t in 0..(T-1):
      x[t] = t.float
      y[t] = t.float * 10.0 + rand(1000).float / 1000.0    
    x0 = vector(x)
    y0 = vector(y)
    if verbose:
      echo fmt"X: {x0[0..10]}"
      echo fmt"Y: {y0[0..10]}"
    var
      candidates_after = candidates
      candidates_before = candidates
      model = robust_interrupted_time_series(x0, y0, change_point, candidates_before, candidates_after)
    if verbose:
      echo model

  proc test_model_100(verbose: bool=false) =
    test_model[100](50, 5, verbose)

  proc test_model_500(verbose: bool=false) =
    test_model[500](250, 5, verbose)

  proc test_model_200(verbose: bool=false) =
    test_model[200](100, 99, verbose)

  proc test_model_500_100(verbose: bool=false) =
    test_model[500](250, 100, verbose)

  proc test_model_5000(verbose: bool=false) =
    test_model[5000](250, 5, verbose)

  proc test_model_50000_5(verbose: bool=false) =
    test_model[50000](1000, 5, verbose)

  proc test_model_50000_50(verbose: bool=false) =
    test_model[50000](1000, 50, verbose)

  proc test_model_50000_500(verbose: bool=false) =
    test_model[50000](1000, 500, verbose)


  test_linear_regression()
  test_linear_regression_wo_intercept()
  test_model_100(verbose=true)

  echo "# 100 points (x10)"
  var time = getTime()
  for k in 1..10:
    test_model_100()
  echo "## Time taken: ", getTime() - time
  
  echo "# 200 points (200 cands.) (x10)"
  time = getTime()
  for k in 1..10:
    test_model_200()
  echo "## Time taken: ", getTime() - time
  
  echo "# 500 points (x10)"
  time = getTime()
  for k in 1..10:
    test_model_500()
  echo "## Time taken: ", getTime() - time
  
  echo "# 500 points (100 cands.) (x10)"
  time = getTime()
  for k in 1..10:
    test_model_500_100()
  echo "## Time taken: ", getTime() - time
  
  echo "# 5000 points (x10)"
  time = getTime()
  for k in 1..10:
    test_model_5000()
  echo "## Time taken: ", getTime() - time
  
  echo "# 50000 (5 cands.) points (x10)"
  time = getTime()
  for k in 1..10:
    test_model_50000_5()
  echo "## Time taken: ", getTime() - time
  
  echo "# 50000 (50 cands.) points (x10)"
  time = getTime()
  for k in 1..10:
    test_model_50000_50()
  echo "## Time taken: ", getTime() - time
  
  echo "# 50000 (500 cands.) points (x10)"
  time = getTime()
  for k in 1..10:
    test_model_50000_500()
  echo "## Time taken: ", getTime() - time

  ##### JS
  # 100 points (x10)
  ## Time taken: 792 milliseconds
  # 200 points (200 cands.) (x10)
  ## Time taken: 8 seconds and 272 milliseconds
  # 500 points (x10)
  ## Time taken: 537 milliseconds
  # 500 points (100 cands.) (x10)
  ## Time taken: 7 seconds and 78 milliseconds
  # 5000 points (x10)
  ## Time taken: 366 milliseconds
  # 50000 (5 cands.) points (x10)
  ## Time taken: 386 milliseconds
  # 50000 (50 cands.) points (x10)
  ## Time taken: 3 seconds and 940 milliseconds
  # 50000 (500 cands.) points (x10)
  ## Time taken: 35 seconds and 328 milliseconds

  ##### C
  # 100 points (x10)
  ## Time taken: 234 milliseconds, 372 microseconds, and 900 nanoseconds
  # 200 points (200 cands.) (x10)
  ## Time taken: 4 seconds, 613 milliseconds, 653 microseconds, and 900 nanoseconds
  # 500 points (x10)
  ## Time taken: 243 milliseconds, 349 microseconds, and 100 nanoseconds
  # 500 points (100 cands.) (x10)
  ## Time taken: 4 seconds, 460 milliseconds, 95 microseconds, and 500 nanoseconds
  # 5000 points (x10)
  ## Time taken: 258 milliseconds, 361 microseconds, and 900 nanoseconds
  # 50000 (5 cands.) points (x10)
  ## Time taken: 411 milliseconds, 895 microseconds, and 600 nanoseconds
  # 50000 (50 cands.) points (x10)
  ## Time taken: 3 seconds, 821 milliseconds, 772 microseconds, and 500 nanoseconds
  # 50000 (500 cands.) points (x10)
  ## Time taken: 37 seconds, 3 milliseconds, and 978 microseconds

