#!/bin/bash
set -e

# Clean output
rm -rf docs
mkdir -p docs

# Build books
(cd start-os && mdbook build)
(cd start-tunnel && mdbook build)
(cd packaging && mdbook build)

# Landing page
cp landing/index.html docs/index.html

echo "Build complete: docs/"
