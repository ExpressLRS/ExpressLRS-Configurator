import sanitize from 'sanitize-filename';
import fs from 'fs';
import path from 'path';
import os from 'os';
import rimraf from 'rimraf';
import UserDefineKey from '../../library/FirmwareBuilder/Enum/UserDefineKey';
import FirmwareSource from '../../models/enum/FirmwareSource';
import { BuildFlashFirmwareParams } from './BuildFlashFirmwareParams';

export const generateFirmwareFileName = (
  params: BuildFlashFirmwareParams
): string => {
  const { source, gitBranch, gitCommit, gitTag, gitPullRequest } =
    params.firmware;
  const deviceName = params.userDefines.find(
    (userDefine) => userDefine.key === UserDefineKey.DEVICE_NAME
  )?.value;
  let target = params.target.toString();

  const viaIndex = params.target?.lastIndexOf('_via');
  if (viaIndex > 0) {
    target = target.substring(0, viaIndex);
  }

  const replacement = '_';

  const firmwareName = deviceName
    ? sanitize(deviceName, { replacement }).replaceAll(' ', replacement)
    : target;

  switch (source) {
    case FirmwareSource.GitTag:
      return `${firmwareName}-${gitTag}`;
    case FirmwareSource.GitBranch:
      return `${firmwareName}-${gitBranch}`;
    case FirmwareSource.GitCommit:
      return `${firmwareName}-${gitCommit}`;
    case FirmwareSource.GitPullRequest:
      return `${firmwareName}-PR_${gitPullRequest?.number}`;
    default:
      return `${firmwareName}`;
  }
};

export const createBinaryCopyWithCanonicalName = async (
  params: BuildFlashFirmwareParams,
  firmwareBinPath: string,
  tmpPath = ''
): Promise<string> => {
  if (fs.existsSync(firmwareBinPath)) {
    const newFirmwareBaseName = generateFirmwareFileName(params);
    const firmwareExtension = path.extname(firmwareBinPath);

    if (tmpPath.length === 0) {
      // eslint-disable-next-line no-param-reassign
      tmpPath = await fs.promises.mkdtemp(
        path.join(os.tmpdir(), `${params.target}_`)
      );
    }

    // copy with original filename to tmpPath
    const tmpFirmwareBinPathOriginalName = path.join(
      tmpPath,
      path.basename(firmwareBinPath)
    );
    await fs.promises.copyFile(firmwareBinPath, tmpFirmwareBinPathOriginalName);

    const tmpFirmwareBinPath = path.join(
      tmpPath,
      `${newFirmwareBaseName}${firmwareExtension}`
    );

    try {
      await fs.promises.copyFile(firmwareBinPath, tmpFirmwareBinPath);
      return tmpFirmwareBinPath;
    } catch (err) {
      return firmwareBinPath;
    }
  }

  return firmwareBinPath;
};

const rmrf = async (file: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    rimraf(file, (err) => {
      if (err) {
        reject();
      } else {
        resolve();
      }
    });
  });
};

const listFiles = async (directory: string): Promise<string[]> => {
  return new Promise((resolve, reject) => {
    fs.readdir(directory, (err, files) => {
      if (err) {
        reject(err);
      } else {
        resolve(files.map((file) => path.join(directory, file)));
      }
    });
  });
};

export const removeDirectoryContents = async (firmwaresPath: string) => {
  if (!fs.existsSync(firmwaresPath)) {
    return;
  }
  const files = await listFiles(firmwaresPath);
  if (files.length > 7) {
    throw new Error(`unexpected number of files to remove: ${files}`);
  }
  await Promise.all(files.map((item) => rmrf(item)));
};
