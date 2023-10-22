import extractZip from 'extract-zip';
import path from 'path';
import mkdirp from 'mkdirp';
import { removeDirectoryContents } from '../../FlashingStrategyLocator/artefacts';
import AmazonS3 from '../../../library/AmazonS3';

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

    const cacheUrl = `${this.baseURL}/${repositoryName}/${commitHash}/firmware.zip`;
    const outputZipFile = path.join(workingDir, 'firmware.zip');

    if (await new AmazonS3().downloadIfModified(cacheUrl, outputZipFile)) {
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
