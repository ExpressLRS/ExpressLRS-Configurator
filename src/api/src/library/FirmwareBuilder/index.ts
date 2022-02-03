import fs from 'fs';
import path from 'path';
import Platformio from '../Platformio';
import { CommandResult, NoOpFunc, OnOutputFunc } from '../Commander';
import UserDefineKey from './Enum/UserDefineKey';
import BuildJobType from '../../models/enum/BuildJobType';

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

  getFirmwareBinPath(target: string, firmwarePath: string): string {
    const paths = [
      path.join(firmwarePath, '.pio', 'build', target, 'firmware.elrs'),
      path.join(firmwarePath, '.pio', 'build', target, 'backpack.bin'),
    ];
    // eslint-disable-next-line no-restricted-syntax
    for (const location of paths) {
      if (fs.existsSync(location)) {
        return location;
      }
    }
    return path.join(firmwarePath, '.pio', 'build', target, 'firmware.bin');
  }

  private async storeUserDefines(firmwarePath: string, userDefinesTxt: string) {
    const userDefinesPath = path.join(firmwarePath, 'user_defines.txt');
    await fs.promises.writeFile(userDefinesPath, userDefinesTxt);
  }

  async build(
    target: string,
    userDefines: string,
    firmwarePath: string,
    onOutput: OnOutputFunc = NoOpFunc
  ): Promise<CommandResult> {
    await this.storeUserDefines(firmwarePath, userDefines);
    return this.platformio.build(firmwarePath, target, onOutput);
  }

  async flash(
    target: string,
    userDefines: string,
    firmwarePath: string,
    serialPort: string | undefined,
    onOutput: OnOutputFunc = NoOpFunc,
    buildJobType: BuildJobType
  ): Promise<CommandResult> {
    await this.storeUserDefines(firmwarePath, userDefines);
    return this.platformio.flash(
      firmwarePath,
      target,
      serialPort,
      onOutput,
      buildJobType
    );
  }
}
