/* eslint-disable import/prefer-default-export */
import fetch, { Headers } from 'node-fetch';
import { writeFile } from 'fs/promises';
import fs from 'fs';

export const downloadIfModified = async (
  url: string,
  outputFile: string
): Promise<boolean> => {
  const headers = new Headers();
  if (fs.existsSync(outputFile)) {
    const stat = await fs.promises.stat(outputFile);
    headers.append('If-Modified-Since', stat.mtime.toUTCString());
  }

  const response = await fetch(url, { headers });
  console.log(response);

  if (response.status === 304) {
    return false;
  }

  if (response.status === 200) {
    const buffer = await response.buffer();
    await writeFile(outputFile, buffer);
    return true;
  }

  throw new Error(`${url} is not available`);
};
