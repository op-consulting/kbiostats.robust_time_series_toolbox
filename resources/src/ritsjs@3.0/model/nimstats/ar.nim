import math
import stats
import sequtils
import strformat
import sugar
import core
import distributions
import ols

when isMainModule:
  echo "[Initializing]"
  #set.seed(0); x=arima.sim(n=20, list(ar=c(0.5)), sd=0.2)
  let data1 = @[
     0.368737952,  0.024567126, -0.217247839, -0.166516234, -0.143101141,
    -0.153852737, -0.026481679, -0.191625065, -0.008675873, -0.251845621,
    -0.170776387, -0.009909064,  0.021712740,  0.171694272,  0.074425781,
     0.137934485,  0.286121115,  0.004869790, -0.254484976, -0.117897254
  ]

###########################################################
# AR(1) estimator using OLS
###########################################################

proc AR1*(y: vector, include_mean: bool=true, feature_name: string="x1"): OLSModel =
  let
    y_0_to_T_1 = y[0..(y.high - 1)]
    y_1_to_T = y[1..(y.high)]
  if include_mean:
    result = ols_model(data_transform(y_0_to_T_1.as_column_vector, (x) => hstack(x, 1)), y_1_to_T, @[feature_name])
  else:
    result = ols_model(y_0_to_T_1.as_column_vector, y_1_to_T, @[feature_name])

proc simulateAR1*(len: int, autocorrelation: float=0.1, noise_variance: float=0.1): vector =
  let noise_distribution = normal(mean=0, std=noise_variance.sqrt)
  result.add noise_distribution.sample
  for t in 1..(len-1):
    result.add result[t-1] * autocorrelation + noise_distribution.sample

when isMainModule:
  echo "Testing AR1"
  #y_0_to_T_1=c(0.368737952, 0.024567126, -0.217247839, -0.166516234, -0.143101141, -0.153852737, -0.026481679, -0.191625065, -0.008675873, -0.251845621, -0.170776387, -0.009909064, 0.021712740, 0.171694272, 0.074425781, 0.137934485, 0.286121115, 0.004869790, -0.254484976); y_1_to_T=c(0.024567126, -0.217247839, -0.166516234, -0.143101141, -0.153852737, -0.026481679, -0.191625065, -0.008675873, -0.251845621, -0.170776387, -0.009909064, 0.021712740, 0.171694272, 0.074425781, 0.137934485, 0.286121115, 0.004869790, -0.254484976, -0.117897254);
  #lm(y_1_to_T~y_0_to_T_1)
  #ar.ols(x, order.max=1, demean=F, aic=F, intercept=F)
  if true:
    let ols_model = AR1(data1, include_mean=false)
    assert (ols_model.beta_hat[0] - 0.4082).abs < 1e-3
  if true:
    let ols_model = AR1(data1, include_mean=true)
    assert ((ols_model.beta_hat - @[0.3719, -0.04229]) < 1e-3).all_val
  
  echo "[OK]"