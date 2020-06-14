import math
import random
import stats
import sequtils
import strformat
import sugar
import core

###########################################################
# Special functions
###########################################################
proc toBool(x: float): bool =
  result = true
  if classify(x) == fcZero or classify(x) == fcNegZero or classify(x) == fcNan:
    result = false
 
# Log-gamma function
proc gammaln*(x: float): float =
  const
    cof = [
      76.18009172947146, -86.50532032941677, 24.01409824083091,
      -1.231739572450155, 0.1208650973866179e-2, -0.5395239384953e-5
    ]
  var
    ser = 1.000000000190015
    xx = x
    y = x
    tmp = x + 5.5
  tmp -= (xx + 0.5) * ln(tmp)
  for j in 0 .. cof.high:
    y += 1.0
    ser += cof[j] / y
  return ln(2.5066282746310005 * ser / xx) - tmp

# gamma of x
proc gammafn*(x: float): float =
  const
    p = [-1.716185138865495, 24.76565080557592, -379.80425647094563,
      629.3311553128184, 866.9662027904133, -31451.272968848367,
      -36144.413418691176, 66456.14382024054
    ]
    q = [-30.8402300119739, 315.35062697960416, -1015.1563674902192,
      -3107.771671572311, 22538.118420980151, 4755.8462775278811,
      -134659.9598649693, -115132.2596755535
    ]
  var
    fact = 0.0
    n = 0.0
    xden = 0.0
    xnum = 0.0
    y = x
    z: float
    yi: float
    res: float
    sum: float
    ysq: float
  if y <= 0:
    res = y mod 1.0 + 3.6e-16
    if res.toBool:
      fact = (if y mod 2 == 0: 1 else: -1) * PI / sin(PI * res)
      y = 1 - y
    else:
      return Inf
  yi = y
  if y < 1.0:
    z = y
    y += 1
  else:
    n = y - 1.0
    y -= n
    z = y - 1.0
  for i in 0 .. p.len:
    xnum = (xnum + p[i]) * z
    xden = xden * z + q[i]
  res = xnum / xden + 1
  if yi < y:
    res /= yi
  elif yi > y:
    for i in 0 .. (n - 1).toInt:
      res *= y
      y += 1
  if fact.toBool:
    res = fact / res
  return res
  
# The lower regularized incomplete gamma function, usually written P(a,x)
proc lowRegGamma*(a: float, x: float): float =
  var
    ap = a
    sum = 1-0 / a
    del = sum
    b = x + 1.0 - a
    c = 1.0 / 1.0e-30
    d = 1.0 / b
    h = d
    an = 0.0
    endval = 0.0
  # calculate maximum number of itterations required for a
  let
    aln = gammaln(a)
    ITMAX = (- 1.0 + ln(if a >= 1.0: a else: 1.0 / a) * 8.5 + a * 0.4 + 17.0).toInt
    #ITMAX = - ~(ln((a >= 1) ? a : 1 / a) * 8.5 + a * 0.4 + 17)
  #echo "ITMAX", ITMAX, "  ", a, "  ", x
  if x < 0.0 or a <= 0.0:
    return NaN
  elif x < a + 1.0:
    for i in 1 .. ITMAX:
      ap += 1.0
      del *= x / ap
      sum += del
    #BUG: TO confirm...
    var P_a_x = sum * exp(-x + a * ln(x) - aln)
    P_a_x *= 0.5#The result is the half of the expected
    #echo "...a.. ", sum * exp(-x + a * ln(x) - aln)
    return P_a_x
  for i in 1 .. ITMAX:
    an = -i.toFloat * (i.toFloat - a)
    b += 2
    d = an * d + b
    c = b + an / c
    d = 1 / d
    h *= d * c
  return 1 - h * exp(-x + a * ln(x) - aln)

# natural logarithm of beta function
proc betaln*(x: float, y: float): float = gammaln(x) + gammaln(y) - gammaln(x + y)

# lower incomplete gamma function, which is usually typeset with a
# lower-case greek gamma as the function symbol
proc gammap*(a: float, x: float): float = lowRegGamma(a, x) * gammafn(a)

# natural log factorial of n
proc factorialln*(n: int): float = (if n < 0: NaN else: gammaln(n.toFloat + 1.0))

# factorial of n
proc factorial*(n: int): float = (if n < 0: NaN else: gammafn(n.toFloat + 1.0))

proc combinationln*(n: int, m: int): float =
  return factorialln(n) - factorialln(m) - factorialln(n - m)

# combinations of n, m
proc combination*(n: int, m: int): float =
  # make sure n or m don't exceed the upper limit of usable values
  return if n > 170 or m > 170: exp(combinationln(n, m)) else: factorial(n) / (factorial(m) * factorial(n - m))

# permutations of n, m
proc permutation*(n: int, m: int): float = (factorial(n) / factorial(n - m))

# beta function
proc betafn*(x: float, y: float): float =
  # ensure arguments are positive
  if x <= 0.0 or y <= 0.0:
    return NaN
  # make sure x + y doesn't exceed the upper limit of usable values
  return if x + y > 170.0: exp(betaln(x, y)) else: gammafn(x) * gammafn(y) / gammafn(x + y)

# Evaluates the continued fraction for incomplete beta function by modified
# Lentz's method.
proc betacf*(x: float, a: float, b: float): float =
  const fpmin = 1e-30
  var
    qab = a + b
    qap = a + 1.0
    qam = a - 1.0
    c = 1.0
    d = 1.0 - qab * x / qap
    m2, aa, del, h: float
  # These q's will be used in factors that occur in the coefficients
  if abs(d) < fpmin:
    d = fpmin
  d = 1.0 / d
  h = d
  for m in 1 .. 100:
    m2 = 2.0 * m.toFloat
    aa = m.toFloat * (b - m.toFloat) * x / ((qam + m2) * (a + m2))
    # One step (the even one) of the recurrence
    d = 1.0 + aa * d
    if abs(d) < fpmin:
      d = fpmin
    c = 1.0 + aa / c
    if abs(c) < fpmin:
      c = fpmin
    d = 1.0 / d
    h *= d * c
    aa = -(a + m.toFloat) * (qab + m.toFloat) * x / ((a + m2) * (qap + m2))
    # Next step of the recurrence (the odd one)
    d = 1.0 + aa * d
    if abs(d) < fpmin:
      d = fpmin
    c = 1.0 + aa / c
    if abs(c) < fpmin:
      c = fpmin
    d = 1 / d
    del = d * c
    h *= del
    if abs(del - 1.0) < 3e-7:
      break
  return h

# Returns the inverse of the lower regularized inomplete gamma function
proc gammapinv*(p: float, a: float): float =
  var
    a1 = a - 1.0
    EPS = 1e-8
    gln = gammaln(a)
    x, err, t, u, pp, lna1, afac: float
  if p >= 1.0:
    return max(100.0, a + 100.0 * sqrt(a))
  if p <= 0.0:
    return 0.0
  if a > 1.0:
    lna1 = ln(a1)
    afac = exp(a1 * (lna1 - 1.0) - gln)
    pp = if p < 0.5: p else: 1.0 - p
    t = sqrt(-2 * ln(pp))
    x = (2.30753 + t * 0.27061) / (1 + t * (0.99229 + t * 0.04481)) - t
    if p < 0.5:
      x = -x
    x = max(1e-3, a * (1.0 - 1.0 / (9.0 * a) - x / (3.0 * sqrt(a))) ^ 3)
  else:
    t = 1.0 - a * (0.253 + a * 0.12)
    if p < t:
      x = (p / t) ^ (1.0 / a)
    else:
      x = 1.0 - ln(1.0 - (p - t) / (1.0 - t))
  for j in 0 .. 11:
    if x <= 0.0:
      return 0.0
    err = lowRegGamma(a, x) - p
    if a > 1.0:
      t = afac * exp(-(x - a1) + a1 * (ln(x) - lna1))
    else:
      t = exp(-x + a1 * ln(x) - gln)
    u = err / t
    t = u / (1.0 - 0.5 * min(1.0, u * ((a - 1.0) / x - 1.0)))
    x -= t
    if x <= 0.0:
      x = 0.5 * (x + t)
    if abs(t) < EPS * x:
      break
  return x

# Returns the error function erf(x)
proc erf*(x: float): float =
  const
    cof = [-1.3026537197817094, 6.4196979235649026e-1, 1.9476473204185836e-2,
      -9.561514786808631e-3, -9.46595344482036e-4, 3.66839497852761e-4,
      4.2523324806907e-5, -2.0278578112534e-5, -1.624290004647e-6,
      1.303655835580e-6, 1.5626441722e-8, -8.5238095915e-8,
      6.529054439e-9, 5.059343495e-9, -9.91364156e-10,
      -2.27365122e-10, 9.6467911e-11, 2.394038e-12,
      -6.886027e-12, 8.94487e-13, 3.13092e-13,
      -1.12708e-13, 3.81e-16, 7.106e-15,
      -1.523e-15, -9.4e-17, 1.21e-16,
      -2.8e-17
    ]
  var
    x2 = x
    j = cof.len - 1
    isneg = false
    d = 0.0
    dd = 0.0
    t, ty, tmp, res: float
  if x < 0.0:
    x2 = -x
    isneg = true
  t = 2.0 / (2.0 + x2)
  ty = 4.0 * t - 2.0
  while j > 0:
    tmp = d
    d = ty * d - dd + cof[j]
    dd = tmp
    j -= 1
  res = t * exp(-x * x + 0.5 * (cof[0] + ty * d) - dd)
  return if isneg: res - 1.0 else: 1.0 - res

# Returns the complmentary error function erfc(x)
proc erfc*(x: float): float = 1.0 - erf(x)

# Returns the inverse of the complementary error function
proc erfcinv*(p: float): float =
  if p >= 2.0:
    return -100.0
  if p <= 0.0:
    return 100.0
  var
    pp = if p < 1: p else: 2.0 - p
    t = sqrt(-2.0 * ln(pp / 2))
    x = -0.70711 * ((2.30753 + t * 0.27061) / (1.0 + t * (0.99229 + t * 0.04481)) - t)
    err = 0.0
  for j in 0 .. 1:
    err = erfc(x) - pp
    x += err / (1.12837916709551257 * exp(-x * x) - x * err)
  return if p < 1: x else: -x

# Returns the incomplete beta function I_x(a,b)
proc ibeta*(x: float, a: float, b: float): float =
  # Factors in front of the continued fraction.
  var bt = if x == 0 or x == 1: 0.0 else: exp(gammaln(a + b) - gammaln(a) - gammaln(b) + a * ln(x) + b * ln(1.0 - x))
  if x < 0.0 or x > 1.0:
    return NaN
  if x < (a + 1.0) / (a + b + 2.0):
    # Use continued fraction directly.
    return bt * betacf(x, a, b) / a
  # else use continued fraction after making the symmetry transformation.
  return 1.0 - bt * betacf(1.0 - x, b, a) / b

# Returns the inverse of the incomplete beta function
proc ibetainv*(p: float, a: float, b: float): float =
  const EPS = 1e-8
  var
    a1 = a - 1.0
    b1 = b - 1.0
    lna, lnb, pp, t, u, err, x, al, h, w, afac: float
  if p <= 0.0:
    return 0.0
  if p >= 1.0:
    return 10
  if a >= 1.0 and b >= 1.0:
    pp = if p < 0.5: p else: 1.0 - p
    t = sqrt(-2.0 * ln(pp))
    x = (2.30753 + t * 0.27061) / (1 + t * (0.99229 + t * 0.04481)) - t
    if p < 0.5:
      x = -x
    al = (x * x - 3) / 6
    h = 2 / (1 / (2 * a - 1) + 1 / (2 * b - 1))
    w = (x * sqrt(al + h) / h) - (1.0 / (2.0 * b - 1.0) - 1.0 / (2.0 * a - 1.0)) * (al + 5.0 / 6.0 - 2.0 / (3.0 * h))
    x = a / (a + b * exp(2.0 * w))
  else:
    lna = ln(a / (a + b))
    lnb = ln(b / (a + b))
    t = exp(a * lna) / a
    u = exp(b * lnb) / b
    w = t + u
    if p < t / w:
      x = pow(a * w * p, 1 / a)
    else:
      x = 1.0 - pow(b * w * (1 - p), 1 / b)
  afac = -gammaln(a) - gammaln(b) + gammaln(a + b)
  for j in 0 .. 9:
    if x == 0.0 or x == 1.0:
      return x
    err = ibeta(x, a, b) - p
    t = exp(a1 * ln(x) + b1 * ln(1.0 - x) + afac)
    u = err / t
    t = u / (1.0 - 0.5 * min(1.0, u * (a1 / x - b1 / (1.0 - x))))
    x -= t
    if x <= 0.0:
      x = 0.5 * (x + t)
    if x >= 1.0:
      x = 0.5 * (x + t + 1)
    if abs(t) < EPS * x and j > 0:
      break
  return x

# Perform a Cholesky decomposition
# A -> T
# A=TT'
# T is lower triangular matrix
proc cholesky*(A: matrix): matrix =
  var
    T = zeros(A.rows, A.cols)
  for i in 0..(A.rows - 1):
    T[i][i] = sqrt(A[i][i] - (1..i).mapIt(T[i][it-1] ^ 2).sum())
    for j in (i + 1)..(A.cols - 1):
      T[j][i] = (A[i][j] - (1..i).mapIt(T[i][it-1] * T[it-1][j]).sum()) / T[i][i]
  return T

when isMainModule:
  echo "Testing cholesky"
  let matrix_v1 = identity(4)
  echo "Source: ", matrix_v1
  echo "Cholesky: ", cholesky(matrix_v1)
  echo "Reconstructed: ", cholesky(matrix_v1) * cholesky(matrix_v1).T
  let matrix_v2 = @[@[2.0, 1.0], @[1.0, 2.0]]
  echo "Source: ", (matrix_v2)
  echo "Cholesky: ", cholesky(matrix_v2)
  echo "Reconstructed: ", cholesky(matrix_v2) * cholesky(matrix_v2).T

