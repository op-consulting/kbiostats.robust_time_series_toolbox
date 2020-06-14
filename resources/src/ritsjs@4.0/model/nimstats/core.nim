import math
import stats
import sequtils
import strformat


###########################################################
# MATH HOOKS
###########################################################
proc `^`*(a: float, b: float): float =
  pow(a, b)

proc `**`*(a: float, b: float): float =
  pow(a, b)

###########################################################
# DEFINITIONS
###########################################################
type vector* = seq[float]
type matrix* = seq[seq[float]]

when isMainModule:
  echo "[Initializing]"
  let v1 = @[1.0, 2.0, 3.0, 4.0, 5.0, 6.0]
  let v2 = @[2.0, 1.0, 2.0, 0.0, 3.0, -2.0]
  let v3 = @[2.0, 1.0, 2.0, 0.0]
  let m1 = @[
    @[1.0, 2.0, 3.0],
    @[4.0, 5.0, 6.0],
  ]
  let m2 = @[
    @[2.0, 1.0, 2.0],
    @[0.0, 3.0, -2.0],
  ]
  let m3 = @[@[1.0, 2.0, 3.0], @[4.0, 5.0, 6.0]]
  let m4 = @[@[9.0, 8.0, 7.0, 6.0], @[5.0, 4.0, 3.0, 2.0], @[1.0, 2.0, 3.0, 4.0]]
  let m5 = @[
    @[8.0, 5.0, 9.0],
    @[4.0, 9.0, 0.0],
    @[1.0, 3.0, 1.0]
  ]
  let mid3 = @[@[1.0, 0.0, 0.0], @[0.0, 1.0, 0.0], @[0.0, 0.0, 1.0]]
  let mid4 = @[@[1.0, 0.0, 0.0, 0.0], @[0.0, 1.0, 0.0, 0.0], @[0.0, 0.0, 1.0, 0.0], @[0.0, 0.0, 0.0, 1.0]]
  let k1 = 0.0
  let k2 = 2.0
  assert(v1 == v1)
  assert(v2 == v2)
  assert(v1 != v2)
  assert(m1 == m1)
  assert(m2 == m2)
  assert(m1 != m2)

###########################################################
# VECTOR OPERATIONS
###########################################################
proc arange*(a: float, b: float, interval: float=1.0): vector {.inline.} =
  if b <= a: return @[]
  var k = a
  while k < b:
    result.add k
    k += interval

proc arange*(a: float): vector {.inline.} = arange(0.0, a, 1.0)

proc arange*(a: int, b: int, interval: int=1): vector {.inline.} = arange(a.toFloat, b.toFloat, interval.toFloat)

proc arange*[U, V](r: HSlice[U, V]): vector {.inline.} =
  for k in r.a..r.b:
    result.add k.toFloat

when isMainModule:
  echo "Testing vector function: arange"
  assert(arange(6.0) == @[0.0, 1.0, 2.0, 3.0, 4.0, 5.0])
  assert(arange(6) == @[0.0, 1.0, 2.0, 3.0, 4.0, 5.0])
  assert(arange(1.0, 6.0) == @[1.0, 2.0, 3.0, 4.0, 5.0])
  assert(arange(1, 6) == @[1.0, 2.0, 3.0, 4.0, 5.0])
  assert(arange(1.0, 3.0, 2.0) == @[1.0])
  assert(arange(1, 3, 2) == @[1.0])
  echo "  [OK]"

###########################################################
proc addition*(a: vector, b: vector): vector {.inline.} =
  assert(a.len == b.len)
  for k in a.low..a.high:
    result.add a[k] + b[k]

proc addition*(a: vector, b: float): vector {.inline.} =
  for k in a.low..a.high:
    result.add a[k] + b

proc addition*(a: float, b: vector): vector {.inline.} = addition(b, a)

proc `+`*(a: vector, b: vector): vector {.inline.} = a.addition(b)

proc `+`*(a: vector, b: float): vector {.inline.} = a.addition(b)

proc `+`*(a: float, b: vector): vector {.inline.} = a.addition(b)

when isMainModule:
  echo "Testing vector function: add"
  assert(v1 + v2 == @[3.0, 3.0, 5.0, 4.0, 8.0, 4.0])
  assert(v1 + k1 == v1)
  assert(v1 + k2 == @[3.0, 4.0, 5.0, 6.0, 7.0, 8.0])
  echo "  [OK]"

###########################################################
proc negate*(a: vector): vector {.inline.} =
  for k in a.low..a.high:
    result.add(-a[k])

proc `-`*(a: vector): vector {.inline.} = a.negate

when isMainModule:
  echo "Testing vector function: negate"
  assert(-v1 == @[-1.0, -2.0, -3.0, -4.0, -5.0, -6.0])
  assert(-v2 == @[-2.0, -1.0, -2.0, -0.0, -3.0, 2.0])
  echo "  [OK]"

###########################################################
proc subtract*(a: vector, b: vector): vector {.inline.} =
  assert(a.len == b.len)
  for k in a.low..a.high:
    result.add a[k] - b[k]

proc subtract*(a: vector, b: float): vector {.inline.} = addition(a, -b)

proc subtract*(a: float, b: vector): vector {.inline.} = addition(a, -b)

proc `-`*(a: vector, b: vector): vector {.inline.} = a.subtract(b)

proc `-`*(a: vector, b: float): vector {.inline.} = a.subtract(b)

proc `-`*(a: float, b: vector): vector {.inline.} = a.subtract(b)

when isMainModule:
  echo "Testing vector function: subtract"
  assert(v1 - v2 == @[-1.0, 1.0, 1.0, 4.0, 2.0, 8.0])
  assert(v2 - v1 == @[1.0, -1.0, -1.0, -4.0, -2.0, -8.0])
  assert(v1 - k1 == v1)
  assert(v1 - k2 == @[-1.0, 0.0, 1.0, 2.0, 3.0, 4.0])
  assert((v1 + k2) - k2 == v1)
  assert((v2 + k2) - k2 == v2)
  echo "  [OK]"

###########################################################
type TShape* = tuple[rows: int, cols: int]

proc rows*(a: vector): int {.inline.} = 1

proc cols*(a: vector): int {.inline.} = a.len

proc shape*(a: vector): TShape {.inline.} = (1, a.len)

proc is_square*(a: vector): bool {.inline.} = false

when isMainModule:
  echo "Testing vector function: rows, cols, shape"
  assert(v2.rows == 1)
  assert(v2.cols == 6)
  assert(v2.shape == (1, 6))
  assert(v3.rows == 1)
  assert(v3.cols == 4)
  assert(v3.shape == (1, 4))
  echo "  [OK]"

###########################################################
proc multiply*(a: vector, b: vector): vector {.inline.} =
  assert(a.len == b.len)
  for k in a.low..a.high:
    result.add a[k] * b[k]

proc multiply*(a: vector, b: float): vector {.inline.} = 
  for k in a.low..a.high:
    result.add a[k] * b

proc multiply*(a: float, b: vector): vector {.inline.} = multiply(b, a)

proc `*`*(a: vector, b: vector): vector {.inline.} = a.multiply(b)

proc `*`*(a: vector, b: float): vector {.inline.} = a.multiply(b)

proc `*`*(a: float, b: vector): vector {.inline.} = a.multiply(b)

proc wise_multiply*(a: vector, b: vector): vector {.inline.} = multiply(a, b)

proc wise_multiply*(a: vector, b: float): vector {.inline.} = multiply(a, b)

proc wise_multiply*(a: float, b: vector): vector {.inline.} = multiply(b, a)

proc `.*`*(a: vector, b: vector): vector {.inline.} = a.multiply(b)

proc `.*`*(a: vector, b: float): vector {.inline.} = a.multiply(b)

proc `.*`*(a: float, b: vector): vector {.inline.} = a.multiply(b)

when isMainModule:
  echo "Testing vector function: multiply/wise_multiply"
  assert(v1 * k1 == @[0.0, 0.0, 0.0, 0.0, 0.0, 0.0])
  assert(v1 * v2 == @[2.0, 2.0, 6.0, 0.0, 15.0, -12.0])
  assert(v2 * v1 == @[2.0, 2.0, 6.0, 0.0, 15.0, -12.0])
  assert(v1 .* k1 == @[0.0, 0.0, 0.0, 0.0, 0.0, 0.0])
  assert(v1 .* v2 == @[2.0, 2.0, 6.0, 0.0, 15.0, -12.0])
  assert(v2 .* v1 == @[2.0, 2.0, 6.0, 0.0, 15.0, -12.0])
  echo "  [OK]"

###########################################################
proc divide*(a: vector, b: vector): vector {.inline.} =
  assert(a.len == b.len)
  for k in a.low..a.high:
    result.add a[k] / b[k]

proc divide*(a: vector, b: float): vector {.inline.} = 
  for k in a.low..a.high:
    result.add a[k] / b

proc divide*(a: float, b: vector): vector {.inline.} = 
  for k in b.low..b.high:
    result.add a / b[k]

proc `/`*(a: vector, b: vector): vector {.inline.} = a.divide(b)

proc `/`*(a: vector, b: float): vector {.inline.} = a.divide(b)

proc `/`*(a: float, b: vector): vector {.inline.} = a.divide(b)

proc wise_divide*(a: vector, b: vector): vector {.inline.} = divide(a, b)

proc wise_divide*(a: vector, b: float): vector {.inline.} = divide(a, b)

proc wise_divide*(a: float, b: vector): vector {.inline.} = divide(a, b)

proc `./`*(a: vector, b: vector): vector {.inline.} = a.divide(b)

proc `./`*(a: vector, b: float): vector {.inline.} = a.divide(b)

proc `./`*(a: float, b: vector): vector {.inline.} = a.divide(b)

when isMainModule:
  echo "Testing vector function: divide/wise_divide"
  assert(@[0.0, 0.0, 0.0, 0.0, 0.0, 0.0] / @[5.0, 4.0, 3.0, 2.0, 1.0, 10.0] == @[0.0, 0.0, 0.0, 0.0, 0.0, 0.0])
  assert(@[5.0, 4.0, 3.0, 2.0, 1.0] / @[5.0, 4.0, 3.0, 2.0, 1.0] == @[1.0, 1.0, 1.0, 1.0, 1.0])
  assert(@[5.0, 4.0, -3.0, 2.0, 1.0] / @[-5.0, 4.0, 3.0, 2.0, -1.0] == @[-1.0, 1.0, -1.0, 1.0, -1.0])
  assert(@[0.0, 0.0, 0.0, 0.0, 0.0, 0.0] ./ @[5.0, 4.0, 3.0, 2.0, 1.0, 10.0] == @[0.0, 0.0, 0.0, 0.0, 0.0, 0.0])
  assert(@[5.0, 4.0, 3.0, 2.0, 1.0] ./ @[5.0, 4.0, 3.0, 2.0, 1.0] == @[1.0, 1.0, 1.0, 1.0, 1.0])
  assert(@[5.0, 4.0, -3.0, 2.0, 1.0] ./ @[-5.0, 4.0, 3.0, 2.0, -1.0] == @[-1.0, 1.0, -1.0, 1.0, -1.0])
  echo "  [OK]"

###########################################################
proc dot*(a: vector, b: vector): float {.inline.} =
  assert(a.len == b.len)
  for k in a.low..a.high:
    result += a[k] * b[k]

proc inner*(a: vector, b: vector): float {.inline.} = dot(a, b)

when isMainModule:
  echo "Testing vector function: dot/inner"
  assert(dot(v1, v2) == 13)
  assert(dot(@[1.0, 2.0, 3.0], @[4.0, 5.0, 6.0]) == 32)
  echo "  [OK]"

###########################################################
proc abs*(a: vector): vector =
  for k in a.low..a.high:
    result.add a[k].abs

when isMainModule:
  echo "Testing vector function: abs"
  assert(@[1.0, 1.0, -1.0].abs == @[1.0, 1.0, 1.0])
  assert(@[-12.0, 1.0, -1.0].abs == @[12.0, 1.0, 1.0])
  echo "  [OK]"

###########################################################
proc any_val*(a: vector, true_val: float=1.0): bool =
  for k in a.low..a.high:
    if a[k] == true_val: return true
  return false

proc all_val*(a: vector, true_val: float=1.0): bool =
  for k in a.low..a.high:
    if a[k] != true_val: return false
  return true

when isMainModule:
  echo "Testing vector function: any_val/all_val"
  assert(@[1.0, 1.0, 1.0].all_val)
  assert(@[1.0, 1.0, 1.0].any_val)
  assert(not @[0.0, 1.0, 1.0].all_val)
  assert(not @[0.0, 0.0, 0.0].any_val)
  echo "  [OK]"

###########################################################
proc `<`*(a: vector, b: vector): vector {.inline.} =
  assert(a.len == b.len)
  for k in a.low..a.high:
    result.add(if a[k] < b[k]: 1.0 else: 0.0)

proc `<`*(a: vector, b: float): vector {.inline.} =
  for k in a.low..a.high:
    result.add(if a[k] < b: 1.0 else: 0.0)

proc `<=`*(a: vector, b: vector): vector {.inline.} =
  assert(a.len == b.len)
  for k in a.low..a.high:
    result.add(if a[k] <= b[k]: 1.0 else: 0.0)

proc `<=`*(a: vector, b: float): vector {.inline.} =
  for k in a.low..a.high:
    result.add(if a[k] <= b: 1.0 else: 0.0)
  
proc `>`*(a: vector, b: vector): vector {.inline.} =
  assert(a.len == b.len)
  for k in a.low..a.high:
    result.add(if a[k] > b[k]: 1.0 else: 0.0)

proc `>`*(a: vector, b: float): vector {.inline.} =
  for k in a.low..a.high:
    result.add(if a[k] > b: 1.0 else: 0.0)

proc `>=`*(a: vector, b: vector): vector {.inline.} =
  assert(a.len == b.len)
  for k in a.low..a.high:
    result.add(if a[k] >= b[k]: 1.0 else: 0.0)

proc `>=`*(a: vector, b: float): vector {.inline.} =
  for k in a.low..a.high:
    result.add(if a[k] >= b: 1.0 else: 0.0)

proc `===`*(a: vector, b: vector): vector {.inline.} =
  assert(a.len == b.len)
  for k in a.low..a.high:
    result.add(if a[k] == b[k]: 1.0 else: 0.0)

proc `===`*(a: vector, b: float): vector {.inline.} =
  for k in a.low..a.high:
    result.add(if a[k] == b: 1.0 else: 0.0)

when isMainModule:
  echo "Testing vector function: < <= > >="
  assert(((@[-1.0, -2.0,  3.0, -4.0, 5.0, -6.0] < -1.0) === @[0.0, 1.0, 0.0, 1.0, 0.0, 1.0]).all_val)
  assert(((@[-2.0,  1.0, -2.0,  0.0, 3.0,  2.0] < 1.0) === @[1.0, 0.0, 1.0, 1.0, 0.0, 0.0]).all_val)
  assert(((@[-1.0, -2.0,  3.0, -4.0, 5.0, -6.0] <= -1.0) === @[1.0, 1.0, 0.0, 1.0, 0.0, 1.0]).all_val)
  assert(((@[-2.0,  1.0, -2.0,  0.0, 3.0,  2.0] <= 1.0) === @[1.0, 1.0, 1.0, 1.0, 0.0, 0.0]).all_val)
  assert(((@[-1.0, -2.0,  3.0, -4.0, 5.0, -6.0] > -1.0) === @[0.0, 0.0, 1.0, 0.0, 1.0, 0.0]).all_val)
  assert(((@[-2.0,  1.0, -2.0,  0.0, 3.0,  2.0] > 1.0) === @[0.0, 0.0, 0.0, 0.0, 1.0, 1.0]).all_val)
  assert(((@[-1.0, -2.0,  3.0, -4.0, 5.0, -6.0] >= -1.0) === @[1.0, 0.0, 1.0, 0.0, 1.0, 0.0]).all_val)
  assert(((@[-2.0,  1.0, -2.0,  0.0, 3.0,  2.0] >= 1.0) === @[0.0, 1.0, 0.0, 0.0, 1.0, 1.0]).all_val)
  assert(((@[-1.0, -2.0,  3.0, -4.0, 5.0, -6.0] === -1.0) === @[1.0, 0.0, 0.0, 0.0, 0.0, 0.0]).all_val)
  assert(((@[-2.0,  1.0, -2.0,  0.0, 3.0,  2.0] === 1.0) === @[0.0, 1.0, 0.0, 0.0, 0.0, 0.0]).all_val)
  echo "  [OK]"

###########################################################
proc outer*(a: vector, b: vector): matrix {.inline.} = 
  assert(a.len == b.len)
  for k in a.low..a.high:
    result.add @[]
    for q in b.low..b.high:
      result[k].add a[k] * b[q]

when isMainModule:
  echo "Testing matrix function: outer"
  assert(outer(@[1.0, 2.0, 3.0, 4.0], @[7.0,  8.0,  9.0, 10.0]) == @[
    @[7.0, 8.0, 9.0, 10.0],
    @[14.0, 16.0, 18.0, 20.0],
    @[21.0, 24.0, 27.0, 30.0],
    @[28.0, 32.0, 36.0, 40.0]
  ])
  echo "  [OK]"

###########################################################
proc norm*(a: vector, p: float = 2.0): float {.inline.} =
  for k in a.low..a.high:
    result += pow(a[k], p)
  result = pow(result, 1.0 / p)

when isMainModule:
  echo "Testing vector function: norm"
  assert(abs(norm(@[0.0, 1.0, 0.0]) - 1) < 0.1)
  assert(abs(norm(@[1.0, 10.0, 6.0]) - 11.7047) < 0.1)
  assert(abs(norm(@[1.0, 10.0, 6.0], 3) - 10.6765) < 0.1)
  echo "  [OK]"

###########################################################
proc sum*(a: vector): float {.inline.} =
  for k in a.low..a.high:
    result += a[k]

proc prod*(a: vector): float {.inline.} =
  result = 1.0
  for k in a.low..a.high:
    result *= a[k]

when isMainModule:
  echo "Testing vector function: sum"
  assert(sum(@[0.0, 1.0, 0.0]) == 1.0)
  assert(sum(@[5.0, 1.0, -3.0]) == 3.0)
  assert(prod(@[0.0, 1.0, 0.0]) == 0.0)
  assert(prod(@[5.0, 1.0, -3.0]) == -15.0)
  echo "  [OK]"

###########################################################
proc pow*(a: vector, b: vector): vector {.inline.} =
  assert(a.len == b.len)
  for k in a.low..a.high:
    result.add pow(a[k], b[k])

proc pow*(a: vector, b: float): vector {.inline.} =
  for k in a.low..a.high:
    result.add pow(a[k], b)

proc pow*(a: float, b: vector): vector {.inline.} = pow(b, a)

proc `.^`*(a: vector, b: vector): vector {.inline.} = a.pow(b)

proc `.^`*(a: vector, b: float): vector {.inline.} = a.pow(b)

proc `.^`*(a: float, b: vector): vector {.inline.} = a.pow(b)

when isMainModule:
  echo "Testing vector function: pow"
  assert(v1 .^ 1 == v1)
  assert(v1 .^ 2 == @[1.0, 4.0, 9.0, 16.0, 25.0, 36.0])
  assert(v2 .^ 3 == @[8.0, 1.0, 8.0, 0.0, 27.0, -8.0])
  assert(v2 .^ v1 == @[2.0, 1.0, 8, 0.0, 243.0, 64.0])
  echo "  [OK]"

###########################################################
proc constant_vector*(cols: int, constant: float): vector {.inline.} = 
  for i in 1..cols:
    result.add constant

proc zeros*(col: int): vector {.inline.} = constant_vector(col, 0.0)

proc ones*(col: int): vector {.inline.} = constant_vector(col, 1.0)

when isMainModule:
  echo "Testing matrix function: constant_matrix/ones/zeros"
  assert(zeros(3) == @[0.0, 0.0, 0.0])
  assert(ones(4) == @[1.0, 1.0, 1.0, 1.0])
  assert(constant_vector(5, 101.0) == @[101.0, 101.0, 101.0, 101.0, 101.0])
  echo "  [OK]"

###########################################################
proc round*(a: vector, decimals: int = 1): vector {.inline.} = 
  let M = pow(10, decimals.toFloat)
  for k in a.low..a.high:
    result.add round(a[k] * M) / M

when isMainModule:
  echo "Testing vector function: round"
  assert(round(@[0.1234, 1.4566, 0.789], 1) == @[0.1, 1.5, 0.8])
  assert(round(@[0.1234, 1.4566, 0.789], 2) == @[0.12, 1.46, 0.79])
  echo "  [OK]"


###########################################################

proc hstack*(vectors: varargs[vector]): vector {.inline.} = 
  result = @[] #BUG in JS backend
  result.add @[]
  for a in vectors.items:
    for c in 0 .. (a.len - 1):
      result.add a[c]

proc hstack*(a: vector, b: float): vector {.inline.} = 
  result = @[] #BUG in JS backend
  result.add @[]
  for c in 0 .. (a.len - 1):
    result.add a[c]
  result.add b

proc concatenate*(vectors: varargs[vector], axis: int=1): vector {.inline.} = 
  assert(axis == 0 or axis == -1)
  return hstack(vectors)

when isMainModule:
  echo "Testing vector function: hstack/concatenate"
  assert(hstack(@[1.0, 2.0], @[3.0, 4.0], @[5.0, 6.0]) == @[1.0, 2.0, 3.0, 4.0, 5.0, 6.0])

  assert(concatenate(@[1.0, 2.0], @[3.0, 4.0], @[5.0, 6.0], axis=0) == @[1.0, 2.0, 3.0, 4.0, 5.0, 6.0])
  echo "  [OK]"

###########################################################
proc as_column_vector*(v: vector): matrix =
  for i in 1 .. v.len:
    result.add @[v[i - 1]]

when isMainModule:
  echo "Testing vector function: as_column_vector"
  assert(as_column_vector(@[1.0, 2.0, 3.0]) == @[@[1.0], @[2.0], @[3.0]])
  echo "  [OK]"

###########################################################
proc mean*(a: vector, axis: int=0): float {.inline.} =
  assert axis == 0
  for k in a.low..a.high:
    result += a[k]
  result = result / a.len.toFloat

proc variance*(a: vector, axis: int=0): float {.inline.} =
  assert axis == 0
  return (a .^ 2).mean(axis) - a.mean() ^ 2

proc standard_deviation*(a: vector, axis: int=0): float {.inline.} =
  assert axis == 0
  return (a .^ 2).mean(axis) - (a.mean) ^ 2

# TO DO: ADD TEST

###########################################################
proc interpolated_if_not_valid*(data: vector, i: int): float {.inline.} =
  let v = data[i]
  if v.classify == fcNaN or v.classify == fcInf or v.classify == fcNegInf or (v * 10 / 10 != v): #This works in JS
    if i == data.low:
      return data[i + 1]
    elif i == data.high:
      return data[i - 1]
    else:
      return 0.5 * (data[i - 1] + data[i + 1])
  return data[i]

proc fill_non_numerical*(v: vector): vector {.exportc.} =
  for k in v.low..v.high:
    result.add v.interpolated_if_not_valid(k)

when isMainModule:
  if true:
    echo "Testing vector function: interpolated_if_not_valid/fill_non_numerical"
    let vector_a = @[1.0, Nan, 3.0, 4.0]
    assert vector_a.fill_non_numerical == @[1.0, 2.0, 3.0, 4.0]
    let vector_b = @[Nan, 3.0, 4.0, 5.0]
    assert vector_b.fill_non_numerical == @[3.0, 3.0, 4.0, 5.0]
    let vector_c = @[1.0, 2.0, 3.0, 4.0, NaN]
    assert vector_c.fill_non_numerical == @[1.0, 2.0, 3.0, 4.0, 4.0]
    echo "[OK]"

###########################################################
proc subsample*(v: vector, sampling: int): vector =
  for k in v.low..v.high:
    if k mod sampling != 0:
      continue
    result.add v.interpolated_if_not_valid(k)

when isMainModule:
  if true:
    echo "Testing vector function: subsample"
    let vector_a = @[1.0, Nan, 3.0, 4.0]
    assert vector_a.subsample(2) == @[1.0, 3.0]
    let vector_b = @[Nan, 3.0, 4.0, 5.0]
    assert vector_b.subsample(2) == @[3.0, 4.0]
    let vector_c = @[1.0, 2.0, 3.0, 4.0, 5.0, NaN]
    assert vector_c.subsample(2) == @[1.0, 3.0, 5.0]
    let vector_d = @[1.0, 2.0, 3.0, 4.0, 5.0, 6.0, NaN, 8.0, 9.0, Nan]
    assert vector_d.subsample(3) == @[1.0, 4.0, 7.0, 9.0]
    echo "[OK]"


###########################################################
# MATRIX OPERATIONS
###########################################################
type WholeAxisIndicator = object
const WHOLE_AXIS*: WholeAxisIndicator = WholeAxisIndicator()

proc `[]`*(a: matrix, r: int, c: int): float = a[r][c]
proc `[]`*[U,V](a: matrix, r: int, c: HSlice[U, V]): vector = a[r][c]
proc `[]`*[U,V](a: matrix, r: HSlice[U, V], c: int): vector =
  for k in r.a..r.b:
    result.add a[k][c]
proc `[]`*[U,V](a: matrix, r: WholeAxisIndicator, c: HSlice[U, V]): matrix =
  result = @[] #BUG in JS backend
  for k in a.low..a.high:
    result.add @[a[k][c]]
proc `[]`*[U,V](a: matrix, r: HSlice[U, V], c: WholeAxisIndicator): matrix =
  result = @[] #BUG in JS backend
  for k in r.a..r.b:
    result.add a[k]
proc `[]`*[U1,V1,U2,V2](a: matrix, r: HSlice[U1, V1], c: HSlice[U2, V2]): matrix =
  for i in r.a..r.b:
    result.add @[]
    for j in c.a..c.b:
      result[result.high].add a[i][j]

when isMainModule:
  echo "Testing matrix function: []"
  assert(@[@[3.0, -3.0, 5.0], @[4.0, 8.0, 4.0]][1, 2] == 4.0)
  assert(@[@[3.0, -3.0, 5.0], @[4.0, 8.0, 4.0]][0, 1] == -3.0)
  assert(@[@[3.0, -3.0, 5.0], @[4.0, 8.0, 4.0], @[3.0, 8.0, 4.0]][0..1] == @[@[3.0, -3.0, 5.0], @[4.0, 8.0, 4.0]])
  assert(@[@[3.0, -3.0, 5.0], @[4.0, 8.0, 4.0], @[3.0, 8.0, 4.0]][WHOLE_AXIS, 0..1] == @[@[3.0, -3.0], @[4.0, 8.0], @[3.0, 8.0]])
  assert(@[@[3.0, -3.0, 5.0], @[4.0, 8.0, 4.0], @[3.0, 8.0, 4.0]][1..2, WHOLE_AXIS] == @[@[4.0, 8.0, 4.0], @[3.0, 8.0, 4.0]])
  assert(@[@[3.0, -3.0, 5.0], @[4.0, 8.0, 4.0], @[3.0, 8.0, 4.0]][0, 1..2] == @[-3.0, 5.0])
  assert(@[@[3.0, -3.0, 5.0], @[4.0, 8.0, 4.0], @[3.0, 8.0, 4.0]][0..1, 2] == @[5.0, 4.0])
  assert(@[@[3.0, -3.0, 5.0], @[4.0, 8.0, 4.0], @[3.0, 8.0, 4.0]][0..1, 1..2] == @[@[-3.0, 5.0], @[8.0, 4.0]])
  echo "  [OK]"

###########################################################
proc addition*(a: matrix, b: matrix): matrix {.inline.} =
  assert(a.len == b.len)
  assert(a[a.low].len == b[b.low].len)
  for k in a.low..a.high:
    result.add @[]
    for q in a[a.low].low..a[a.low].high:
      result[k].add a[k][q] + b[k][q]

proc addition*(a: matrix, b: float): matrix {.inline.} =
  for k in a.low..a.high:
    result.add @[]
    for q in a[a.low].low..a[a.low].high:
      result[k].add a[k][q] + b

proc addition*(a: float, b: matrix): matrix {.inline.} = addition(b, a)

proc `+`*(a: matrix, b: matrix): matrix {.inline.} = a.addition(b)

proc `+`*(a: matrix, b: float): matrix {.inline.} = a.addition(b)

proc `+`*(a: float, b: matrix): matrix {.inline.} = a.addition(b)

when isMainModule:
  echo "Testing matrix function: add"
  assert(m1 + m2 == @[@[3.0, 3.0, 5.0], @[4.0, 8.0, 4.0]])
  assert(m1 + k1 == m1)
  assert(m1 + k2 == @[@[3.0, 4.0, 5.0], @[6.0, 7.0, 8.0]])
  echo "  [OK]"

###########################################################
proc negate*(a: matrix): matrix {.inline.} =
  for k in a.low..a.high:
    result.add @[]
    for q in a[a.low].low..a[a.low].high:
      result[k].add(-a[k][q])

proc `-`*(a: matrix): matrix {.inline.} = a.negate

when isMainModule:
  echo "Testing matrix function: negate"
  assert(-m1 == @[@[-1.0, -2.0, -3.0], @[-4.0, -5.0, -6.0]])
  assert(-m2 == @[@[-2.0, -1.0, -2.0], @[-0.0, -3.0, 2.0]])
  echo "  [OK]"

###########################################################
proc rows*(a: matrix): int {.inline.} = a.len

proc cols*(a: matrix): int {.inline.} = a[a.low].len

proc shape*(a: matrix): TShape {.inline.} = (a.len, a[a.low].len)

proc is_square*(a: matrix): bool {.inline.} = a.len == a[a.low].len

when isMainModule:
  echo "Testing matrix function: rows, cols, shape"
  assert(m3.rows == 2)
  assert(m3.cols == 3)
  assert(m3.shape == (2, 3))
  assert(m4.rows == 3)
  assert(m4.cols == 4)
  assert(m4.shape == (3, 4))
  echo "  [OK]"

###########################################################

proc diag*(a: matrix): vector {.inline.} =
  result = zeros(a.rows)
  for i in 0..(a.rows - 1):
    result[i] = a[i][i]

when isMainModule:
  echo "Testing matrix function: diag"
  assert(diag(@[@[2.0, 3.0], @[3.0, 5.0]]) == @[2.0, 5.0])
  echo "  [OK]"

###########################################################
proc subtract*(a: matrix, b: matrix): matrix {.inline.} =
  assert(a.len == b.len)
  assert(a[a.low].len == b[b.low].len)
  for k in a.low..a.high:
    result.add @[]
    for q in a[a.low].low..a[a.low].high:
      result[k].add a[k][q] - b[k][q]

proc subtract*(a: matrix, b: float): matrix {.inline.} = addition(a, -b)

proc subtract*(a: float, b: matrix): matrix {.inline.} = addition(b, -a)

proc `-`*(a: matrix, b: matrix): matrix {.inline.} = a.subtract(b)

proc `-`*(a: matrix, b: float): matrix {.inline.} = a.subtract(b)

proc `-`*(a: float, b: matrix): matrix {.inline.} = a.subtract(b)

when isMainModule:
  echo "Testing matrix function: subtract"
  assert(m1 - m2 == @[@[-1.0, 1.0, 1.0], @[4.0, 2.0, 8.0]])
  assert(m2 - m1 == @[@[1.0, -1.0, -1.0], @[-4.0, -2.0, -8.0]])
  assert(m1 - k1 == m1)
  assert(m1 - k2 == @[@[-1.0, 0.0, 1.0], @[2.0, 3.0, 4.0]])
  assert((m1 + k2) - k2 == m1)
  assert((m2 + k2) - k2 == m2)
  echo "  [OK]"

###########################################################
proc wise_multiply*(a: matrix, b: matrix): matrix {.inline.} =
  assert(a.len == b.len)
  assert(a[a.low].len == b[b.low].len)
  for k in a.low..a.high:
    result.add @[]
    for q in a[a.low].low..a[a.low].high:
      result[k].add a[k][q] * b[k][q]

proc wise_multiply*(a: matrix, b: float): matrix {.inline.} = 
  for k in a.low..a.high:
    result.add @[]
    for q in a[a.low].low..a[a.low].high:
      result[k].add a[k][q] * b

proc wise_multiply*(a: float, b: matrix): matrix {.inline.} = wise_multiply(b, a)

proc `.*`*(a: matrix, b: matrix): matrix {.inline.} = a.wise_multiply(b)

proc `.*`*(a: matrix, b: float): matrix {.inline.} = a.wise_multiply(b)

proc `.*`*(a: float, b: matrix): matrix {.inline.} = a.wise_multiply(b)

proc multiply*(a: matrix, b: float): matrix {.inline.} = wise_multiply(a, b)

proc multiply*(a: float, b: matrix): matrix {.inline.} = wise_multiply(b, a)

proc `*`*(a: matrix, b: float): matrix {.inline.} = a.wise_multiply(b)

proc `*`*(a: float, b: matrix): matrix {.inline.} = a.wise_multiply(b)

when isMainModule:
  echo "Testing matrix function: wise_multiply"
  assert(m1 .* k1 == @[@[0.0, 0.0, 0.0], @[0.0, 0.0, 0.0]])
  assert(m1 * k1 == @[@[0.0, 0.0, 0.0], @[0.0, 0.0, 0.0]])
  assert(m1 .* m2 == @[@[2.0, 2.0, 6.0], @[0.0, 15.0, -12.0]])
  assert(m2 .* m1 == @[@[2.0, 2.0, 6.0], @[0.0, 15.0, -12.0]])
  echo "  [OK]"

###########################################################
proc standardMatrixProduct(a: matrix, b: matrix): matrix {.inline.} =
  assert(a[a.low].len == b.len)
  let n = a.len
  for i in a.low..a.high:
    result.add @[]
    for j in b[b.low].low..b[b.low].high:
      result[i].add 0.0
      #for k in a[a.low].low..a[a.low].high:
      for k in b.low..b.high:
        result[i][j] += a[i][k] * b[k][j]

proc multiply*(a: matrix, b: matrix): matrix {.inline.} = standardMatrixProduct(a, b)

proc `*`*(a: matrix, b: matrix): matrix {.inline.} = multiply(a, b)

when isMainModule:
  echo "Testing matrix function: multiply"
  assert(m3 * m4 == @[@[22.0, 22.0, 22.0, 22.0], @[67.0, 64.0, 61.0, 58.0]])
  assert(m3 * mid3 == m3)
  assert(m4 * mid4 == m4)
  assert(mid3 * m4 == m4)
  echo "  [OK]"

###########################################################
proc norm*(a: matrix, p: float = 2.0, q: float = -1.0): float {.inline.} =
  for i in a.low..a.high:
    var scol = 0.0
    for j in a[a.low].low..a[a.low].high:
      scol += pow(a[i][j], p)
    if q < 0:
      result += scol
    else:
      result += pow(scol, q / p)
  if q < 0:
    result = pow(result, 1.0 / p)
  else:
    result = pow(result, 1.0 / q)

when isMainModule:
  echo "Testing matrix function: norm"
  assert(abs(norm(@[@[0.0], @[1.0], @[0.0]]) - 1) < 0.1)
  assert(abs(norm(@[@[1.0], @[10.0], @[6.0]]) - 11.7047) < 0.1)
  assert(abs(norm(@[@[1.0], @[10.0], @[6.0]], 2, 2) - 11.7047) < 0.1)
  assert(abs(norm(@[@[1.0], @[10.0], @[6.0]], 3) - 10.6765) < 0.1)
  echo "  [OK]"

###########################################################
proc sum*(a: matrix, axis:int): vector {.inline.} =
  if axis == 0:
    for c in a[a.low].low..a[a.low].high:
      result.add 0
      for r in a.low..a.high:
        result[c] += a[r][c]
  else:
    for r in a.low..a.high:
      result.add 0
      for c in a[a.low].low..a[a.low].high:
        result[r] += a[r][c]

proc sum*(a: matrix): float {.inline.} =
  for r in a.low..a.high:
    for c in a[a.low].low..a[a.low].high:
      result += a[r][c]

when isMainModule:
  echo "Testing matrix function: sum"
  let m10 = @[
    @[7.0, 8.0, 9.0, 10.0, 11.0, 12.0], 
    @[14.0, 16.0, 18.0, 20.0, 22.0, 24.0], 
    @[21.0, 24.0, 27.0, 30.0, 33.0, 36.0], 
    @[28.0, 32.0, 36.0, 40.0, 44.0, 48.0]
  ]
  assert(sum(m10) == 570.0)
  assert(sum(m10, 0) == @[70.0, 80.0,  90.0, 100.0, 110.0, 120.0])
  assert(sum(m10, 1) == @[57.0, 114.0, 171.0, 228.0])
  echo "  [OK]"

###########################################################
proc pow*(a: matrix, b: matrix): matrix {.inline.} = 
  assert(a.len == b.len)
  assert(a[a.low].len == b[b.low].len)
  for k in a.low..a.high:
    result.add @[]
    for q in a[a.low].low..a[a.low].high:
      result[k].add pow(a[k][q], b[k][q])

proc pow*(a: matrix, b: float): matrix {.inline.} = 
  for k in a.low..a.high:
    result.add @[]
    for q in a[a.low].low..a[a.low].high:
      result[k].add pow(a[k][q], b)

proc pow*(a: float, b: matrix): matrix {.inline.} = pow(b, a)

proc `.^`*(a: matrix, b: matrix): matrix {.inline.} = a.pow(b)

proc `.^`*(a: matrix, b: float): matrix {.inline.} = a.pow(b)

proc `.^`*(a: float, b: matrix): matrix {.inline.} = a.pow(b)

when isMainModule:
  echo "Testing matrix function: pow"
  assert(m1 .^ 1 == m1)
  assert(m1 .^ 3 == @[@[1.0, 8.0, 27.0], @[64.0, 125.0, 216.0]])
  assert(m2 .^ 2 == @[@[4.0, 1.0, 4.0], @[0.0, 9.0, 4.0]])
  echo "  [OK]"

###########################################################
proc abs*(a: matrix): matrix =
  for k in a.low..a.high:
    result.add @[]
    for q in a[a.low].low..a[a.low].high:
      result[k].add abs(a[k][q])

when isMainModule:
  echo "Testing matrix function: abs"
  assert(@[@[1.0, 1.0], @[-1.0, 13.0]].abs == @[@[1.0, 1.0], @[1.0, 13.0]])
  assert(@[@[-12.0, 1.0], @[10.0, -1.0]].abs == @[@[12.0, 1.0], @[10.0, 1.0]])
  echo "  [OK]"

###########################################################
proc mean*(a: matrix, axis: int): vector {.inline.} =
  assert axis == 0 or axis == 1
  if axis == 0:
    return a.sum(axis=axis) / a.cols.toFloat
  return a.sum(axis=axis) / a.rows.toFloat
  
proc mean*(a: matrix): float {.inline.} =
  return a.sum() / (a.cols * a.rows).toFloat

proc wise_variance*(a: matrix, axis: int): vector {.inline.} =
  assert axis == 0 or axis == 1
  return (a .^ 2).mean(axis=axis) - a.mean(axis=axis) .^ 2

proc wise_variance*(a: matrix): float {.inline.} =
  return (a .^ 2).mean() - a.mean() ^ 2

proc wise_standard_deviation*(a: matrix, axis: int): vector {.inline.} =
  assert axis == 0 or axis == 1
  return a.wise_variance(axis) .^ 0.5

proc wise_standard_deviation*(a: matrix): float {.inline.} =
  return a.wise_variance ^ 0.5

# TO DO: ADD TEST

###########################################################
proc any_val*(a: matrix, true_val: float=1.0): bool =
  for k in a.low..a.high:
    for q in a[a.low].low..a[a.low].high:
      if a[k][q] == true_val: return true
  return false

proc all_val*(a: matrix, true_val: float=1.0): bool =
  for k in a.low..a.high:
    for q in a[a.low].low..a[a.low].high:
      if a[k][q] != true_val: return false
  return true

when isMainModule:
  echo "Testing matrix function: any_val/all_val"
  assert(@[1.0, 1.0, 1.0].all_val)
  assert(@[1.0, 1.0, 1.0].any_val)
  assert(not @[0.0, 1.0, 1.0].all_val)
  assert(not @[0.0, 0.0, 0.0].any_val)
  echo "  [OK]"

###########################################################
proc `<`*(a: matrix, b: matrix): matrix {.inline.} =
  assert(a.len == b.len)
  assert(a[a.low].len == b[b.low].len)
  for k in a.low..a.high:
    result.add @[]
    for q in a[a.low].low..a[a.low].high:
      result[k].add (if a[k][q] < b[k][q]: 1.0 else: 0.0)

proc `<`*(a: matrix, b: float): matrix {.inline.} =
  for k in a.low..a.high:
    result.add @[]
    for q in a[a.low].low..a[a.low].high:
      result[k].add (if a[k][q] < b: 1.0 else: 0.0)

proc `>`*(a: matrix, b: matrix): matrix {.inline.} =
  assert(a.len == b.len)
  assert(a[a.low].len == b[b.low].len)
  for k in a.low..a.high:
    result.add @[]
    for q in a[a.low].low..a[a.low].high:
      result[k].add (if a[k][q] > b[k][q]: 1.0 else: 0.0)

proc `>`*(a: matrix, b: float): matrix {.inline.} =
  for k in a.low..a.high:
    result.add @[]
    for q in a[a.low].low..a[a.low].high:
      result[k].add (if a[k][q] > b: 1.0 else: 0.0)

proc `<=`*(a: matrix, b: matrix): matrix {.inline.} =
  assert(a.len == b.len)
  assert(a[a.low].len == b[b.low].len)
  for k in a.low..a.high:
    result.add @[]
    for q in a[a.low].low..a[a.low].high:
      result[k].add (if a[k][q] <= b[k][q]: 1.0 else: 0.0)

proc `<=`*(a: matrix, b: float): matrix {.inline.} =
  for k in a.low..a.high:
    result.add @[]
    for q in a[a.low].low..a[a.low].high:
      result[k].add (if a[k][q] <= b: 1.0 else: 0.0)

proc `>=`*(a: matrix, b: matrix): matrix {.inline.} =
  assert(a.len == b.len)
  assert(a[a.low].len == b[b.low].len)
  for k in a.low..a.high:
    result.add @[]
    for q in a[a.low].low..a[a.low].high:
      result[k].add (if a[k][q] >= b[k][q]: 1.0 else: 0.0)

proc `>=`*(a: matrix, b: float): matrix {.inline.} =
  for k in a.low..a.high:
    result.add @[]
    for q in a[a.low].low..a[a.low].high:
      result[k].add (if a[k][q] >= b: 1.0 else: 0.0)

proc `===`*(a: matrix, b: matrix): matrix {.inline.} =
  assert(a.len == b.len)
  assert(a[a.low].len == b[b.low].len)
  for k in a.low..a.high:
    result.add @[]
    for q in a[a.low].low..a[a.low].high:
      result[k].add (if a[k][q] == b[k][q]: 1.0 else: 0.0)

proc `===`*(a: matrix, b: float): matrix {.inline.} =
  for k in a.low..a.high:
    result.add @[]
    for q in a[a.low].low..a[a.low].high:
      result[k].add (if a[k][q] == b: 1.0 else: 0.0)

when isMainModule:
  echo "Testing matrix function: < <= > >="
  assert(((@[@[-1.0, -2.0,  3.0], @[-4.0, 5.0, -6.0]] < -1.0) === @[@[0.0, 1.0, 0.0], @[1.0, 0.0, 1.0]]).all_val)
  assert(((@[@[-2.0,  1.0, -2.0], @[ 0.0, 3.0,  2.0]] < 1.0) === @[@[1.0, 0.0, 1.0], @[1.0, 0.0, 0.0]]).all_val)
  assert(((@[@[-1.0, -2.0,  3.0], @[-4.0, 5.0, -6.0]] <= -1.0) === @[@[1.0, 1.0, 0.0], @[1.0, 0.0, 1.0]]).all_val)
  assert(((@[@[-2.0,  1.0, -2.0], @[ 0.0, 3.0,  2.0]] <= 1.0) === @[@[1.0, 1.0, 1.0], @[1.0, 0.0, 0.0]]).all_val)
  assert(((@[@[-1.0, -2.0,  3.0], @[-4.0, 5.0, -6.0]] > -1.0) === @[@[0.0, 0.0, 1.0], @[0.0, 1.0, 0.0]]).all_val)
  assert(((@[@[-2.0,  1.0, -2.0], @[ 0.0, 3.0,  2.0]] > 1.0) === @[@[0.0, 0.0, 0.0], @[0.0, 1.0, 1.0]]).all_val)
  assert(((@[@[-1.0, -2.0,  3.0], @[-4.0, 5.0, -6.0]] >= -1.0) === @[@[1.0, 0.0, 1.0], @[0.0, 1.0, 0.0]]).all_val)
  assert(((@[@[-2.0,  1.0, -2.0], @[ 0.0, 3.0,  2.0]] >= 1.0) === @[@[0.0, 1.0, 0.0], @[0.0, 1.0, 1.0]]).all_val)
  assert(((@[@[-1.0, -2.0,  3.0], @[-4.0, 5.0, -6.0]] === -1.0) === @[@[1.0, 0.0, 0.0], @[0.0, 0.0, 0.0]]).all_val)
  assert(((@[@[-2.0,  1.0, -2.0], @[ 0.0, 3.0,  2.0]] === 1.0) === @[@[0.0, 1.0, 0.0], @[0.0, 0.0, 0.0]]).all_val)
  echo "  [OK]"

###########################################################
proc identity*(rows: int, cols: int = -1): matrix {.inline.} = 
  var cols0 = cols
  if cols < 0:
    cols0 = rows
  for i in 1..rows:
    result.add @[]
    for j in 1..cols0:
      if i == j:
        result[i - 1].add 1.0
      else:
        result[i - 1].add 0.0

proc eye*(row: int, col: int): matrix {.inline.} = identity(row, col)

when isMainModule:
  echo "Testing matrix function: eye/identity"
  assert(mid3 == identity(3))
  assert(mid4 == identity(4))

proc eye*(v: vector): matrix {.inline.} =
  let k = v.len
  for i in 1..k:
    result.add @[]
    for j in 1..k:
      if i == j:
        result[i - 1].add v[i - 1]
      else:
        result[i - 1].add 0.0

when isMainModule:
  echo "Testing matrix function: eye/identity"
  assert(eye(@[1.0, 1.0, 1.0, 1.0]) == identity(4))
  echo "  [OK]"

###########################################################
proc constant_matrix*(rows: int, cols: int, constant: float): matrix {.inline.} = 
  for i in 1..rows:
    result.add @[]
    for j in 1..cols:
      result[i - 1].add constant

proc zeros*(row: int, col: int): matrix {.inline.} = constant_matrix(row, col, 0.0)

proc ones*(row: int, col: int): matrix {.inline.} = constant_matrix(row, col, 1.0)

when isMainModule:
  echo "Testing matrix function: constant_matrix/ones/zeros"
  assert(zeros(2, 3) == @[
    @[0.0, 0.0, 0.0],
    @[0.0, 0.0, 0.0],
  ])
  assert(ones(2, 3) == @[
    @[1.0, 1.0, 1.0],
    @[1.0, 1.0, 1.0],
  ])
  assert(constant_matrix(2, 3, 101.0) == @[
    @[101.0, 101.0, 101.0],
    @[101.0, 101.0, 101.0],
  ])
  echo "  [OK]"

###########################################################
proc round*(a: matrix, decimals: int = 1): matrix {.inline.} = 
  let M = pow(10, decimals.toFloat)
  for k in a.low..a.high:
    result.add @[]
    for q in a[a.low].low..a[a.low].high:
      result[k].add round(a[k][q] * M) / M

when isMainModule:
  echo "Testing matrix function: round"
  assert(round(@[@[0.1234], @[1.4566], @[0.789]], 1) == @[@[0.1], @[1.5], @[0.8]])
  assert(round(@[@[0.1234], @[1.4566], @[0.789]], 2) == @[@[0.12], @[1.46], @[0.79]])
  echo "  [OK]"

###########################################################
proc transpose*(a: matrix): matrix {.inline.} = 
  for q in a[a.low].low..a[a.low].high:
    result.add @[]
    for k in a.low..a.high:
      result[q].add a[k][q]

proc T*(a: matrix): matrix {.inline.} = transpose(a)

when isMainModule:
  echo "Testing matrix function: transpose"
  assert(transpose(@[@[1.0, 2.0], @[3.0, 4.0], @[5.0, 6.0]]) == @[@[1.0, 3.0, 5.0], @[2.0, 4.0, 6.0]])
  echo "  [OK]"

###########################################################

proc hstack*(matrices: varargs[matrix]): matrix {.inline.} = 
  #result = @[]
  for k in 1 .. (matrices.len - 1):
    assert(matrices[k-1].rows == matrices[k].rows)
  for r in 0 .. (matrices[0].rows - 1):
    result.add @[]
    for a in matrices.items:
      for c in 0 .. (a.cols - 1):
        result[r].add a[r][c]

proc vstack*(matrices: varargs[matrix]): matrix {.inline.} = 
  #result = @[]
  for k in 1 .. (matrices.len - 1):
    assert(matrices[k-1].cols == matrices[k].cols)
  for a in matrices.items:
    for r in 0 .. (a.rows - 1):
      result.add @[]
      for c in 0 .. (a.cols - 1):
        result[result.high].add a[r][c]

proc hstack*(a: matrix, b: float): matrix {.inline.} = 
  #result = @[]
  for r in 0 .. (a.rows - 1):
    result.add @[]
    for c in 0 .. (a.cols - 1):
      result[r].add a[r][c]
    result[r].add b

proc vstack*(a: matrix, b: float): matrix {.inline.} = 
  #result = @[]
  for r in 0 .. (a.rows - 1):
    result.add @[]
    for c in 0 .. (a.cols - 1):
      result[result.high].add a[r][c]
  result.add @[]
  for c in 0 .. (a.cols - 1):
    result[result.high].add b

#[ 
type matrixOrValue = matrix|float
import typeinfo
proc hstack*(matrices: varargs[matrixOrValue]): matrix {.inline.} = 
  let rows = -1
  for k in 1 .. (matrices.len - 1):
    if kind(matrices[k - 1]) == akSequence:
      if rows < 0:
        rows = matrices[k - 1].rows
      else:
        assert(rows == matrices[k - 1].rows)
  for r in 0 .. (rows - 1):
    result.add @[]
    for a in matrices.items:
      if kind(a) == akSequence:
        for c in 0 .. (a.cols - 1):
          result[r].add a[r][c]
      else:
        result[r].add a

proc vstack*(matrices: varargs[matrixOrValue]): matrix {.inline.} = 
  let cols = -1
  for k in 1 .. (matrices.len - 1):
    if kind(matrices[k - 1]) == akSequence:
      if cols < 0:
        cols = matrices[k - 1].cols
      else:
        assert(cols == matrices[k - 1].cols)
  for a in matrices.items:
    if kind(a) == akSequence:
      for r in 0 .. (a.rows - 1):
        result.add @[]
        for c in 0 .. (cols - 1):
          result[result.high].add a[r][c]
    else:
      result.add @[]
      for c in 0 .. (cols - 1):
        result[result.high].add a ]#

proc concatenate*(matrices: varargs[matrix], axis: int=1): matrix {.inline.} = 
  assert(axis == 0 or axis == 1 or axis == -1)
  if axis == 0:
    return hstack(matrices)
  return vstack(matrices)

when isMainModule:
  echo "Testing matrix function: hstack/vstack/concatenate"
  assert(hstack(
    @[@[1.0, 2.0], @[3.0, 4.0], @[5.0, 6.0]],
    @[@[1.0, 2.0], @[3.0, 4.0], @[5.0, 6.0]]) == @[@[1.0, 2.0, 1.0, 2.0], @[3.0, 4.0, 3.0, 4.0], @[5.0, 6.0, 5.0, 6.0]])
  
  assert(vstack(
    @[@[1.0, 2.0], @[3.0, 4.0], @[5.0, 6.0]],
    @[@[1.0, 2.0], @[3.0, 4.0], @[5.0, 6.0]]) == @[@[1.0, 2.0], @[3.0, 4.0], @[5.0, 6.0], @[1.0, 2.0], @[3.0, 4.0], @[5.0, 6.0]])
  
  assert(concatenate(
    @[@[1.0, 2.0], @[3.0, 4.0], @[5.0, 6.0]],
    @[@[1.0, 2.0], @[3.0, 4.0], @[5.0, 6.0]], axis=0) == @[@[1.0, 2.0, 1.0, 2.0], @[3.0, 4.0, 3.0, 4.0], @[5.0, 6.0, 5.0, 6.0]])
  
  assert(concatenate(
    @[@[1.0, 2.0], @[3.0, 4.0], @[5.0, 6.0]],
    @[@[1.0, 2.0], @[3.0, 4.0], @[5.0, 6.0]], axis=1) == @[@[1.0, 2.0], @[3.0, 4.0], @[5.0, 6.0], @[1.0, 2.0], @[3.0, 4.0], @[5.0, 6.0]])
  
  assert(hstack(
    @[@[1.0, 2.0], @[3.0, 4.0], @[5.0, 6.0]], 1.0) == @[@[1.0, 2.0, 1.0], @[3.0, 4.0, 1.0], @[5.0, 6.0, 1.0]])
  
  assert(vstack(
    @[@[1.0, 2.0], @[3.0, 4.0], @[5.0, 6.0]], 1.0) == @[@[1.0, 2.0], @[3.0, 4.0], @[5.0, 6.0], @[1.0, 1.0]])
  
  echo "  [OK]"

###########################################################
proc ravel*(a: matrix): vector {.inline.} = 
  for r in 0 .. (a.rows - 1):
    for c in 0 .. (a.cols - 1):
      result.add a[r][c]

when isMainModule:
  echo "Testing matrix function: ravel"
  assert(@[@[0.11, 0.28, -1.03], @[-0.05, -0.01, 0.46], @[0.04, -0.24, 0.66]].ravel == @[0.11, 0.28, -1.03, -0.05, -0.01, 0.46, 0.04, -0.24, 0.66])
  echo "  [OK]"

###########################################################
#@deprecated
proc augmentation(a: matrix, b: matrix): matrix {.inline.} = 
  assert(a.rows == b.rows)
  for r in 0 .. (a.rows - 1):
    result.add @[]
    for c in 0 .. (a.cols - 1):
      result[r].add a[r][c]
    for c in 0 .. (b.cols - 1):
      result[r].add b[r][c]

proc gauss_jordan*(a: matrix, b: matrix): matrix {.inline.} = 
  var
    m = hstack(a, b)
    c = 0.0
    maxrow = 0
  # find max pivot
  for y in 0 .. (m.rows - 1):
    maxrow = y
    for y2 in (y + 1) .. (m.rows - 1):
      if abs(m[y2][y]) > abs(m[maxrow][y]):
        maxrow = y2
    swap(m[y], m[maxrow])
    for y2 in (y + 1) .. (m.rows - 1):
      c = m[y2][y] / m[y][y]
      for x in y .. (m.cols - 1):
        m[y2][x] -= m[y][x] * c
  # backsubstitute
  var
    y = m.rows - 1
    x0 = 0
  while y >= 0:
    c = m[y][y]
    for y2 in 0 .. (y - 1):
      x0 = m.cols - 1
      while x0 > y - 1:
        m[y2][x0] -= m[y][x0] * m[y2][y] / c
        x0 -= 1
    m[y][y] /= c
    for x in m.rows .. (m.cols - 1):
      m[y][x] /= c
    y -= 1
  return m;

proc inverse*(a: matrix): matrix {.inline.} = 
  let
    b = identity(a.rows, a.cols)
    c = gauss_jordan(a, b)
  #We need to copy the inverse portion to a new matrix to rid G-J artifacts
  for i in 0 .. (a.rows - 1):
    result.add @[]
    for j in a.cols .. (c.cols - 1):
      result[i].add c[i][j]

proc inv*(a: matrix): matrix {.inline.} = inverse(a)

when isMainModule:
  echo "Testing matrix function: inv"
  assert(inverse(mid3) == mid3)
  assert(round(inverse(m5), 2) == @[@[0.11, 0.28, -1.03], @[-0.05, -0.01, 0.46], @[0.04, -0.24, 0.66]])
  echo "  [OK]"

###########################################################
# calculate the determinant of a matrix
proc det*(a: matrix): float =
  let
    alen = a.rows
    alend = alen * 2
  var
    rowshift = alen - 1
    colshift = alend - 1
    mrow = rowshift - alen + 1
    mcol = colshift
    vals = ones(alend)
    i = 0
  # check for special 2x2 case
  if alen == 2:
    return a[0][0] * a[1][1] - a[0][1] * a[1][0]
  for i in 0..(alen-1):
    for j in 0..(alen-1):
      vals[(if mrow < 0: mrow + alen else: mrow)] *= a[i][j]
      vals[(if mcol < alen: mcol + alen else: mcol)] *= a[i][j]
      mrow.inc
      mcol.dec
    rowshift.dec
    colshift.dec
    mrow = rowshift - alen + 1
    mcol = colshift
  for i in 0..(alen-1):
    result += vals[i]
  for i in alen..(alend-1):
    result -= vals[i]
  return result
  
when isMainModule:
  echo "Testing matrix function: det"
  assert(det(identity(2)) == 1.0)
  assert(det(identity(4)) == 1.0)
  assert(det(@[@[1.0, 4.0, 9.0], @[7.0, 2.0, 5.0], @[6.0, 8.0, 3.0]]) == 398.0)
  echo "  [OK]"


###########################################################
proc lu_decomposition*(a: matrix): tuple[L: matrix, R: matrix] {.inline.} = 
  var
    L = identity(a.rows)
    R = zeros(a.rows, a.cols)
    parts: seq[float] = @[]
  for t in 0 .. (a.rows - 1):
    R[0][t] = a[0][t]
  for l in 0 .. (a.rows - 1):
    for i in 0 .. (l - 1):
      parts = @[]
      for jj in 0 .. (i - 1):
        parts.add L[l][jj] * R[jj][i]
      L[l][i] = (a[l][i] - sum(parts)) / R[i][i]
    for j in l .. (a.rows - 1):
      parts = @[]
      for jj in 0 .. (l - 1):
        parts.add L[l][jj] * R[jj][j]
      #BUG: 
      #  R[l][j] = a[l][j] - sum(parts), or
      #  R[l][j] = a[i][j] - sum(parts)
      #?
      R[l][j] = a[l][j] - sum(parts)
  return (L, R)

when isMainModule:
  echo "Testing matrix function: transpose"
  assert(transpose(@[@[1.0, 2.0], @[3.0, 4.0], @[5.0, 6.0]]) == @[@[1.0, 3.0, 5.0], @[2.0, 4.0, 6.0]])
  echo "  [OK]"



