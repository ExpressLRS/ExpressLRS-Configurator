import {DeviceTarget} from './Enum/DeviceTarget';
import fs from 'fs';
import path from 'path';
import Platformio from '../Platformio';
import {CommandResult, NoOpFunc, OnOutputFunc} from '../Commander';

export default class FirmwareBuilder {
  constructor(private platformio: Platformio) {
  }

  async build(target: DeviceTarget, userDefines: string, firmwarePath: string, onOutput: OnOutputFunc = NoOpFunc): Promise<CommandResult> {
    const userDefinesPath = path.join(firmwarePath, 'user_defines.txt');
    await this.writeToFile(userDefines, userDefinesPath);
    console.log(`building for ${target} with user defines ${userDefines} at ${firmwarePath}`);

    return this.platformio.build(firmwarePath, target, onOutput);
  }

  getFirmwareBinPath(target: DeviceTarget, firmwarePath: string): string {
    return path.join(firmwarePath, '.pio', 'build', target, 'firmware.bin');
  }

  async flash(target: DeviceTarget, firmwarePath: string, onOutput: OnOutputFunc = NoOpFunc): Promise<CommandResult> {
    console.log(`flashing ${target} at ${firmwarePath}`);
    return this.platformio.flash(firmwarePath, target, onOutput);
  }

  async writeToFile(contents: string, path: string): Promise<void> {
    await new Promise((resolve, reject) => {
      fs.writeFile(path, contents, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve(void 0);
        }
      })
    })
  }
}
