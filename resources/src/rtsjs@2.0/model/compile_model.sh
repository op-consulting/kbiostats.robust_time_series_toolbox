#!/bin/bash
#nim js -d:nodejs -d:release -r --stackTrace:off --lineTrace:off --threads:off --checks:off --objChecks:off --fieldChecks:off --rangeChecks:off --boundChecks:off --overflowChecks:off --assertions:off --floatChecks:off --nanChecks:off --infChecks:off --nilChecks:off --opt:size --out:rts-model.js model_optimized.nim
outfile=rts-model-unoptimized.js
coutfile=rts-model.js
nim js -d:nodejs -d:release -d:in_production --stackTrace:off --lineTrace:off --threads:off --checks:off --objChecks:off --fieldChecks:off --rangeChecks:off --boundChecks:off --overflowChecks:off --assertions:off --floatChecks:off --nanChecks:off --infChecks:off --nilChecks:off --opt:size --out:$outfile model_optimized.nim
echo "var LENGTH_VECTOR = 1012;" > $coutfile
cat $outfile | sed "s/1012/LENGTH_VECTOR/g" >> $coutfile
echo "exports.robust_interrupted_time_series = (X, Y, change_point, candidates_before, candidates_after) => {LENGTH_VECTOR = X.length; return robust_interrupted_time_series(X, Y, change_point, candidates_before, candidates_after)}; " >> $coutfile
echo "exports.robust_interrupted_time_series_approximated = (sampling, X, Y, change_point, candidates_before, candidates_after) => {LENGTH_VECTOR = X.length; return robust_interrupted_time_series_approximated(sampling, X, Y, change_point, candidates_before, candidates_after)}; " >> $coutfile
echo "exports.fix_vector = (X) => {LENGTH_VECTOR = X.length; return fix_vector(X)}" >> $coutfile

#  --stackTrace:off --lineTrace:off --threads:off --checks:off --objChecks:off --fieldChecks:off --rangeChecks:off --boundChecks:off --overflowChecks:off --assertions:off --floatChecks:off --nanChecks:off --infChecks:off --nilChecks:off --opt:speed