#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SRC_DIR="$ROOT_DIR/docs"
BUILD_DIR="$ROOT_DIR/build"
DIST_DIR="$ROOT_DIR/dist"

mkdir -p "$BUILD_DIR" "$DIST_DIR"
rsync -a --delete "$SRC_DIR/" "$BUILD_DIR/"
rsync -a --delete "$SRC_DIR/" "$DIST_DIR/"

echo "Build complete:"
echo " - $BUILD_DIR"
echo " - $DIST_DIR"
