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

# Redirect stubs: /book/ → /book/version/
for pair in "start-os:$START_OS_VERSION" "start-tunnel:$START_TUNNEL_VERSION" "packaging:$PACKAGING_VERSION"; do
  book="${pair%%:*}"
  version="${pair##*:}"
  cat > "docs/$book/index.html" <<EOF
<!doctype html><meta http-equiv="refresh" content="0; url=/$book/$version/">
EOF
done

# Landing page
cp landing/index.html docs/index.html

echo "Build complete: docs/"
