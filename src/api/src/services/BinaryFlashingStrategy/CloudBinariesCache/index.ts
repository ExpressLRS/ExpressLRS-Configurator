import fetch from 'node-fetch';
import { writeFile } from 'fs/promises';
import extractZip from 'extract-zip';
import path from 'path';
import mkdirp from 'mkdirp';
import fs from 'fs';
import { removeDirectoryContents } from '../../FlashingStrategyLocator/artefacts';

export default class CloudBinariesCache {
  constructor(private baseURL: string, private firmwareCachePath: string) {}

  async download(repositoryName: string, commitHash: string): Promise<string> {
    const workingDir = path.join(
      this.firmwareCachePath,
      repositoryName,
      commitHash
    );
    await mkdirp(workingDir);
    const firmwareCacheDir = path.join(workingDir, 'firmware');

    // if we have firmware in our local cache already no need to download it the second time.
    if (fs.existsSync(firmwareCacheDir)) {
      return firmwareCacheDir;
    }

    const cacheUrl = `${this.baseURL}/${repositoryName}/${commitHash}/firmware.zip`;
    const response = await fetch(cacheUrl);
    console.log(response);
    if (response.status !== 200) {
      throw new Error(
        `cached build for ${repositoryName}/${commitHash} is not available`
      );
    }

    const outputZipFile = path.join(workingDir, 'firmware.zip');
    const buffer = await response.buffer();
    await writeFile(outputZipFile, buffer);

    await extractZip(outputZipFile, {
      dir: workingDir,
    });

    return firmwareCacheDir;
  }

  async clearCache() {
    await removeDirectoryContents(this.firmwareCachePath);
  }
}
