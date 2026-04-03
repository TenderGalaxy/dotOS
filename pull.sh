#!/bin/zsh
cd "$(dirname "$0")" || exit
if [ "$1" = "-u" ]; then
  echo "Updating repo..."
  git reset --hard origin/main || {
    echo "Install git!"
    exit
  }
fi
echo "Building dotOS..."
node build.cjs || {
  echo "Ooopsie Daisie!"
  exit
}

world="build/worldcode_compressed.cjs"
code="build/codeblock_compressed.cjs"
terser build/worldcode.cjs --compress --mangle --output "$world" --comments "/Notice/" || {
  npm install terser -g
  terser build/worldcode.cjs --compress --mangle --output "$world" --comments "/Notice/" 
}
terser build/codeblock.cjs --compress --mangle --output "$code" --comments "/Notice/" 

wlen=$(wc -c < "$world")
clen=$(wc -c < "$code")
echo "// Notice for code length: This code is $wlen chars long, excluding this notice." >> "$world"
echo "// Notice for code length: This code is $clen chars long, excluding this notice." >> "$code"