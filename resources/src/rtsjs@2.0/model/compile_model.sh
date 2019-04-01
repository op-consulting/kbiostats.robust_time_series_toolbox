#!/bin/bash
#nim js -d:nodejs -d:release -r --stackTrace:off --lineTrace:off --threads:off --checks:off --objChecks:off --fieldChecks:off --rangeChecks:off --boundChecks:off --overflowChecks:off --assertions:off --floatChecks:off --nanChecks:off --infChecks:off --nilChecks:off --opt:size --out:rts-model.js model_optimized.nim
outfile=rts-model.js
nim js -d:nodejs -d:release -d:in_production --stackTrace:off --lineTrace:off --threads:off --checks:off --objChecks:off --fieldChecks:off --rangeChecks:off --boundChecks:off --overflowChecks:off --assertions:off --floatChecks:off --nanChecks:off --infChecks:off --nilChecks:off --opt:size --out:$outfile model_optimized.nim
echo "exports.robust_interrupted_time_series = robust_interrupted_time_series" >> $outfile
echo "exports.robust_interrupted_time_series_approximated = robust_interrupted_time_series_approximated" >> $outfile
echo "exports.fix_vector = fix_vector" >> $outfile


#  --stackTrace:off --lineTrace:off --threads:off --checks:off --objChecks:off --fieldChecks:off --rangeChecks:off --boundChecks:off --overflowChecks:off --assertions:off --floatChecks:off --nanChecks:off --infChecks:off --nilChecks:off --opt:speed