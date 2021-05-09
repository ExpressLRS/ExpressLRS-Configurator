import fs from 'fs';
import path from 'path';
import DeviceTarget from './Enum/DeviceTarget';
import Platformio from '../Platformio';
import { CommandResult, NoOpFunc, OnOutputFunc } from '../Commander';
import UserDefineKey from './Enum/UserDefineKey';

interface UserDefinesCompatiblityResult {
  compatible: boolean;
  incompatibleKeys: string[];
}

export default class FirmwareBuilder {
  constructor(private platformio: Platformio) {}

  async checkDefaultUserDefinesCompatibilityAtPath(
    firmwarePath: string,
    keys: UserDefineKey[]
  ): Promise<UserDefinesCompatiblityResult> {
    const userDefinesPath = path.join(firmwarePath, 'user_defines.txt');
    const userDefinesTxt = await fs.promises.readFile(userDefinesPath, 'utf8');
    return this.checkDefaultUserDefinesCompatibility(userDefinesTxt, keys);
  }

  async checkDefaultUserDefinesCompatibility(
    userDefinesTxt: string,
    keys: UserDefineKey[]
  ): Promise<UserDefinesCompatiblityResult> {
    const incompatibleKeys = keys.filter(
      (key) => userDefinesTxt.indexOf(key) === -1
    );
    if (incompatibleKeys.length > 0) {
      return {
        compatible: false,
        incompatibleKeys,
      };
    }

    return {
      compatible: true,
      incompatibleKeys: [],
    };
  }

  getFirmwareBinPath(target: DeviceTarget, firmwarePath: string): string {
    const firmwareElrs = path.join(
      firmwarePath,
      '.pio',
      'build',
      target,
      'firmware.elrs'
    );
    if (fs.existsSync(firmwareElrs)) {
      return firmwareElrs;
    }
    return path.join(firmwarePath, '.pio', 'build', target, 'firmware.bin');
  }

  private async storeUserDefines(firmwarePath: string, userDefinesTxt: string) {
    const userDefinesPath = path.join(firmwarePath, 'user_defines.txt');
    await fs.promises.writeFile(userDefinesPath, userDefinesTxt);
  }

  async build(
    target: DeviceTarget,
    userDefines: string,
    firmwarePath: string,
    onOutput: OnOutputFunc = NoOpFunc
  ): Promise<CommandResult> {
    await this.storeUserDefines(firmwarePath, userDefines);
    return this.platformio.build(firmwarePath, target, onOutput);
  }

  async flash(
    target: DeviceTarget,
    userDefines: string,
    firmwarePath: string,
    serialPort: string | undefined,
    onOutput: OnOutputFunc = NoOpFunc
  ): Promise<CommandResult> {
    await this.storeUserDefines(firmwarePath, userDefines);
    return this.platformio.flash(firmwarePath, target, serialPort, onOutput);
  }
}
