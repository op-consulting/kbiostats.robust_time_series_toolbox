import math
import random
import stats
import sequtils
import strformat
import algorithm
import sugar
import core
import special

when isMainModule:
  echo "[Initializing]"
  let X1 = @[
    @[1.0, 2.0, 3.0],
    @[4.0, 5.0, 6.0],
    @[7.0, 8.0, 9.0],
    @[10.0, 11.0, 12.0],
  ]

###########################################################
# Random functions
###########################################################

proc randu*(a: float, b: float): float = rand(10000000.0) / 10000000.0 * (b - a) + a

proc randn*(): float =
  var
    u = randu(0.0, 1.0)
    v = 1.7156 * (randu(0.0, 1.0) - 0.5)
    x = u - 0.449871
    y = abs(v) + 0.386595
    q = x * x + y * (0.19600 * y - 0.25472 * x)
  while (q > 0.27597 and (q > 0.27846 or v * v > -4 * ln(u) * u * u)):
    u = randu(0.0, 1.0)
    v = 1.7156 * (randu(0.0, 1.0) - 0.5)
    x = u - 0.449871
    y = abs(v) + 0.386595
    q = x * x + y * (0.19600 * y - 0.25472 * x)
  return v / u

#Cheng 97
#https://github.com/robsr/gammaRVs-generator-algorithms/blob/master/gamma_generation_algos.ipynb
proc randg*(a: float, b: float=1.0): float =
  let
    alpha = 1.0 / sqrt(2.0 * a - 1.0)
    b = a - ln(4.0)
    c = a + 1/alpha
  var
    u1 = randu(0.0, 1.0)
    u2 = randu(0.0, 1.0)
    v = alpha * ln(u1/(1.0-u1))
    x = a * exp(v)
  while b + c * v - x < ln(u1 * u1 * u2):
    u1 = randu(0.0, 1.0)
    u2 = randu(0.0, 1.0)
    v = alpha * ln(u1/(1.0-u1))
    x = a * exp(v)
  return x

###########################################################
# BETA DISTRIBUTION
###########################################################
type Beta* = ref object
  alpha*: float
  beta*: float

proc beta*(alpha: float, beta: float): Beta =
  result.alpha = alpha
  result.beta = beta

proc `$`*(d: Beta): string = fmt"Beta(alpha={d.alpha:8g}, beta={d.beta:8g}"

proc pdf*(d: Beta, x: float): float =
  # PDF is zero outside the support
  if x > 1.0 or x < 0:
    return 0
  # PDF is one for the uniform case
  if d.alpha == 1.0 and d.beta == 1.0:
    return 1
  if d.alpha < 512.0 and d.beta < 512:
    return x ^ (d.alpha - 1.0) * (1.0 - x) ^ (d.beta - 1.0) / betafn(d.alpha, d.beta)
  else:
    return exp((d.alpha - 1.0) * ln(x) + (d.beta - 1.0) * ln(1 - x) - betaln(d.alpha, d.beta))

proc cdf*(d: Beta, x: float): float =
  if x > 1.0:
    result = 1.0
  elif x < 0.0:
    result = 0.0
  else:
    result = ibeta(x, d.alpha, d.beta)

proc inv*(d: Beta, x: float): float =
  return ibetainv(x, d.alpha, d.beta)
  
proc mean*(d: Beta): float =
  return d.alpha / (d.alpha + d.beta)

proc median*(d: Beta): float =
  return ibetainv(0.5, d.alpha, d.beta)

proc mode*(d: Beta): float =
  return (d.alpha - 1.0) / (d.alpha + d.beta - 2.0)

# return a random sample
proc sample*(d: Beta): float =
  let u = randg(d.alpha)
  return u / (u + randg(d.beta))

proc variance*(d: Beta): float =
  return (d.alpha * d.beta) / ((d.alpha + d.beta) ^ 2 * (d.alpha + d.beta + 1.0))

proc loglikelihood*(d: Beta, y: vector): float =
  for yi in y:
    result += d.pdf(yi).ln

###########################################################
# BINOMIAL DISTRIBUTION
###########################################################
type Binomial* = ref object
  n*: int
  p*: float

proc binomial*(n: int, p: float): Binomial =
  new result
  result.n = n
  result.p = p

proc `$`*(d: Binomial): string = fmt"Binomial(n={d.n}, beta={d.p:8g})"

proc pdf*(d: Binomial, k: int): float =
  return if d.p == 0.0 or d.p == 1.0: (if d.n.toFloat * d.p == k.toFloat: 1.0 else: 0.0) else: combination(d.n, k) * (d.p ^ k) * (1.0 - d.p) ^ (d.n - k).toFloat

proc cdf*(d: Binomial, x: int): float =
  var binomarr = zeros(x)
  if x < 0:
    return 0.0
  if x < d.n:
    for k in 0 .. x:
      binomarr[k] = pdf(binomial(d.n, d.p), k)
    return sum(binomarr)
  return 1.0

proc inv*(d: Binomial, x: float): float =
  return NaN
  
proc mean*(d: Binomial): float =
  return NaN

proc median*(d: Binomial): float =
  return NaN

proc mode*(d: Binomial): float =
  return NaN

# return a random sample
proc sample*(d: Binomial): float =
  return NaN

proc variance*(d: Binomial): float =
  return NaN

proc loglikelihood*(d: Binomial, y: vector): float =
  for yi in y:
    result += d.pdf(yi.toInt).ln
  
###########################################################
# STUDENT T DISTRIBUTION
###########################################################
type StudentT* = ref object
  dof*: int

proc studentt*(dof: int): StudentT =
  new result
  result.dof = dof

proc studentt*(dof: float): StudentT =
  new result
  result.dof = dof.toInt

proc `$`*(d: StudentT): string = fmt"Student(dof={d.dof})"

proc pdf*(d: StudentT, x: float): float =
  let dof = (if d.dof > 1e100.toInt: 1e100.toInt else: d.dof).toFloat
  return (1.0 / (sqrt(dof) * betafn(0.5, dof / 2.0))) * (1.0 + (x * x) / dof) ^ ( - 0.5 * (dof + 1.0))

proc cdf*(d: StudentT, x: float): float =
  let dof2 = d.dof.toFloat * 0.5
  return ibeta((x + sqrt(x * x + d.dof.toFloat)) / (2.0 * sqrt(x * x + d.dof.toFloat)), dof2, dof2)
  #return ibeta((x + sqrt(x * x + d.dof.toFloat)) / (2.0 * sqrt(x * x + d.dof.toFloat)), 0.5 * d.dof.toFloat, 0.5 * d.dof.toFloat)

proc inv*(d: StudentT, p: float): float =
  var x = ibetainv(2.0 * min(p, 1.0 - p), 0.5 * d.dof.toFloat, 0.5)
  x = sqrt(d.dof.toFloat * (1.0 - x) / x)
  return if p > 0.5: x else: -x

proc mean*(d: StudentT): float =
  return if d.dof > 1: 0.0 else: NaN

proc median*(d: StudentT): float =
  return 0

proc mode*(d: StudentT): float =
  return 0

proc sample*(d: StudentT): float =
  return randn() * sqrt(d.dof.toFloat / (2.0 * randg(0.5 * d.dof.toFloat)))

proc variance*(d: StudentT): float =
  return if d.dof > 2: d.dof.toFloat / (d.dof.toFloat - 2.0) else: (if d.dof > 1: Inf else: NaN)

proc loglikelihood*(d: StudentT, y: vector): float =
  for yi in y:
    result += d.pdf(yi).ln
  
###########################################################
# NORMAL DISTRIBUTION
###########################################################
type Normal* = ref object
   mean*: float
   std*: float

proc normal*(mean: float = 0.0, std: float = 1.0): Normal =
  new result
  result.mean = mean
  result.std = std

proc `$`*(d: Normal): string = fmt"Binomial(mean={d.mean}, var={d.std^2:8g})"

proc pdf*(d: Normal, x: float): float =
  return exp(-0.5 * ln(2.0 * PI) - ln(d.std) - pow(x - d.mean, 2.0) / (2.0 * d.std * d.std))

proc cdf*(d: Normal, x: float): float =
  return 0.5 * (1.0 + special.erf((x - d.mean) / sqrt(2.0 * d.std * d.std)))

proc inv*(d: Normal, p: float): float =
  return -1.41421356237309505 * d.std * erfcinv(2.0 * p) + d.mean

proc mean*(d: Normal): float =
  return d.mean

proc median*(d: Normal): float =
  return d.mean

proc mode*(d: Normal): float =
  return d.mean

proc sample*(d: Normal): float =
  return randn() * d.std + d.mean

proc variance*(d: Normal): float =
  return d.std ^ 2

proc loglikelihood*(d: Normal, y: vector): float =
  for yi in y:
    #result += d.pdf(yi).ln
    result += (-0.5 * ln(2.0 * PI) - ln(d.std) - pow(yi - d.mean, 2.0) / (2.0 * d.std * d.std))

###########################################################
# CHI-SQUARE DISTRIBUTION
###########################################################
type ChiSquare* = ref object
   dof*: float

proc chisquare*(dof: int): ChiSquare =
  new result
  result.dof = dof.toFloat

proc chisquare*(dof: float): ChiSquare =
  new result
  result.dof = dof

proc `$`*(d: ChiSquare): string = fmt"ChiSquare(dof={d.dof.toInt})"

proc pdf*(d: ChiSquare, x: float): float =
  if x <= 0.0: return 0.0
  return if x == 0.0 and d.dof == 2.0: 0.5 else: exp((d.dof / 2.0 - 1.0) * ln(x) - x / 2.0 - (d.dof / 2.0) * ln(2.0) - gammaln(d.dof / 2.0))

proc cdf*(d: ChiSquare, x: float): float =
  if x <= 0: return 0
  return lowRegGamma(d.dof / 2.0, x / 2.0)

proc inv*(d: ChiSquare, p: float): float =
  return 2.0 * gammapinv(p, 0.5 * d.dof)

proc mean*(d: ChiSquare): float =
  return d.dof

proc median*(d: ChiSquare): float =
  return d.dof * pow(1.0 - (2.0 / (9.0 * d.dof)), 3.0)

proc mode*(d: ChiSquare): float =
  return if d.dof - 2.0 > 0.0: d.dof - 2.0 else: 0.0

proc sample*(d: ChiSquare): float =
  return randg(d.dof / 2.0) * 2.0

proc variance*(d: ChiSquare): float =
  return 2.0 * d.dof

proc loglikelihood*(d: ChiSquare, y: vector): float =
  for yi in y:
    result += d.pdf(yi).ln

###########################################################
# INVERSE GAMMA DISTRIBUTION
###########################################################
type InvGamma* = ref object
   shape*: float
   scale*: float

proc invgamma*(shape: float, scale: float): InvGamma =
  new result
  result.shape = shape
  result.scale = scale

proc `$`*(d: InvGamma): string = fmt"InvGamma(shape={d.shape:8g}, scale={d.scale:8g})"

proc pdf*(d: InvGamma, x: float): float =
  if x < 0.0: return 0.0
  return exp(-(d.shape + 1.0) * ln(x) - d.scale / x - gammaln(d.shape) + d.shape * ln(d.scale))

proc cdf*(d: InvGamma, x: float): float =
  if x < 0: return 0
  return 1 - lowRegGamma(d.shape, d.scale / x)

proc inv*(d: InvGamma, p: float): float =
  return d.scale / gammapinv(1 - p, d.shape)

proc mean*(d: InvGamma): float =
  #return if d.shape > 1.0: d.scale / (d.shape - 1.0) else: (d.scale + 1e-10) / (d.shape - 1.0 + 1e-10)
  return if d.shape > 1.0: d.scale / (d.shape - 1.0) else: NaN

#No close form solution
proc median*(d: InvGamma): float =
  return d.inv(0.5)

proc mode*(d: InvGamma): float =
  return d.scale / (d.shape + 1.0)

proc sample*(d: InvGamma): float =
  return d.scale / randg(d.shape)

proc variance*(d: InvGamma): float =
  return if d.shape > 2.0: d.scale ^ 2 / ((d.shape - 1) ^ 2 * (d.shape - 2.0)) else: NaN

proc loglikelihood*(d: InvGamma, y: vector): float =
  for yi in y:
    result += d.pdf(yi).ln

###########################################################
# INVERSE CHI-SQUARE DISTRIBUTION
###########################################################
type InvChiSquare* = ref object
   dof*: float
   scale*: float #positive

proc invchisquare*(dof: int, scale: float=NaN): InvChiSquare =
  new result
  result.dof = dof.toFloat
  result.scale = if scale.classify == fcNan: 1.0 / dof.toFloat else: scale

proc invchisquare*(dof: float, scale: float=NaN): InvChiSquare =
  new result
  result.dof = dof
  result.scale = if scale.classify == fcNan: 1.0 / dof else: scale

proc `$`*(d: InvChiSquare): string = fmt"InvChiSquare(dof={d.dof.toInt}, scale={d.scale:8g})"

proc as_inv_gamma(d: InvChiSquare): InvGamma = InvGamma(shape: d.dof/2.0, scale: d.dof * d.scale / 2.0)

proc pdf*(d: InvChiSquare, x: float): float = d.as_inv_gamma.pdf(x)

proc cdf*(d: InvChiSquare, x: float): float = d.as_inv_gamma.cdf(x)

proc inv*(d: InvChiSquare, p: float): float = d.as_inv_gamma.inv(p)

proc mean*(d: InvChiSquare): float = d.as_inv_gamma.mean()
#  return if d.dof > 2.0: d.scale * d.dof / (d.dof - 2.0) else: NaN

proc median*(d: InvChiSquare): float = d.as_inv_gamma.median()

proc mode*(d: InvChiSquare): float = d.as_inv_gamma.mode()

proc sample*(d: InvChiSquare): float = d.as_inv_gamma.sample()

proc variance*(d: InvChiSquare): float = d.as_inv_gamma.variance()

proc loglikelihood*(d: InvChiSquare, y: vector): float =
  for yi in y:
    result += d.pdf(yi).ln

###########################################################
# CENTRAL F DISTRIBUTION
###########################################################
# This implementation of the pdf function avoids float overflow
# See the way that R calculates this value:
# https://svn.r-project.org/R/trunk/src/nmath/df.c
type CentralF* = ref object
   df1*: float
   df2*: float

proc central_f*(df1: float=1.0, df2: float=1.0): CentralF =
  new result
  result.df1 = df1
  result.df2 = df2

proc `$`*(d: CentralF): string = fmt"CentralF(dof1={d.df1.toInt}, dof2={d.df2.toInt}"

proc pdf*(d: CentralF, x: float): float =
  if x < 0.0: return 0.0
  if d.df1 <= 2.0:
    if x == 0.0 and d.df1 < 2.0: return Inf
    if x == 0.0 and d.df1 == 2.0: return 1.0
    return (1.0 / betafn(d.df1 / 2.0, d.df2 / 2.0)) * pow(d.df1 / d.df2, d.df1 / 2.0) * pow(x, (d.df1 / 2.0) - 1.0) * pow((1.0 + (d.df1 / d.df2) * x), - (d.df1 + d.df2) / 2.0)
  let p = ((d.df1 * x) / (d.df2 + x * d.df1)).toInt
  let q = d.df2 / (d.df2 + x * d.df1)
  let f = d.df1 * q / 2.0
  return f * binomial(((d.df1 - 2.0) / 2.0).toInt, ((d.df1 + d.df2 - 2.0) / 2.0)).pdf(p)

proc cdf*(d: CentralF, x: float): float = 
  if x < 0.0: return 0.0
  return ibeta((d.df1 * x) / (d.df1 * x + d.df2), d.df1 / 2.0, d.df2 / 2.0)

proc inv*(d: CentralF, p: float): float = 
  return d.df2 / (d.df1 * (1.0 / ibetainv(p, d.df1 / 2.0, d.df2 / 2.0) - 1.0))

proc mean*(d: CentralF): float = 
  return if d.df2 > 2.0: d.df2 / (d.df2 - 2.0) else: NaN

proc median*(d: CentralF): float = d.inv(0.5)

proc mode*(d: CentralF): float =
  return if d.df2 > 2.0: (d.df2 * (d.df1 - 2.0)) / (d.df1 * (d.df2 + 2.0)) else: NaN

proc sample*(d: CentralF): float =
  let x1 = randg(d.df1 / 2.0) * 2.0
  let x2 = randg(d.df2 / 2.0) * 2.0
  return (x1 / d.df1) / (x2 / d.df2)

proc variance*(d: CentralF): float =
  if d.df2 <= 4.0: return NaN
  return 2.0 * d.df2 * d.df2 * (d.df1 + d.df2 - 2.0) / (d.df1 * (d.df2 - 2.0) * (d.df2 - 2.0) * (d.df2 - 4.0))

proc loglikelihood*(d: CentralF, y: vector): float =
  for yi in y:
    result += d.pdf(yi).ln


###########################################################
# STUDENT T DISTRIBUTION
###########################################################

###########################################################
# MULTIVARIATE NORMAL DISTRIBUTION
###########################################################
type MultivariateNormal* = ref object
   mean*: vector
   cov*: matrix
   cov_inv: matrix
   cov_det: float
   std_ch: matrix

proc normal*(mean: vector, cov: matrix): MultivariateNormal =
  new result
  assert cov.is_square, "covariance matrices should be squared"
  result.mean = mean
  result.cov = cov
  result.cov_inv = cov.inv
  result.cov_det = cov.det
  result.std_ch = cov.cholesky

proc `$`*(d: MultivariateNormal): string = fmt"MultivariateNormal(mean={d.mean}, var={d.cov})"

proc pdf*(d: MultivariateNormal, x: vector): float =
  let k = d.cov.rows.toFloat
  return 1/((2 * PI) ^ (k / 2) * d.cov_det.sqrt) * exp(-0.5 * ((x - d.mean).as_column_vector.T * d.cov_inv * (x - d.mean).as_column_vector)[0][0])

#proc cdf*(d: MultivariateNormal, x: float): float =
#  # To implement: https://arxiv.org/abs/1603.04166
#  return NaN

#proc inv*(d: MultivariateNormal, p: float): float =
#  return NaN

proc mean*(d: MultivariateNormal): vector =
  return d.mean

proc median*(d: MultivariateNormal): vector =
  return d.mean

proc mode*(d: MultivariateNormal): vector =
  return d.mean

proc sample*(d: MultivariateNormal): vector =
  let k = d.cov.rows
  var v: vector = @[]
  for i in 1..k:
    v.add randn()
  return (d.std_ch * eye(v)).ravel + d.mean

proc variance*(d: MultivariateNormal): matrix =
  return d.cov

proc loglikelihood*(d: MultivariateNormal, y: seq[vector]): float =
  let k = d.cov.rows.toFloat
  for yi in y:
    result += -0.5 * k * ln(2 * PI) - 0.5 * ln(d.cov_det)
    result += -0.5 * ((yi - d.mean).as_column_vector.T * d.cov_inv * (yi - d.mean).as_column_vector)[0][0]



###########################################################
# SCALED SHIFTED DISTRIBUTION
###########################################################
type BaseStatsDistribution* = Beta|Binomial|StudentT|Normal|ChiSquare|InvGamma|InvChiSquare
type ScaledShiftedDistribution*[D] = ref object
  distribution*: D
  location*: float
  scale*: float

proc scaled_shifted*[D](distribution: D, location: float=0.0, scale: float=1.0): ScaledShiftedDistribution[D] =
  new result
  result.distribution = distribution
  result.location = location
  result.scale = scale

proc pdf*[D](d: ScaledShiftedDistribution[D], x: float): float = d.distribution.pdf((x - d.location) / d.scale)

proc cdf*[D](d: ScaledShiftedDistribution[D], x: float): float = d.distribution.cdf((x - d.location) / d.scale)

proc inv*[D](d: ScaledShiftedDistribution[D], p: float): float = d.distribution.inv(p) * d.scale + d.location

proc mean*[D](d: ScaledShiftedDistribution[D]): float = d.distribution.mean * d.scale + d.location

proc median*[D](d: ScaledShiftedDistribution[D]): float = d.distribution.median * d.scale + d.location

proc mode*[D](d: ScaledShiftedDistribution[D]): float = d.distribution.mode * d.scale + d.location

proc sample*[D](d: ScaledShiftedDistribution[D]): float = d.distribution.mean * d.scale + d.location

proc variance*[D](d: ScaledShiftedDistribution[D]): float = d.distribution.variance * d.scale * d.scale #???

proc loglikelihood*[D](d: ScaledShiftedDistribution[D], y: vector): float =
  for yi in y:
    result += d.pdf(yi).ln

###########################################################
type StatsDistribution* = BaseStatsDistribution|ScaledShiftedDistribution

###########################################################

proc argsort[T](a: T) : seq[int] =
  result = toSeq(0..a.len - 1)
  sort(result, proc (i, j: int): int = cmp(a[i], a[j]))

# Benjamini-Hochberg function
proc Benjamini_Hochberg_FDR*(v: vector, alpha: float=0.05, cutoff: float=0.05): tuple[index: int, p_value: float, sorted_index: int, adjusted_p_value: float, ] =
  let
    m = v.len.toFloat
    #vs = v.sorted(system.cmp[float])
    vs = v.argsort
  var
    max_index = -1
    max_ordered_index = -1
    max_pvalue = -1.0
    max_adjusted_p_value = -1.0
    x = -1.0
  for ordered_i_x, i_x in vs:
    x = v[i_x]
    let BH = alpha/m * (i_x + 1).toFloat
    if x < BH:
      #result += 1.0
      max_index = i_x
      max_ordered_index = ordered_i_x
      max_adjusted_p_value = x * m / (i_x + 1).toFloat
      max_pvalue = x
  return (index: max_index, p_value: max_pvalue, sorted_index: max_ordered_index, adjusted_p_value: max_adjusted_p_value)

