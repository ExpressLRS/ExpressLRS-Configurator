import fetch, { Headers } from 'node-fetch';
import { writeFile } from 'fs/promises';
import fs from 'fs';

export default class AmazonS3 {
  async downloadIfModified(url: string, outputFile: string): Promise<boolean> {
    const headers = new Headers();
    if (fs.existsSync(outputFile)) {
      const stat = await fs.promises.stat(outputFile);
      headers.append('If-Modified-Since', stat.mtime.toUTCString());
    }

    const response = await fetch(url, { headers });

    if (response.status === 304) {
      return false;
    }

    if (response.status === 200) {
      const buffer = await response.buffer();
      await writeFile(outputFile, buffer);
      return true;
    }

    throw new Error(
      `Error encountered while retrieving ${url}, ${response.status} - ${response.statusText}`
    );
  }
}
