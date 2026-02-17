#!/bin/bash
set -e

cd "$(dirname "$0")"

# Build widget if necessary
cd widget

if [ ! -d "node_modules" ] || [ "package-lock.json" -nt "node_modules" ]; then
  echo "Installing widget dependencies..."
  npm ci
fi

if [ ! -d "dist" ] || [ -n "$(find src -newer dist -print -quit 2>/dev/null)" ]; then
  echo "Building widget..."
  npm run build
fi

cd ..

# Build all books
./build.sh

# Serve docs directory
BOOK="${1:-startos}"
echo "Serving from docs/ at http://localhost:3000"
echo "  Landing:     http://localhost:3000/"
echo "  StartOS:     http://localhost:3000/startos/"
echo "  StartTunnel: http://localhost:3000/start-tunnel/"
echo ""
echo "To live-reload a single book while editing, run in another terminal:"
echo "  cd $BOOK && mdbook serve -p 3001"
echo ""
python3 -m http.server 3000 -d docs
