import fs from 'fs';
import path from 'path';
import Platformio from '../Platformio';
import { CommandResult, NoOpFunc, OnOutputFunc } from '../Commander';
import UserDefineKey from './Enum/UserDefineKey';
import UploadType from '../Platformio/Enum/UploadType';

interface UserDefinesCompatibilityResult {
  compatible: boolean;
  incompatibleKeys: string[];
}

export default class FirmwareBuilder {
  constructor(private platformio: Platformio) {}

  async checkDefaultUserDefinesCompatibilityAtPath(
    firmwarePath: string,
    keys: UserDefineKey[]
  ): Promise<UserDefinesCompatibilityResult> {
    const userDefinesPath = path.join(firmwarePath, 'user_defines.txt');
    const userDefinesTxt = await fs.promises.readFile(userDefinesPath, 'utf8');
    return this.checkDefaultUserDefinesCompatibility(userDefinesTxt, keys);
  }

  async checkDefaultUserDefinesCompatibility(
    userDefinesTxt: string,
    keys: UserDefineKey[]
  ): Promise<UserDefinesCompatibilityResult> {
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

  // hotfix for https://github.com/ExpressLRS/ExpressLRS/pull/1911
  async removeStaleBinaries(projectDir: string, environment: string) {
    try {
      const paths = [
        path.join(projectDir, '.pio', 'build', environment, 'firmware.elrs'),
        path.join(projectDir, '.pio', 'build', environment, 'backpack.bin'),
        path.join(projectDir, '.pio', 'build', environment, 'firmware.bin'),
      ];
      // eslint-disable-next-line no-restricted-syntax
      for (const location of paths) {
        if (fs.existsSync(location)) {
          this.logger?.log('removing stale bin', {
            location,
          });
          fs.unlinkSync(location);
        }
      }
    } catch (e) {
      this.logger.error('failed to unlink stale binaries', undefined, {
        err: e,
      });
    }
  }

  async build(
    target: string,
    userDefines: string,
    firmwarePath: string,
    onOutput: OnOutputFunc = NoOpFunc
  ): Promise<CommandResult> {
    await this.storeUserDefines(firmwarePath, userDefines);
    await this.removeStaleBinaries(firmwarePath, target);
    return this.platformio.build(firmwarePath, target, onOutput);
  }

  async flash(
    target: string,
    userDefines: string,
    firmwarePath: string,
    serialPort: string | undefined,
    uploadType: UploadType,
    onOutput: OnOutputFunc = NoOpFunc
  ): Promise<CommandResult> {
    await this.storeUserDefines(firmwarePath, userDefines);
    await this.removeStaleBinaries(firmwarePath, target);
    return this.platformio.flash(
      firmwarePath,
      target,
      serialPort,
      uploadType,
      onOutput
    );
  }
}
