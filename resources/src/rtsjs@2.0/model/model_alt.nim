import math
import stats
import strformat
import snail


###########################################################
# INTERFACES
const DArrayExp = [5, 8, 12, 15, 18, 21]
const DArrayCumExp = [5, 13, 25, 40, 58, 79]
const DArrayLength = [32, 256, 4096, 32768, 262144, 2097152]
const DArrayCumLength = [32, 288, 4384, 37152, 299296, 2396448]
type
  DArrayPosition* = tuple[bank: int, index: int]
  DArray* = object
    max_length: int
    length: int
    data: tuple[
      data5:  ref array[1 shl DArrayExp[0], float],
      data8:  ref array[1 shl DArrayExp[1], float],
      data12: ref array[1 shl DArrayExp[2], float],
      data15: ref array[1 shl DArrayExp[3], float],
      data18: ref array[1 shl DArrayExp[4], float],
      data21: ref array[1 shl DArrayExp[5], float]
    ]
  
  RowVector* = object
    ## A row vector 
    ## 
    ## Example:
    ## [1.0, 2.0, 3.0]
    data*: DArray
  
  ColVector* = object
    ## A row vector 
    ## 
    ## Example:
    ## [1.0, 2.0, 3.0]
    data*: DArray
  
  Vector* = RowVector | ColVector
  Array* = openArray[float] | DArray
  
###########################################################
# DYNAMIC ACCESS
proc len*(v: DArray): int {.inline.} = v.length
import sugar
proc operation_in_bank[T](v: DArray, b: int, op: (openArray[float]) -> T): T {.inline.} =
  if b == 0:
    op(v.data.data5[])
  elif b == 1:
    op(v.data.data8[])
  elif b == 2:
    op(v.data.data12[])
  elif b == 3:
    op(v.data.data15[])
  elif b == 4:
    op(v.data.data18[])
  else:
    op(v.data.data21[])
  
proc operation_in_bank(v: var DArray, b: int, op: proc(x: var openArray[float])) {.inline.} =
  if b == 0:
    op(v.data.data5[])
  elif b == 1:
    op(v.data.data8[])
  elif b == 2:
    op(v.data.data12[])
  elif b == 3:
    op(v.data.data15[])
  elif b == 4:
    op(v.data.data18[])
  else:
    op(v.data.data21[])

proc new_bank(v: var DArray, b: int) {.inline.} =
  if b == 0:
    new v.data.data5
  elif b == 1:
    new v.data.data8
  elif b == 2:
    new v.data.data12
  elif b == 3:
    new v.data.data15
  elif b == 4:
    new v.data.data18
  else:
    new v.data.data21

proc localizePosition(v: DArray, i: int): DArrayPosition {.inline.} =
  for b in DArrayCumLength.low..DArrayCumLength.high:
    if i < DArrayCumLength[b]:
      result[0] = b
      if b > 0:
        result[1] = b - DArrayCumLength[b - 1]
      else:
        result[1] = b
      break
proc localizePosition(v: var DArray, i: int, initialize: bool = false): DArrayPosition {.inline.} =
  for b in DArrayCumLength.low..DArrayCumLength.high:
    if i < DArrayCumLength[b]:
      if initialize and v.max_length < DArrayCumLength[b]:
        new_bank(v, b)
      result[0] = b
      if b > 0:
        result[1] = b - DArrayCumLength[b - 1]
      else:
        result[1] = b
      break

proc `[]`*(v: DArray, i: int): float {.inline.} =
  assert(i >= 0, "Negative index")
  assert(i < v.len, "Index out of bounds")
  var pos = localizePosition(v, i)
  operation_in_bank(v, pos.bank, (bank) => bank[pos.index])

proc `[]=`*(v: var DArray, i: int, val: float) {.inline.} =
  assert(i >= 0, "Negative index")
  assert(i < DArrayCumLength[DArrayCumLength.high], "Index imposible to reach")
  var pos = localizePosition(v, i, initialize=true)
  #v.data[pos.bank][pos.index] = val
  
  #operation_in_bank(v, pos.bank, (bank) => bank[pos.index] = val)
  operation_in_bank(v, pos.bank, proc (bank: var openArray[float]) = `[]=`(bank, pos.index, val))


###########################################################
# VECTOR OPERATIONS
proc `+`(v: openArray[float], s: float): seq[float] {.inline.}=
  for i in v.low .. v.high:
    #result[i] # v[i] + s
    result.add v[i] + s

#proc `+`(v: Array, s: int): Array {.inline.} = v + s.float
proc `$`(v: Vector): string = "-"

#proc sa1(v: openArray[float]) {.exportc.} =
#  echo $v

var x = [1.0, 2, 4]
echo $x
var y = (x + 4.0)
echo $y
echo 1 shl 2
echo 1 shl 5
echo 1 shl 8
echo 1 shl 12
echo 1 shl 15
echo 1 shl 18
echo 1 shl 21
