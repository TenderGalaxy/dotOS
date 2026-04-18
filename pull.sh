#!/bin/zsh
cd "$(dirname "$0")" || exit

# Update the Repo
if [ "$1" = "-u" ]; then
  echo "Updating repo..."
  git reset --hard origin/main || {
    echo "Install git!"
    exit
  }
fi

# Build src
echo "Building dotOS..."
node build.cjs || {
  echo "Ooopsie Daisie!"
  exit
}

# Compress and add comments
world="build/worldcode_compressed.cjs"
code="build/codeblock_compressed.cjs"
terser build/worldcode.cjs --compress --mangle --output "$world" --comments "/\*/"  || {
  npm install terser -g
  terser build/worldcode.cjs --compress --mangle --output "$world" --comments "/\*/" 
}
terser build/codeblock.cjs --compress --mangle --output "$code" --comments "/\*/" 

wlen=$(wc -c < "$world")
clen=$(wc -c < "$code")
echo "\n// Notice for code length: This code is $wlen chars long, excluding this notice." >> "$world"
echo "\n// Notice for code length: This code is $clen chars long, excluding this notice." >> "$code"
echo "Compressed files!"

# Open .html file
if [ "$1" = "-h" ]; then
  echo "Displaying..."
  open out/index.html
fi

# Run tests
if [ "$1" = "-e" ]; then
  echo "Running..."
  node tests/main.cjs
fi