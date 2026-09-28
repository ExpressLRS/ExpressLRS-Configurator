#!/usr/bin/env bash
#
# Downloads the portable Python and portable git bundled with the macOS build
# into dependencies/darwin_<arch>/. Both directories are git-ignored, they are
# fetched on demand (CI does this right before packaging).
#
# Usage:
#   ./dependencies/download-mac-dependencies.sh [x64|arm64]
#
# Without an argument the architecture of the current machine is used.
#
# Python comes from the astral-sh/python-build-standalone project
# (relocatable CPython builds), git comes from desktop/dugite-native
# (the relocatable git distribution used by GitHub Desktop). Set
# DOWNLOAD_CACHE_DIR to a directory with previously downloaded archives to
# skip the network fetch; checksums are verified either way.

set -euo pipefail
cd "$(dirname "$0")"

PYTHON_VERSION="3.14.6"
PYTHON_BUILD_TAG="20260610"
PYTHON_SHA256_X64="43f9833eabca62f2c9d8d3a3fb35835d6116386d871cb842c1ec2f08a8d27bd7"
PYTHON_SHA256_ARM64="953db72ff2dea68b5112231b1ba77163ec9114f87c7ece530b3ea742a3b492c5"

# pure Python wheels installed into the bundled interpreter, pinned like the
# archives above so the same commit always produces the same bundle
PYSERIAL_VERSION="3.5"
PYSERIAL_WHEEL_SHA256="c4451db6ba391ca6ca299fb3ec7bae67a5c55dde170964c7a14ceefec02f2cf0"
SETUPTOOLS_VERSION="83.0.0"
SETUPTOOLS_WHEEL_SHA256="29b23c360f22f414dc7336bb39178cc7bcbf6021ed2733cde173f09dba19abb3"

GIT_VERSION="2.53.0"
GIT_RELEASE_TAG="v2.53.0-3"
GIT_RELEASE_SUFFIX="f49d009"
GIT_SHA256_X64="caf27c36b8834969550535bcd5e58186f970e080d1e175e76d9c1de3aac409ed"
GIT_SHA256_ARM64="e561cfc80c755e6f3e938653e81efcd025c9827a5b76dd42778b1159b3fab437"

ARCH="${1:-}"
if [ -z "$ARCH" ]; then
  case "$(uname -m)" in
    arm64 | aarch64) ARCH="arm64" ;;
    x86_64) ARCH="x64" ;;
    *)
      echo "Error: could not detect architecture, pass x64 or arm64 explicitly" >&2
      exit 1
      ;;
  esac
fi

case "$ARCH" in
  x64)
    PYTHON_TRIPLE="x86_64-apple-darwin"
    PYTHON_SHA256="$PYTHON_SHA256_X64"
    GIT_SHA256="$GIT_SHA256_X64"
    ;;
  arm64)
    PYTHON_TRIPLE="aarch64-apple-darwin"
    PYTHON_SHA256="$PYTHON_SHA256_ARM64"
    GIT_SHA256="$GIT_SHA256_ARM64"
    ;;
  *)
    echo "Error: unsupported architecture '$ARCH', expected x64 or arm64" >&2
    exit 1
    ;;
esac

PYTHON_ARCHIVE="cpython-${PYTHON_VERSION}+${PYTHON_BUILD_TAG}-${PYTHON_TRIPLE}-install_only.tar.gz"
PYTHON_URL="https://github.com/astral-sh/python-build-standalone/releases/download/${PYTHON_BUILD_TAG}/${PYTHON_ARCHIVE}"
GIT_ARCHIVE="dugite-native-v${GIT_VERSION}-${GIT_RELEASE_SUFFIX}-macOS-${ARCH}.tar.gz"
GIT_URL="https://github.com/desktop/dugite-native/releases/download/${GIT_RELEASE_TAG}/${GIT_ARCHIVE}"

DEST_DIR="darwin_${ARCH}"
PYTHON_DEST="${DEST_DIR}/python-portable"
GIT_DEST="${DEST_DIR}/git-portable"

sha256() {
  if command -v sha256sum > /dev/null 2>&1; then
    sha256sum "$1" | awk '{print $1}'
  else
    shasum -a 256 "$1" | awk '{print $1}'
  fi
}

fetch() {
  # fetch <url> <archive-name> <sha256> -> prints path of the verified archive
  local url="$1" name="$2" expected="$3" archive
  if [ -n "${DOWNLOAD_CACHE_DIR:-}" ] && [ -f "${DOWNLOAD_CACHE_DIR}/${name}" ]; then
    archive="${DOWNLOAD_CACHE_DIR}/${name}"
  else
    archive="${TMP_DIR}/${name}"
    curl -fL --retry 3 -o "$archive" "$url" >&2
  fi
  local actual
  actual="$(sha256 "$archive")"
  if [ "$actual" != "$expected" ]; then
    echo "Error: checksum mismatch for ${name}" >&2
    echo "  expected: ${expected}" >&2
    echo "  actual:   ${actual}" >&2
    exit 1
  fi
  echo "$archive"
}

TMP_DIR="$(mktemp -d)"
# each tool is prepared inside a staging directory on the same filesystem and
# moved to its final location as the last step, so a failed or interrupted run
# never leaves a partial directory behind that a retry would then skip
STAGING="${TMP_DIR}/staging"
trap 'rm -rf "$TMP_DIR" "$STAGING"' EXIT
mkdir -p "$DEST_DIR"
STAGING="$(mktemp -d "${DEST_DIR}/.staging.XXXXXX")"

echo "Fetching macOS ${ARCH} dependencies into dependencies/${DEST_DIR}"

# ── Python ────────────────────────────────────────────────────────────────
if [ -d "$PYTHON_DEST" ]; then
  echo "Skipping Python, ${PYTHON_DEST} already exists (delete it to re-download)"
else
  archive="$(fetch "$PYTHON_URL" "$PYTHON_ARCHIVE" "$PYTHON_SHA256")"
  # the tarball contains a single top level "python" directory
  tar xzf "$archive" -C "$STAGING"

  # pyserial is required by the firmware flashing scripts and setuptools
  # provides the distutils shim required by the PlatformIO installer on
  # Python >= 3.12. Both are pure Python wheels, so any host interpreter can
  # install them into the bundle.
  cat > "${TMP_DIR}/requirements.txt" <<EOF
pyserial==${PYSERIAL_VERSION} --hash=sha256:${PYSERIAL_WHEEL_SHA256}
setuptools==${SETUPTOOLS_VERSION} --hash=sha256:${SETUPTOOLS_WHEEL_SHA256}
EOF
  python3 -m pip install --quiet --no-compile --no-deps --require-hashes \
    --target "${STAGING}/python/lib/python${PYTHON_VERSION%.*}/site-packages" \
    --requirement "${TMP_DIR}/requirements.txt"

  # drop the Tcl/Tk GUI stack (tkinter, idle, turtle): neither the PlatformIO
  # installer nor the flashing scripts ever open a window
  rm -rf \
    "${STAGING}/python/lib/tcl9.0" \
    "${STAGING}/python/lib/tk9.0" \
    "${STAGING}/python/lib/tcl9" \
    "${STAGING}/python/lib/itcl"* \
    "${STAGING}/python/lib/thread"* \
    "${STAGING}/python/lib/libtcl"* \
    "${STAGING}/python/lib/libtk"* \
    "${STAGING}/python/lib/python${PYTHON_VERSION%.*}/idlelib" \
    "${STAGING}/python/lib/python${PYTHON_VERSION%.*}/tkinter" \
    "${STAGING}/python/lib/python${PYTHON_VERSION%.*}/turtledemo" \
    "${STAGING}/python/lib/python${PYTHON_VERSION%.*}/turtle.py" \
    "${STAGING}/python/lib/python${PYTHON_VERSION%.*}/lib-dynload/_tkinter"* \
    "${STAGING}/python/bin/idle"*

  mv "${STAGING}/python" "$PYTHON_DEST"
  echo "Installed Python ${PYTHON_VERSION} to dependencies/${PYTHON_DEST}"
fi

# ── git ───────────────────────────────────────────────────────────────────
if [ -d "$GIT_DEST" ]; then
  echo "Skipping git, ${GIT_DEST} already exists (delete it to re-download)"
else
  archive="$(fetch "$GIT_URL" "$GIT_ARCHIVE" "$GIT_SHA256")"
  mkdir -p "${STAGING}/git-portable"
  tar xzf "$archive" -C "${STAGING}/git-portable"

  # drop Git Credential Manager (a self contained .NET GUI runtime, ~100MB:
  # every .dll and .dylib in git-core belongs to it, dugite's git is static)
  # and git-lfs: the configurator only clones public repositories anonymously
  rm -f \
    "${STAGING}/git-portable/libexec/git-core/"*.dll \
    "${STAGING}/git-portable/libexec/git-core/"*.dylib \
    "${STAGING}/git-portable/libexec/git-core/git-credential-manager"* \
    "${STAGING}/git-portable/libexec/git-core/git-lfs"

  mv "${STAGING}/git-portable" "$GIT_DEST"
  echo "Installed git ${GIT_VERSION} to dependencies/${GIT_DEST}"
fi

echo "Done"
