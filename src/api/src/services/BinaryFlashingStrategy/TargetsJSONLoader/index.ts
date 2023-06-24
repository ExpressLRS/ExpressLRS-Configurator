import fs from 'fs';
import { LoggerService } from '../../../logger';

export interface DeviceDescription {
  product_name: string;
  lua_name?: string;
  layout_file?: string;
  upload_methods: string[];
  platform: string;
  firmware: string;
  // @TODO: add this to the upstream firmware repository
  verified_hardware: string;
  features?: string[];
  prior_target_name: string;
  overlay?: { [key: string]: string };
  frequency?: number;
  type?: string;
}

export type TargetsJSONRaw = {
  [manufacturer: string]: {
    [key in string]:
      | {
          [key: string]: DeviceDescription;
        }
      | string;
  };
};

export class TargetsJSONLoader {
  constructor(private logger: LoggerService) {}

  private async getTargets(targetsJsonPath: string) {
    return JSON.parse(
      await fs.promises.readFile(targetsJsonPath, 'utf-8')
    ) as TargetsJSONRaw;
  }

  async loadDeviceDescriptions(targetsJsonPath: string) {
    const data = await this.getTargets(targetsJsonPath);
    const result: {
      [id: string]: {
        category: string;
        config: DeviceDescription;
      };
    } = {};
    Object.keys(data).forEach((categoryKey) => {
      if (typeof data[categoryKey].name !== 'string') {
        throw new Error(`no category name for ${categoryKey}`);
      }
      const categoryName: string = data[categoryKey].name as string;

      const subTypes = data[categoryKey];
      Object.keys(subTypes).forEach((subTypeKey) => {
        if (subTypeKey === 'name') {
          return;
        }
        const configs: {
          [key: string]: DeviceDescription;
        } = data[categoryKey][subTypeKey] as {
          [key: string]: DeviceDescription;
        };
        Object.keys(configs).forEach((deviceDescriptionKey) => {
          const id = `${categoryKey}.${subTypeKey}.${deviceDescriptionKey}`;
          const config = configs[deviceDescriptionKey];

          if (this.validConfig(id, config)) {
            const [type, frequency] = subTypeKey.split('_');
            config.type = type.toUpperCase();
            const frequencyNumber = parseInt(frequency, 10);

            let category = categoryName;

            if (frequencyNumber) {
              config.frequency = frequencyNumber;
              category = `${categoryName} ${this.frequencyFormatter(
                config.frequency
              )}`;
            }

            result[id] = {
              category,
              config,
            };
          }
        });
      });
    });
    return result;
  }

  private validConfig(id: string, config: DeviceDescription) {
    let missingFields = '';
    const logMissingField = (field: string) => {
      if (missingFields.length > 0) {
        missingFields += ', ';
      }
      missingFields += field;
    };
    let valid = true;
    if (!config.firmware) {
      logMissingField('firmware');
      valid = false;
    }
    if (!config.platform) {
      logMissingField('platform');
      valid = false;
    }
    if (!config.product_name) {
      logMissingField('product_name');
      valid = false;
    }
    if (!config.upload_methods) {
      logMissingField('upload_methods');
      valid = false;
    }

    if (!valid) {
      this.logger.error(
        `${id} in targets file is not a valid Config, missing fields ${missingFields}`
      );
    }
    return valid;
  }

  private frequencyFormatter(frequency: number) {
    if (frequency >= 1000) {
      return `${(frequency / 1000).toFixed(1)} GHz`;
    }
    return `${frequency} MHz`;
  }
}
