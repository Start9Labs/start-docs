#!/bin/bash
set -e

# Clean output
rm -rf docs
mkdir -p docs

# Build each book listed in versions.conf
while IFS='=' read -r book version; do
  [[ -z "$book" || "$book" =~ ^# ]] && continue

  (cd "$book" && MDBOOK_OUTPUT__HTML__SITE_URL="/$book/$version/" \
    mdbook build -d "../docs/$book/$version")

  # Redirect stub: /book/ → /book/version/
  cat > "docs/$book/index.html" <<EOF
<!doctype html><meta http-equiv="refresh" content="0; url=/$book/$version/">
EOF
done < versions.conf

# Landing page
cp landing/index.html docs/index.html

echo "Build complete: docs/"
