#!/bin/zsh
cd "$(dirname "$0")" || exit
echo "Updating repo..."
git fetch origin || {
  echo "Install git!"
  exit
}
git reset --hard origin/main || {
  echo "whgarrr?"
  exit
}
echo "Building dotOS…"
pip install -r requirements.txt || {
  echo "Install python!"
  exit
}
python3 build.py || {
  echo "Wtf you installed pip but not python?"
  exit
}
