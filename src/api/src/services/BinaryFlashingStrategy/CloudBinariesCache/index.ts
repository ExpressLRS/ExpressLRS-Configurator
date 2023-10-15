import extractZip from 'extract-zip';
import path from 'path';
import mkdirp from 'mkdirp';
import { removeDirectoryContents } from '../../FlashingStrategyLocator/artefacts';
import { downloadIfModified } from '../AmazonS3';

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
    /* if (fs.existsSync(firmwareCacheDir)) {
      return firmwareCacheDir;
    } */

    const cacheUrl = `${this.baseURL}/${repositoryName}/${commitHash}/firmware.zip`;
    const outputZipFile = path.join(workingDir, 'firmware.zip');

    if (await downloadIfModified(cacheUrl, outputZipFile)) {
      await extractZip(outputZipFile, {
        dir: workingDir,
      });
    }

    return firmwareCacheDir;
  }

  async clearCache() {
    await removeDirectoryContents(this.firmwareCachePath);
  }
}
