import { Service } from 'typedi';
import { LoggerService } from '../../logger';
import Device from '../../models/Device';
import Target from '../../models/Target';
import DeviceJSON from '../../../../../devices.json';
import FlashingMethod from '../../models/enum/FlashingMethod';
import UserDefineKey from '../../library/FirmwareBuilder/Enum/UserDefineKey';
import DeviceType from '../../models/enum/DeviceType';

export interface IDevices {
  getDevices(): Device[];
}

@Service()
export default class DeviceService implements IDevices {
  devices: Device[];

  constructor(private logger: LoggerService) {
    this.devices = this.loadDevices();
  }

  loadDevices(): Device[] {
    const devices: Device[] = [];

    DeviceJSON.devices.forEach((value) => {
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

        const targets: Target[] = value.targets.map((item) => {
          if (!item.name) {
            throw new Error(`target must have a name property`);
          }

          const flashingMethod =
            FlashingMethod[item.flashingMethod as keyof typeof FlashingMethod];

          if (!flashingMethod) {
            throw new Error(
              `error parsing target "${item.name}": "${item.flashingMethod}" is not a valid flashing method`
            );
          }

          return {
            id: `${value.category}|${value.name}|${item.name}`,
            name: item.name,
            flashingMethod,
          };
        });

        const userDefines = value.userDefines.map((item) => {
          const userDefineKey =
            UserDefineKey[item as keyof typeof UserDefineKey];
          if (!userDefineKey) {
            throw new Error(`"${item}" is not a valid User Define`);
          }
          return userDefineKey;
        });

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
        };

        devices.push(device);

        if (value.aliases) {
          value.aliases.forEach((alias) => {
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
            });
          });
        }
      } catch (error: any) {
        const errormessage = `Issue encountered while parsing device "${value.name}" in the device configuration file devices.json: ${error.message}`;
        this.logger.error(errormessage);
        throw new Error(errormessage);
      }
    });

    return devices;
  }

  getDevices() {
    return this.devices;
  }
}
