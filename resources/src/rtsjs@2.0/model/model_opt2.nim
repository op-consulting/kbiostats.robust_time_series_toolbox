import math
import stats
import strformat


###########################################################
# OPERATIONS
type Vector = seq[float]

# TO STRING
proc `$`(v: Vector): string {.inline.} =
  result = "["
  for k in v.low..v.high:
    result &= fmt"{v[k]:.04f}"
    if k != v.high:
      result &= ", "
  result &= "]"



# ACCESSORS
proc `[]`*(v: Vector, i: int): float {.inline.} =
  assert(i >= 0, "Negative index")
  assert(i < v.len, "Index out of bounds")
  v[i]

# ACCESSORS
proc `[]`*(v: Vector, idx: HSlice[int, int]): Vector {.inline.} =
  var k = 0
  for i in idx:
    assert(i >= 0, "Negative index")
    assert(i < v.len, "Index out of bounds")
    result[k] = v[i]
    inc(k)

proc `[]=`*(v: var Vector, idx: HSlice[int, int], val:float) {.inline.} =
  for i in idx:
    assert(i >= 0, "Negative index")
    assert(i < v.len, "Index out of bounds")
    v[i] = val

proc `[]=`*(v: var Vector, idx: HSlice[int, int], w: var Vector) {.inline.} =
  assert(idx.b - idx.a + 1 == w.len, "Assign vector in a wrong size")
  var k = 0
  for i in idx:
    assert(i >= 0, "Negative index")
    assert(i < v.len, "Index out of bounds")
    v[i] = w[k]
    inc(k)

# ELEMENT-WISE SUM VECTOR
proc `+`*(v: Vector, w: Vector): Vector {.inline.}=
  newSeq(result, v.len)
  for i in v.low..v.high:
    result[i] = v[i] + w[i]

proc `+`*(v: Vector, k: float): Vector {.inline.} =
  newSeq(result, v.len)
  for i in v.low..v.high:
    result[i] = v[i] + k

proc `+`*(k: float, v: Vector): Vector {.inline.} = v + k

proc `+`*(v: Vector, k: int): Vector {.inline.} = v + k.float

proc `+`*(k: int, v: Vector): Vector {.inline.} = v + k.float

# ELEMENT-WISE DIFFERENCE VECTOR
proc `-`*(v: Vector, w: Vector): Vector {.inline.}=
  newSeq(result, v.len)
  for i in v.low..v.high:
    result[i] = v[i] - w[i]

proc `-`*(v: Vector, k: float): Vector {.inline.} =
  newSeq(result, v.len)
  for i in v.low..v.high:
    result[i] = v[i] - k

proc `-`*(k: float, v: Vector): Vector {.inline.} =
  newSeq(result, v.len)
  for i in v.low..v.high:
    result[i] = k - v[i]

proc `-`*(v: Vector, k: int): Vector {.inline.} = v - k.float

proc `-`*(k: int, v: Vector): Vector {.inline.} = k.float - v

# ELEMENT-WISE PRODUCT VECTOR
proc `.*`*(v: Vector, w: Vector): Vector {.inline.}=
  newSeq(result, v.len)
  for i in v.low..v.high:
    result[i] = v[i] * w[i]

proc `.*`*(v: Vector, k: float): Vector {.inline.} =
  newSeq(result, v.len)
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
  newSeq(result, v.len)
  for i in v.low..v.high:
    result[i] = v[i] / w[i]

proc `./`*(v: Vector, k: float): Vector {.inline.} =
  newSeq(result, v.len)
  for i in v.low..v.high:
    result[i] = v[i] / k

proc `./`*(k: float, v: Vector): Vector {.inline.} =
  newSeq(result, v.len)
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
  newSeq(result, v.len)
  for i in v.low..v.high:
    result[i] = v[i] ^ w[i]

proc `.^`*(v: Vector, k: float): Vector {.inline.} =
  newSeq(result, v.len)
  for i in v.low..v.high:
    result[i] = v[i] ^ k

proc `.^`*(k: float, v: Vector): Vector {.inline.} =
  newSeq(result, v.len)
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
#proc sum*(v: Vector): float  {.inline.} = v.sum
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
  n: int

proc `$`(params: LinearRegressionParameters): string =
  fmt"slope: {params.slope} (o2: {params.slope_variance}, CI width: {params.slope_width_confidence_interval}); intercept: {params.intercept} (o2: {params.intercept_variance}, CI width: {params.intercept_width_confidence_interval}); R2: {params.R2}; SSE: {params.residual_sum_squares}"

proc simple_linear_regression(X: Vector, Y: Vector): LinearRegressionParameters =
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

proc double_simple_linear_regression(X: Vector, Y: Vector, change_point: int) =
  let
    N = X.len
    #model_before_change = simple_linear_regression(X[0..(change_point-1)], Y[0..(change_point-1)])
    #model_after_change = simple_linear_regression(X[change_point..N], Y[change_point..N])
  #echo model_before_change
  #echo model_after_change

when isMainModule and false:
  let
    x1= @[1.0, 2.0, 3.0, 4.0, 10.0]
    y1 = @[110.0, 210.0, 310.10, 410.0, 1011.0]
    slr = simple_linear_regression(x1, y1)
  echo fmt"X: {x1}"
  echo fmt"Y: {y1}"
  echo $slr
  double_simple_linear_regression(x1, y1, 0)
  double_simple_linear_regression(x1, y1, 4)

when not false:
  import times
  import random
  # Simple benchmarking
  let time = getTime()
  const M1 = 100000
  var test_x: array[M1, float]
  var test_y: array[M1, float]
  for t in 0..(M1-1):
    test_x[t] = t.float
    test_y[t] = t.float * 10.0 + rand(1000).float / 1000.0
  for i in 0..1000:
    discard simple_linear_regression(@test_x, @test_y)
  echo "Time taken: ", getTime() - time
  # C UNoptimized:
  #    Time taken: 45 seconds, 134 milliseconds, 605 microseconds, and 300 nanoseconds
  # C optimized:
  #    Time taken: 4 seconds, 13 milliseconds, 259 microseconds, and 700 nanoseconds
  # JS UNoptimized:
  #    Time taken: 3 minutes, 3 seconds, and 244 milliseconds
  # JS optimized:
  #    Time taken: 22 seconds and 740 milliseconds
