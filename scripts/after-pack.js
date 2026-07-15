/**
 * after-pack.js — post-packaging hook for electron-builder.
 *
 * Electron-builder invokes this script after packaging each .app bundle.
 * At this point, electron-builder has already copied extraFiles (from package.json)
 * into a stable "dependencies/" directory inside the .app. This hook renames those
 * directories to arch-specific names so the runtime code can find them.
 *
 * Example: electron-builder places portable-python at dependencies/portable-python.
 *           This hook renames it to   dependencies/portable-python-arm64 (or x64).
 *
 * Arch-specific behavior:
 *   - arm64: portable-python only (portable-git not bundled; app uses /usr/bin/git)
 *   - x64:  portable-python + portable-git (both bundled from mac-deps/)
 */

const fs = require('fs');
const path = require('path');

// ── Electron-builder arch enum → string mapping ─────────────────────────────
// electron-builder passes arch as a numeric value; this maps it to the string
// names used throughout the build pipeline (matching builder-util Arch).

const ARCH_MAP = { 0: 'ia32', 1: 'x64', 2: 'armv7l', 3: 'arm64', 4: 'universal' };

module.exports = async function ({ appOutDir, arch }) {
  // ── 1. Resolve target architecture name ────────────────────────────────
  const targetArch = ARCH_MAP[arch];

  if (!targetArch) {
    throw new Error(`Unrecognised arch value from electron-builder: ${JSON.stringify(arch)}`);
  }

  // ── 2. Locate the .app bundle within the output directory ───────────────
  // electron-builder may produce multiple bundles; we take the first .app found.

  const appBundles = fs.readdirSync(appOutDir).filter(
    (f) => f.endsWith('.app') && fs.statSync(path.join(appOutDir, f)).isDirectory(),
  );

  if (appBundles.length === 0) {
    throw new Error(`No .app bundle found in ${appOutDir}`);
  }

  const appName = appBundles[0]; // e.g. "ExpressLRS Configurator.app"
  const depsDir = path.join(appOutDir, appName, 'Contents', 'dependencies');

  if (!fs.existsSync(depsDir)) {
    throw new Error(`Dependencies dir not found at ${depsDir}`);
  }

  // ── 3. Determine which portable tools to rename (arch-specific) ─────────
  // Portable-python is always bundled. Portable-git is only bundled on x64;
  // arm64 uses the system /usr/bin/git instead.

  const entries = ['portable-python'];

  if (targetArch === 'x64') {
    entries.push('portable-git');
  }

  // ── 4. Rename generic tool dirs to arch-specific names ─────────────────
  // electron-builder places tools at stable paths (e.g. dependencies/portable-python).
  // We rename them so the runtime code can discover arch-specific directories.

  for (const name of entries) {
    const srcPath = path.join(depsDir, name);

    if (!fs.existsSync(srcPath)) {
      throw new Error(`${name} not found at ${srcPath}`);
    }

    const targetName = `${name}-${targetArch}`;
    const targetPath = path.join(depsDir, targetName);

    // Remove stale arch-specific directory from a prior build
    if (fs.existsSync(targetPath)) {
      fs.rmSync(targetPath, { recursive: true, force: true });
    }

    // Rename to arch-specific name
    fs.renameSync(srcPath, targetPath);
    console.log(`[afterPack] renamed ${name} → ${targetName}`);
  }

  console.log(`[afterPack] done for arch=${targetArch} — ${appOutDir}/${appName}`);
};
