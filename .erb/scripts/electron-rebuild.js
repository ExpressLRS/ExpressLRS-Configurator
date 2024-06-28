import { execSync } from 'child_process';
import fs from 'fs';
import packageJson from '../../release/app/package.json' with {type: 'json'};
import webpackPaths from '../configs/webpack.paths.js';

if (
  Object.keys(packageJson.dependencies || {}).length > 0 &&
  fs.existsSync(webpackPaths.appNodeModulesPath)
) {
  const electronRebuildCmd =
    '../../node_modules/.bin/electron-rebuild --force --types prod,dev,optional --module-dir ';
  const cmd =
    process.platform === 'win32'
      ? electronRebuildCmd.replace(/\//g, '\\')
      : electronRebuildCmd;
  execSync(cmd, {
    cwd: webpackPaths.appPath,
    stdio: 'inherit',
  });
}
