import math
import stats
import strformat
import snail


###########################################################
# INTERFACES
type Array[N: static[int]] = array[N, float64]
type BiArray[N,M: static[int]] = array[N, array[M, float]]

proc createRowVector[N:static[int]](arr: Array[N]): RowVector[N] =
  ## Create a new row vector, takes an array of floats
  new result.data
  result.data[] = arr
  when not defined js: result.p = addr result.data[0]
discard createRowVector([1.0, 0.0]) # Force to create the function

proc createColVector[N:static[int]](arr: Array[N]): ColVector[N] =
  ## Create a new row vector, takes an array of floats
  new result.data
  result.data[] = arr
  when not defined js: result.p = addr result.data[0]
discard createColVector([1.0, 0.0]) # Force to create the function

proc createMatrix[N,M: static[int]](arr: BiArray[N,M]): Matrix[N,M] = 
  ## Create a matrix from a 2-D array of floats.
  #when N>maxstack:
  new result.data
  when not defined(js): result.p = addr result.data[0]
  for i,r in arr.pairs:
    for j,c in r.pairs: result[i,j] = c
discard createMatrix([[1.0], [0.0]]) # Force to create the function

###########################################################
# HELPERS
proc `.^`[N] (v: Vector[N], s: float): Vector[N]  {.inline.}=
  ## Subtract two vectors.
  new result.data
  when not defined js: result.p = addr result.data[0]
  for i in v.low..v.high:
    result[i] = pow(v[i], s)

proc `-`[N] (v: float, w: Vector[N]): Vector[N]  {.inline.}=
  ## Subtract two vectors.
  new result.data
  when not defined js: result.p = addr result.data[0]
  for i in w.low..w.high:
    result[i] = v - w[i]
proc `-`[N] (w: Vector[N], v: float): Vector[N]  {.inline.}= v - w
proc `+`[N] (v: float, w: Vector[N]): Vector[N]  {.inline.}=
  ## Subtract two vectors.
  new result.data
  when not defined js: result.p = addr result.data[0]
  for i in w.low..w.high:
    result[i] = v + w[i]
proc `+`[N] (w: Vector[N], v: float): Vector[N] = v + w

proc sum[N](v: Vector[N]): float  {.inline.}= v.data[].sum
proc avg[N](v: Vector[N]): float  {.inline.}= v.sum / v.len.float
proc mean[N](v: Vector[N]): float  {.inline.}= v.sum / v.len.float
proc variance[N](v: Vector[N]): float  {.inline.}= (v .* v).sum / v.len.float - v.mean ^ 2
proc covariance[N](v: Vector[N], w: Vector[N]): float  {.inline.}=
  dot(v, w) / v.len.float - v.mean * w.mean

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
  n: int

proc `$`(params: LinearRegressionParameters): string =
  fmt"slope: {params.slope} (o2: {params.slope_variance}, CI width: {params.slope_width_confidence_interval}); intercept: {params.intercept} (o2: {params.intercept_variance}, CI width: {params.intercept_width_confidence_interval}); R2: {params.R2}; SSE: {params.residual_sum_squares}"

proc simple_linear_regression[N](X: Vector[N], Y: Vector[N]): LinearRegressionParameters =
  let
    n = X.len.float
  result.n = n.int
  result.slope = covariance(X, Y) / variance(X)
  result.intercept = Y.mean - result.slope * X.mean
  #
  result.R2 = ((X .* Y).mean - X.mean * Y.mean) ^ 2 / (((X .* X).mean - X.mean ^ 2) * ((Y .* Y).mean - Y.mean ^ 2))
  #
  result.residual_sum_squares = ((Y - (result.intercept + result.slope * X)) .^ 2.0).sum
  #
  result.slope_variance = result.residual_sum_squares / X.variance * n / (n - 2.0)
  result.intercept_variance = result.slope_variance * (X .* X).mean
  #
  result.slope_width_confidence_interval = 2.0 * sqrt(result.slope_variance) * student_t_ppf_95p(n - 2)
  result.slope_confidence_interval[0] = result.slope - 0.5 * result.slope_width_confidence_interval
  result.slope_confidence_interval[1] = result.slope + 0.5 * result.slope_width_confidence_interval
  result.intercept_width_confidence_interval = 2.0 * sqrt(result.intercept_variance) * student_t_ppf_95p(n - 2)
  result.intercept_confidence_interval[0] = result.intercept - 0.5 * result.intercept_width_confidence_interval
  result.intercept_confidence_interval[1] = result.intercept + 0.5 * result.intercept_width_confidence_interval

proc double_simple_linear_regression[N](X: Vector[N], Y: Vector[N], change_point: int) =
  let
    N = X.len
    #model_before_change = simple_linear_regression(X[0..(change_point-1)], Y[0..(change_point-1)])
    #model_after_change = simple_linear_regression(X[change_point..N], Y[change_point..N])
  #echo model_before_change
  #echo model_after_change

when isMainModule:
  let
    x1= colVec([1.0, 2.0, 3.0, 4.0, 10.0])
    y1 = colVec([110.0, 210.0, 310.10, 410.0, 1011.0])
    slr = simple_linear_regression(x1, y1)
  echo fmt"X: {x1}"
  echo fmt"Y: {y1}"
  echo $slr
  double_simple_linear_regression(x1, y1, 0)
  double_simple_linear_regression(x1, y1, 4)

when false:
  import times
  import random
  # Simple benchmarking
  let time = getTime()
  const M = 100000
  var test_x: array[M, float]
  var test_y: array[M, float]
  for t in 0..(M-1):
    test_x[t] = t.float
    test_y[t] = t.float * 10.0 + rand(1000).float / 1000.0
  for i in 0..1000:
    discard simple_linear_regression(colVec(test_x), colVec(test_y))
  echo "Time taken: ", getTime() - time
  # C UNoptimized:
  #    Time taken: 45 seconds, 134 milliseconds, 605 microseconds, and 300 nanoseconds
  # C optimized:
  #    Time taken: 4 seconds, 13 milliseconds, 259 microseconds, and 700 nanoseconds
  # JS UNoptimized:
  #    Time taken: 3 minutes, 3 seconds, and 244 milliseconds
  # JS optimized:
  #    Time taken: 11 seconds and 97 milliseconds
