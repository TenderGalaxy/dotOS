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
pip install -r requirements.txt || {
  echo "Install python!"
  exit
}
python3 build.py || {
  echo "Wtf you installed pip but not python?"
  exit
}
