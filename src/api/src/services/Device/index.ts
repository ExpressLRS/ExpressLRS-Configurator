import fs from 'fs/promises';
import path from 'path';
import { Service } from 'typedi';
import Device from '../../models/Device';
import Target from '../../models/Target';
import FlashingMethod from '../../models/enum/FlashingMethod';
import UserDefineKey from '../../library/FirmwareBuilder/Enum/UserDefineKey';
import DeviceType from '../../models/enum/DeviceType';
import { LoggerService } from '../../logger';
import UserDefineOverride from '../../models/UserDefineOverride';
import TargetUserDefinesFactory from '../../factories/TargetUserDefinesFactory';
import UserDefine from '../../models/UserDefine';

export interface IDevices {
  getDevices(): Device[];
}

@Service()
export default class DeviceService implements IDevices {
  devices: Device[];

  constructor(private logger: LoggerService) {
    this.devices = [];
  }

  async loadFromFileSystemAt(location: string) {
    const files = await fs
      .readdir(location)
      .then((fileNames) => {
        return fileNames
          .filter((file) => file.endsWith('.json'))
          .map((file) => path.join(location, file));
      })
      .then((configs) => {
        return configs.map((file) => {
          // eslint-disable-next-line promise/no-nesting
          return fs.readFile(file, 'utf8').then((data) => JSON.parse(data));
        });
      });
    const configsRaw = await Promise.all(files);
    const configs = configsRaw.reduce(
      (accumulator, current) => accumulator.concat(current),
      []
    );
    this.devices = this.processDeviceConfigs(configs);
  }

  processDeviceConfigs(input: any[]): Device[] {
    const devices: Device[] = [];

    input.forEach((value) => {
      try {
        if (!value.name) {
          throw new Error(`all devices must have a name property!`);
        }
        if (!value.category) {
          throw new Error(`category property is required!`);
        }
        if (!value.targets || value.targets.length === 0) {
          throw new Error(`devices must have a list of targets defined!`);
        }
        if (!value.userDefines || value.userDefines.length === 0) {
          throw new Error(
            `devices must have a list of supported user defines!`
          );
        }

        const targets: Target[] = value.targets.map(
          (item: { name: string; flashingMethod: string }) => {
            if (!item.name) {
              throw new Error(`target must have a name property`);
            }

            const flashingMethod =
              FlashingMethod[
                item.flashingMethod as keyof typeof FlashingMethod
              ];

            if (!flashingMethod) {
              throw new Error(
                `error parsing target "${item.name}": "${item.flashingMethod}" is not a valid flashing method`
              );
            }

            return {
              id: `${value.category}|${value.name}|${item.name}|${item.flashingMethod}`,
              name: item.name,
              flashingMethod,
            };
          }
        );

        const targetUserDefinesFactory = new TargetUserDefinesFactory();
        const userDefines: UserDefine[] = value.userDefines.map(
          (item: string | UserDefineOverride) => {
            if (typeof item === 'string') {
              const userDefineKey =
                UserDefineKey[item as keyof typeof UserDefineKey];
              if (!userDefineKey) {
                throw new Error(`"${item}" is not a valid User Define`);
              }
              return targetUserDefinesFactory.build(userDefineKey);
            }

            if (typeof item === 'object') {
              const userDefineKey =
                UserDefineKey[item.key as keyof typeof UserDefineKey];
              if (!userDefineKey) {
                throw new Error(`"${item}" is not a valid User Define`);
              }

              let userDefine = targetUserDefinesFactory.build(userDefineKey);
              userDefine = this.applyUserDefineOverride(userDefine, item);
              return userDefine;
            }

            throw new Error(`"${item}" is not a valid User Define`);
          }
        );

        const deviceType =
          DeviceType[value.deviceType as keyof typeof DeviceType];

        if (!deviceType) {
          throw new Error(`"${value.deviceType}" is not a valid device type`);
        }

        const device: Device = {
          id: value.name,
          name: value.name,
          category: value.category,
          targets,
          userDefines,
          wikiUrl: value.wikiUrl,
          deviceType,
          parent: null,
          abbreviatedName: value.abbreviatedName,
          verifiedHardware: value.verifiedHardware ?? true,
        };

        devices.push(device);

        if (value.aliases) {
          value.aliases.forEach(
            (alias: {
              name: string;
              category: string;
              wikiUrl: string;
              abbreviatedName?: string;
              verifiedHardware?: boolean;
            }) => {
              devices.push({
                id: alias.name,
                name: alias.name,
                category: alias.category,
                targets: device.targets.map((target) => {
                  return {
                    id: `${alias.category}|${alias.name}|${target.name}`,
                    name: target.name,
                    flashingMethod: target.flashingMethod,
                  };
                }),
                userDefines: device.userDefines,
                wikiUrl: alias.wikiUrl,
                deviceType: device.deviceType,
                parent: device.id,
                abbreviatedName: alias.abbreviatedName,
                verifiedHardware: alias.verifiedHardware ?? true,
              });
            }
          );
        }
      } catch (error: any) {
        const errormessage = `Issue encountered while parsing device "${value.name}" in the device configuration file devices.json: ${error.message}`;
        this.logger.error(errormessage);
        throw new Error(errormessage);
      }
    });

    return devices;
  }

  getDevices(): Device[] {
    return this.devices;
  }

  applyUserDefineOverride(
    userDefine: UserDefine,
    userDefineOverride: UserDefineOverride
  ): UserDefine {
    const userDefineCopy: UserDefine = { ...userDefine };

    if (userDefineOverride.enabled !== undefined) {
      userDefineCopy.enabled = userDefineOverride.enabled;
    }
    if (userDefineOverride.sensitive !== undefined) {
      userDefineCopy.sensitive = userDefineOverride.sensitive;
    }
    if (userDefineOverride.enumValues !== undefined) {
      userDefineCopy.enumValues = userDefineOverride.enumValues;
    }
    if (userDefineOverride.value !== undefined) {
      userDefineCopy.value = userDefineOverride.value;
    }
    if (userDefineOverride.optionGroup !== undefined) {
      userDefineCopy.optionGroup = userDefineOverride.optionGroup;
    }
    return userDefineCopy;
  }
}
