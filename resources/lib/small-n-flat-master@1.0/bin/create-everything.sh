#!/bin/bash

SVGFILES=../source/*.svg

rm -r ../compacted/
mkdir ../compacted

#for f in $SVGFILES
#do
#    scour -i $f -o ../compacted/$(basename "$f") \
#	--create-groups \
#	--enable-id-stripping \
#	--enable-comment-stripping \
#	--shorten-ids \
#	--disable-embed-rasters \
#	--remove-metadata
#done

CSSFILE=../compacted/sf-icons.css
inkscape=/c/Program\ Files/Inkscape/inkscape.exe

echo -e "/**SF ICON SET**/" > $CSSFILE
echo -e ".sf-icon--icon24 {\n    background-size: 100% 100%;\n    width: 24px;\n    height: 24px;\n}\n" >> $CSSFILE
echo -e ".sf-icon--icon48 {\n    background-size: 100% 100%;\n    width: 48px;\n    height: 48px;\n}\n" >> $CSSFILE
echo -e ".sf-icon--icon72 {\n    background-size: 100% 100%;\n    width: 72px;\n    height: 72px;\n}\n" >> $CSSFILE
echo -e ".sf-icon--icon96 {\n    background-size: 100% 100%;\n    width: 96px;\n    height: 96px;\n}\n" >> $CSSFILE

for f in $SVGFILES
do
    name=$(basename "$f")
    echo $name
    "$inkscape" -f $f -e ../compacted/24_${name/.svg/.png} -d 90
    echo -e ".sf-icon--${name/.svg/.png}.sf-icon--icon24{\n     background-image: url(./24_${name/.svg/.png});\n}\n" >> $CSSFILE
    "$inkscape" -f $f -e ../compacted/48_${name/.svg/.png} -d 180
    echo -e ".sf-icon--${name/.svg/.png}.sf-icon--icon48{\n     background-image: url(./48_${name/.svg/.png});\n}\n" >> $CSSFILE
    "$inkscape" -f $f -e ../compacted/72_${name/.svg/.png} -d 270
    echo -e ".sf-icon--${name/.svg/.png}.sf-icon--icon72{\n     background-image: url(./72_${name/.svg/.png});\n}\n" >> $CSSFILE
    "$inkscape" -f $f -e ../compacted/96_${name/.svg/.png} -d 360
    echo -e ".sf-icon--${name/.svg/.png}.sf-icon--icon96{\n     background-image: url(./96_${name/.svg/.png});\n}\n" >> $CSSFILE
done
