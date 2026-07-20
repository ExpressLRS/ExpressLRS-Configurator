#!/usr/bin/env bash
# Build macOS app for x86_64 (Intel) or arm64 (Apple Silicon).
#
# Usage:
#   ./build-mac.sh arm64        → build Apple Silicon (ARM)
#   ./build-mac.sh x86_64       → build Intel (x86)
#   ./build-mac.sh -a           → auto-detect architecture and build
#   ./build-mac.sh -h           → show help
#
# How it works:
#   1. Resolves the correct portable toolchain directories for the target arch.
#   2. Creates symlinks in mac-deps/ (portable-python always, portable-git on x64 only).
#   3. Runs electron-builder which bundles mac-deps/ into the .app via extraFiles
#      in package.json. The after-pack hook then renames them to arch-specific names
#      (e.g., portable-python-arm64, portable-git-x64).
#   4. On arm64, no portable-git is bundled — the app uses /usr/bin/git from macOS.
#   5. On x64, portable-git is bundled and used at runtime from dependencies/.

set -euo pipefail
cd "$(cd "$(dirname "$0")/.." && pwd)"

# ── Help ───────────────────────────────────────────────────────────────────
usage() {
  cat <<EOF
Usage: $(basename "$0") [options] [arch]

Build macOS app for x86_64 (Intel) or arm64 (Apple Silicon).

Options:
  -h, --help      Show this help message
  -a, --auto      Auto-detect architecture

Architectures:
  arm64, aarch64  Build for Apple Silicon Macs
  x86_64, intel   Build for Intel Macs

Examples:
  $(basename "$0") arm64        # build for Apple Silicon
  $(basename "$0") -a           # auto-detect and build
  $(basename "$0") x86_64        # build for Intel Macs
EOF
}

# ── Parse flags ────────────────────────────────────────────────────────────
AUTO=false
ARGS=()
for arg in "$@"; do
    case "$arg" in
        -h|--help) usage; exit 0 ;;
        -a|--auto) AUTO=true ;;
        *) ARGS+=("$arg") ;;
    esac
done

# Show help if no arguments provided
if [[ ${#ARGS[@]} -eq 0 && "$AUTO" == "false" ]]; then
    usage
    exit 0
fi

# ── Portable toolchain configuration ───────────────────────────────────────
# These directories must exist before building. They contain pre-built,
# self-contained copies of Python and Git with all their shared libraries
# bundled alongside them (using @loader_path relative paths).

ARM64_DIR="dependencies/darwin_arm64"
ARM64_PYTHON="portable-python-3.14.6"

X64_DIR="dependencies/darwin_amd64"
X64_PYTHON="python-portable-darwin-3.8.4"
X64_GIT="git-2.29.2"

# ── 1. Detect architecture ────────────────────────────────────────────────
# Use -a/--auto to auto-detect from uname -m, or use the first CLI argument if provided.
# Auto-detection returns "arm64" on Apple Silicon and "x86_64" on Intel Macs.
# When -a/--auto is used, any architecture argument is ignored.
if [[ "$AUTO" == "true" ]]; then ARCH="$(uname -m)"; ARCH_SOURCE="auto-detected"
else ARCH="${ARGS[0]}"; ARCH_SOURCE="from CLI"; fi

# Normalize common aliases so users can pass "intel", "aarch64", etc.
case "$ARCH" in
  x86_64|intel|x86)
    ARCH="x86_64" ;;
  arm64|aarch64|"apple-silicon")
    ARCH="arm64" ;;
  *)
    echo "Error: unknown architecture '$ARCH'. Use x86_64 or arm64." >&2
    echo "Run with -h for usage." >&2
    exit 1 ;;
esac

echo "▶ Building for macOS ${ARCH} (${ARCH_SOURCE})"

# ── 2. Resolve source directories ─────────────────────────────────────────
# Map the resolved arch to the correct toolchain root, Python dir name,
# and Git dir name. These feed into the symlink creation step below.

case "$ARCH" in
  x86_64)
    SRC_DIR=$X64_DIR
    SRC_PYTHON=$X64_PYTHON
    SRC_GIT=$X64_GIT
    ;;
  arm64)
    SRC_DIR=$ARM64_DIR
    SRC_PYTHON=$ARM64_PYTHON
    ;;
esac

# ── 3. Ensure arm64 portable dependencies exist ────────────────────────
# Only arm64 requires this check. x86_64 portable tools (python, git) are
# pre-bundled in the repo as stable upstream releases. arm64 portable python is
# custom-built and may not exist on a fresh checkout or after cleanup.

if [[ "$ARCH" == "arm64" ]]; then
    python_dir="${SRC_DIR}/${ARM64_PYTHON}"
    if [ ! -d "$python_dir" ] || [ -z "$(ls -A "$python_dir")" ]; then
        echo "▶ Downloading missing portable dependencies for arm64..." >&2
        bash "${ARM64_DIR}/download-portable-python.sh" 2>&1 || {
            echo "Error: download-portable-python.sh failed." >&2
            exit 1
        }

        # Verify the download succeeded
        if [ ! -d "$python_dir" ] || [ -z "$(ls -A "$python_dir")" ]; then
            echo "Error: $python_dir is still missing after running download script." >&2
            exit 1
        fi
    fi
fi

# ── 4. Create mac-deps/ symlinks ─────────────────────────────────────────
# Removes any existing mac-deps (real directory or stale symlinks) and creates
# fresh symlinks pointing to the correct arch-specific toolchain directories.
# These stable mac-deps/ paths are what package.json references in extraFiles,
# so the build script and electron-builder never need arch-specific config.
# For arm64, a placeholder portable-git directory is created instead of a
# symlink (since arm64 doesn't bundle git). The after-pack hook removes it.

echo "▶ creating mac-deps symlinks for ${ARCH}"
# Validate source directories exist before creating symlinks
if [ ! -d "$SRC_DIR" ]; then
    echo "Error: source directory '$SRC_DIR' does not exist." >&2
    exit 1
fi
if [ ! -d "${SRC_DIR}/${SRC_PYTHON}" ]; then
    echo "Error: python directory '${SRC_DIR}/${SRC_PYTHON}' does not exist." >&2
    exit 1
fi
if [[ "$ARCH" != "arm64" ]] && [ ! -d "${SRC_DIR}/${SRC_GIT}" ]; then
    echo "Error: git directory '${SRC_DIR}/${SRC_GIT}' does not exist." >&2
    exit 1
fi

rm -rf mac-deps || true
mkdir -p mac-deps
ln -sf "../${SRC_DIR}/${SRC_PYTHON}"  mac-deps/portable-python
# Git is only bundled on x86_64; arm64 uses the system /usr/bin/git
if [[ "$ARCH" != "arm64" ]]; then
  ln -sf "../${SRC_DIR}/${SRC_GIT}"   mac-deps/portable-git
else
  # Create a placeholder for arm64 so extraFiles doesn't fail.
  # electron-builder requires all extraFiles paths to exist at build time.
  # The after-pack hook removes this directory since arm64 doesn't bundle git.
  mkdir -p mac-deps/portable-git
fi

echo "   portable-python → ${SRC_DIR}/${SRC_PYTHON}"
if [[ "$ARCH" != "arm64" ]]; then
  echo "   portable-git    → ${SRC_DIR}/${SRC_GIT}"
fi

# ── 5. Build with electron-builder ────────────────────────────────────────
# Uses `exec` to replace this shell process with electron-builder so that
# Ctrl+C and other signals are forwarded directly (no orphaned processes).

echo "▶ Running yarn install/build"
if [ ! -d "node_modules" ]; then
    echo "▶ node_modules missing, running yarn install..."
    yarn install --frozen-lockfile
fi
yarn build

# ── 6. Clean stale release directories ────────────────────────────────────
# electron-builder fails with ENOTEMPTY if stale build directories exist
# from a previous interrupted build. Clean them up before running the build.

case "$ARCH" in
  x86_64) EB_ARCH="x64" ;;
  arm64)  EB_ARCH="arm64" ;;
esac

for dir in release/mac-"${EB_ARCH}" release/mac-"${EB_ARCH}".tmp; do
  if [ -e "$dir" ]; then
    echo "▶ Removing stale $dir"
    rm -rf "$dir"
  fi
done

echo "▶ Running electron-builder --mac --${EB_ARCH}"
exec npx electron-builder --mac --"${EB_ARCH}"
