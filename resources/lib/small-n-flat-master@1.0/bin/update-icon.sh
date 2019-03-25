#!/bin/bash

name=$1
inkscape=/c/Program\ Files/Inkscape/inkscape.exe


echo $name
rm ../compacted/24_$name.png
"$inkscape" -f ../source/$name.svg -e ../compacted/24_${name}.png -d 90

rm ../compacted/48_$name.png
"$inkscape" -f ../source/$name.svg -e ../compacted/48_${name}.png -d 180

rm ../compacted/72_$name.png
"$inkscape" -f ../source/$name.svg -e ../compacted/72_${name}.png -d 270

rm ../compacted/96_$name.png
"$inkscape" -f ../source/$name.svg -e ../compacted/96_${name}.png -d 360


cssfile=../compacted/sf-icons.css
if grep -q "sf-icon--$name" "$cssfile";
then
  echo '::Icon already in CSS file'
else
  echo '::Creating icon style'
  echo -e ".sf-icon--$name.sf-icon--icon24{\n     background-image: url(./24_$name.png);\n}\n" >> $cssfile;
  echo -e ".sf-icon--$name.sf-icon--icon48{\n     background-image: url(./48_$name.png);\n}\n" >> $cssfile;
  echo -e ".sf-icon--$name.sf-icon--icon72{\n     background-image: url(./72_$name.png);\n}\n" >> $cssfile;
  echo -e ".sf-icon--$name.sf-icon--icon96{\n     background-image: url(./96_$name.png);\n}\n" >> $cssfile;
fi