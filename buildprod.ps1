echo "delete zip file..."
$FileName = ".\dist\dist.zip"
if (Test-Path $FileName) {
   Remove-Item $FileName -verbose
}

echo "building production..."
vue-cli-service build

echo "copying assets..."
Copy-Item -Path ./src/assets/.platform -Destination ./dist -Recurse
Copy-Item -Path ./src/assets/package.json -Destination ./dist -Recurse

echo "creating zip file..."
cd dist
7z a -r dist.zip *.*
cd ..

echo "deploying..."
eb deploy Vue8-env

echo "done"