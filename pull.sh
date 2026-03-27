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
