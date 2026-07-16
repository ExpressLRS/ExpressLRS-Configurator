#!/usr/bin/env bash
# download-portable-python.sh — Fetch and prepare a standalone Python distribution for macOS arm64.
#
# Usage:
#   cd dependencies/darwin_arm64 && ./download-portable-python.sh
#
# Output: Creates ./portable-python-<VERSION>/ with Python + required pip packages.
# This directory is symlinked by build-mac.sh into mac-deps/portable-python and
# bundled into the .app via electron-builder extraFiles.

set -euo pipefail  # Exit on error, undefined vars, and pipeline failures
cd "$(dirname "$0")"

# ── Configuration ─────────────────────────────────────────────────────────
# Python version and download URL. The URL follows the astral-sh python-build-standalone
# convention: cpython-<VERSION>+<DATE>-<TRIPLE>-install_only.tar.gz
# Triple: aarch64-apple-darwin = ARM64 macOS

NAME="portable-python"
VERSION="3.14.6"
PYTHON_URL="https://github.com/astral-sh/python-build-standalone/releases/download/20260610/cpython-3.14.6+20260610-aarch64-apple-darwin-install_only.tar.gz"

# ── Output directory ─────────────────────────────────────────────────────
PORTABLE="$(pwd -P 2>/dev/null)/${NAME}-${VERSION}"

# ── Safety check ────────────────────────────────────────────────────────
# Refuse to overwrite an existing non-empty directory. If you need to rebuild,
# delete the directory manually first.

if [ -d "$PORTABLE" ]; then
    if [ -n "$(ls -A "${PORTABLE}" 2>/dev/null)" ]; then
        echo "Error: ${PORTABLE} already exists and is not empty." >&2
        exit 1
    fi
fi

# ── Download and extract ───────────────────────────────────────────────
curl -Lo python.tar.gz ${PYTHON_URL}
tar xzf python.tar.gz
mv python ${NAME}-${VERSION}
rm python.tar.gz

# ── Post-install fixups ───────────────────────────────────────────────
# Upgrade pip, then install pyserial (needed for serial port flashing) and
# setuptools (needed by some build tools). These are bundled into the .app.

cd ${PORTABLE}/bin
./python -m pip install --upgrade pip
./pip install pyserial
./pip install setuptools
