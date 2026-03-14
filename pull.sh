#!/bin/zsh
cd "$(dirname "$0")" || exit
echo "Updating repo..."
git pull origin main
echo "Building dotOS…"
python3 build.py
