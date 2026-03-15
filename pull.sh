#!/bin/zsh
cd "$(dirname "$0")" || exit
echo "Updating repo..."
git reset --hard origin/main
echo "Building dotOS…"
pip install -r requirements.txt
python3 build.py
