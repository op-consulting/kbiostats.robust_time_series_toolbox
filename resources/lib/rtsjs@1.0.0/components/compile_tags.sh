#!/bin/bash
destfile=components.js
for file in *.html
do
  echo riot $file ${file%.*}.js
  cp $file ${file%.*}.tag
  riot ${file%.*}.tag ${file%.*}.js
  rm ${file%.*}.tag
  echo "require('./${file%.*}.js');" >> $destfile
done

