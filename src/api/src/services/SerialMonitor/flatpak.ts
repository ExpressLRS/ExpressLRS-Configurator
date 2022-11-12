import fs, { ReadStream } from 'fs';
import path from 'path';
import readline from 'readline';
import { PortInfo } from '@serialport/bindings-cpp';

const flatpakInfoPath = '/.flatpak-info';

function insideFlatpak() {
  return process.platform === 'linux' && fs.existsSync(flatpakInfoPath);
}

function createReadStreamSafe(
  filename: string,
  options?: { encoding?: BufferEncoding; autoClose?: boolean }
): Promise<ReadStream> {
  return new Promise((resolve, reject) => {
    const fileStream = fs.createReadStream(filename, options);
    fileStream.on('error', reject).on('open', () => {
      resolve(fileStream);
    });
  });
}

const ttySysClassPath = '/sys/class/tty';
const productRegex = /^PRODUCT=(?<vendorId>\d+)\/(?<productId>\d+)\/.*/;

function listPorts(): Promise<PortInfo[]> {
  // eslint-disable-next-line no-async-promise-executor
  return new Promise(async (resolve, reject) => {
    const ports: PortInfo[] = [];
    let openedDir;
    try {
      openedDir = await fs.promises.opendir(ttySysClassPath);
    } catch (err) {
      console.error(err);
      reject(err);
    }

    if (!openedDir) {
      return;
    }

    // eslint-disable-next-line no-restricted-syntax
    for await (const fileDirent of openedDir) {
      const dir = fileDirent.name;
      const dirPath = path.join(ttySysClassPath, dir);

      const ueventPath = path.join(dirPath, 'device', 'uevent');
      const ueventPathExists = fs.existsSync(ueventPath);

      if (ueventPathExists) {
        let port: PortInfo = {
          path: path.join('/dev', dir),
          vendorId: undefined,
          productId: undefined,
          locationId: undefined,
          serialNumber: undefined,
          manufacturer: undefined,
          pnpId: undefined,
        };

        const ueventStream = await createReadStreamSafe(ueventPath, {
          encoding: 'utf8',
          autoClose: true,
        });
        const rl = readline.createInterface({
          input: ueventStream,
        });
        rl.on('line', (line) => {
          const match = productRegex.exec(line);
          if (match) {
            port = {
              path: path.join('/dev', dir),
              vendorId: match?.groups?.vendorId.padStart(4, '0'),
              productId: match?.groups?.productId,
              locationId: undefined,
              serialNumber: undefined,
              manufacturer: undefined,
              pnpId: undefined,
            };
          }
        });
        rl.on('close', () => {
          if (port) {
            ports.push(port);
          }
        });
      }
    }

    const collator = new Intl.Collator([], { numeric: true });
    ports.sort((a, b) => {
      return collator.compare(a.path, b.path);
    });

    resolve(ports);
  });
}

export { insideFlatpak, listPorts };
