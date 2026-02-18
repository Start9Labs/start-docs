#!/bin/bash
set -e

source versions.conf

# Clean output
rm -rf docs
mkdir -p docs

# Build books with versioned paths
(cd start-os && MDBOOK_OUTPUT__HTML__SITE_URL="/start-os/$START_OS_VERSION/" \
  mdbook build -d "../docs/start-os/$START_OS_VERSION")

(cd start-tunnel && MDBOOK_OUTPUT__HTML__SITE_URL="/start-tunnel/$START_TUNNEL_VERSION/" \
  mdbook build -d "../docs/start-tunnel/$START_TUNNEL_VERSION")

(cd packaging && MDBOOK_OUTPUT__HTML__SITE_URL="/packaging/$PACKAGING_VERSION/" \
  mdbook build -d "../docs/packaging/$PACKAGING_VERSION")

# Landing page
cp landing/index.html docs/index.html

echo "Build complete: docs/"
