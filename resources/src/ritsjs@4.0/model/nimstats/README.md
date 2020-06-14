# NIMSTATS: Statistics for Nim

NimStats is a statistical and linear algebra library written in pure Nim (and compatible with C and Javascript backends). 
It incorporates advanced statistical operations without requiring external or dedicated software like R.
It can be embedded directly in any pure Nim application due to its foundations on the standard library.

NimStats allows a similar syntax like Matlab (.*, .+, ./, .^) for matricial operations with the full expressiveness of Nim.

Because this library was aimed to be as much cross-platform as it could be, it is not fully optimized and it is highly not recommended for critical math operations. However with mid-size datasets, it could offer a performance at C-level due to Nim backends.

Part of this code is based on the jStats project [Github](http://github.com/jstat/jstat). 