import { Service } from 'typedi';
import { LoggerService } from '../../logger';
import Device from '../../models/Device';
import Target from '../../models/Target';
import DeviceJSON from '../../../../../devices.json';
import FlashingMethod from '../../models/enum/FlashingMethod';
import UserDefineKey from '../../library/FirmwareBuilder/Enum/UserDefineKey';

export interface IDevices {
  getDevices(): Device[];
}

@Service()
export default class DeviceService implements IDevices {
  devices: Device[];

  constructor(private logger: LoggerService) {
    this.devices = this.loadDevices();
  }

  flashingMethodToEnum(flashingMethod: string): FlashingMethod | null {
    switch (flashingMethod.toUpperCase()) {
      case 'BETAFLIGHTPASSTHROUGH':
        return FlashingMethod.BetaflightPassthrough;
      case 'DFU':
        return FlashingMethod.DFU;
      case 'STLINK':
        return FlashingMethod.STLink;
      case 'STOCK_BL':
        return FlashingMethod.Stock_BL;
      case 'UART':
        return FlashingMethod.UART;
      case 'WIFI':
        return FlashingMethod.WIFI;
      default:
        return null;
    }

    return null;
  }

  userDefineToEnum(userDefine: string): UserDefineKey | null {
    switch (userDefine.toUpperCase()) {
      // BINDING PHRASE
      case 'BINDING_PHRASE':
        return UserDefineKey.BINDING_PHRASE;
      // Regulatory domains
      case 'REGULATORY_DOMAIN_AU_915':
        return UserDefineKey.REGULATORY_DOMAIN_AU_915;
      case 'REGULATORY_DOMAIN_EU_868':
        return UserDefineKey.REGULATORY_DOMAIN_EU_868;
      case 'REGULATORY_DOMAIN_IN_866':
        return UserDefineKey.REGULATORY_DOMAIN_IN_866;
      case 'REGULATORY_DOMAIN_AU_433':
        return UserDefineKey.REGULATORY_DOMAIN_AU_433;
      case 'REGULATORY_DOMAIN_EU_433':
        return UserDefineKey.REGULATORY_DOMAIN_EU_433;
      case 'REGULATORY_DOMAIN_FCC_915':
        return UserDefineKey.REGULATORY_DOMAIN_FCC_915;
      case 'REGULATORY_DOMAIN_ISM_2400':
        return UserDefineKey.REGULATORY_DOMAIN_ISM_2400;
      // Hybrid switches
      case 'HYBRID_SWITCHES_8':
        return UserDefineKey.HYBRID_SWITCHES_8;
      case 'ENABLE_TELEMETRY':
        return UserDefineKey.ENABLE_TELEMETRY;
      case 'TLM_REPORT_INTERVAL_MS':
        return UserDefineKey.TLM_REPORT_INTERVAL_MS;
      // Performance options
      case 'FAST_SYNC':
        return UserDefineKey.FAST_SYNC;
      case 'R9M_UNLOCK_HIGHER_POWER':
        return UserDefineKey.R9M_UNLOCK_HIGHER_POWER;
      case 'UNLOCK_HIGHER_POWER':
        return UserDefineKey.UNLOCK_HIGHER_POWER;
      case 'USE_DIVERSITY':
        return UserDefineKey.USE_DIVERSITY;
      case 'NO_SYNC_ON_ARM':
        return UserDefineKey.NO_SYNC_ON_ARM;
      case 'ARM_CHANNEL':
        return UserDefineKey.ARM_CHANNEL;
      case 'FEATURE_OPENTX_SYNC':
        return UserDefineKey.FEATURE_OPENTX_SYNC;
      case 'FEATURE_OPENTX_SYNC_AUTOTUNE':
        return UserDefineKey.FEATURE_OPENTX_SYNC_AUTOTUNE;
      case 'LOCK_ON_FIRST_CONNECTION':
        return UserDefineKey.LOCK_ON_FIRST_CONNECTION;
      case 'LOCK_ON_50HZ':
        return UserDefineKey.LOCK_ON_50HZ;
      // Compatibility options
      case 'USE_UART2':
        return UserDefineKey.USE_UART2;
      case 'UART_INVERTED':
        return UserDefineKey.UART_INVERTED;
      case 'USE_R9MM_R9MINI_SBUS':
        return UserDefineKey.USE_R9MM_R9MINI_SBUS;
      // Other options
      case 'BLE_HID_JOYSTICK':
        return UserDefineKey.BLE_HID_JOYSTICK;
      case 'USE_ESP8266_BACKPACK':
        return UserDefineKey.USE_ESP8266_BACKPACK;
      case 'JUST_BEEP_ONCE':
        return UserDefineKey.JUST_BEEP_ONCE;
      case 'DISABLE_STARTUP_BEEP':
        return UserDefineKey.DISABLE_STARTUP_BEEP;
      case 'MY_STARTUP_MELODY':
        return UserDefineKey.MY_STARTUP_MELODY;
      case 'USE_500HZ':
        return UserDefineKey.USE_500HZ;
      case 'USE_DYNAMIC_POWER':
        return UserDefineKey.USE_DYNAMIC_POWER;
      case 'WS2812_IS_GRB':
        return UserDefineKey.WS2812_IS_GRB;
      // Network
      case 'HOME_WIFI_SSID':
        return UserDefineKey.HOME_WIFI_SSID;
      case 'HOME_WIFI_PASSWORD':
        return UserDefineKey.HOME_WIFI_PASSWORD;
      case 'AUTO_WIFI_ON_BOOT':
        return UserDefineKey.AUTO_WIFI_ON_BOOT;
      case 'AUTO_WIFI_ON_INTERVAL':
        return UserDefineKey.AUTO_WIFI_ON_INTERVAL;
      default:
        return null;
    }
  }

  loadTargets(targets: { name: string; flashingMethod: string }[]): Target[] {
    const result: Target[] = [];

    targets.forEach((item) => {
      if (!item.name) {
        throw new Error(`target must have a name property`);
      }
      const flashingMethod = this.flashingMethodToEnum(item.flashingMethod);
      if (!flashingMethod) {
        throw new Error(
          `error parsing target "${item.name}": "${item.flashingMethod}" is not a valid flashing method`
        );
      }

      result.push({
        name: item.name,
        flashingMethod,
      });
    });

    return result;
  }

  loadUserDefines(userDefines: string[]): UserDefineKey[] {
    const result: UserDefineKey[] = [];

    userDefines.forEach((item) => {
      const userDefine = this.userDefineToEnum(item);
      if (!userDefine) {
        throw new Error(`"${item}" is not a valid User Define`);
      }
      result.push(userDefine);
    });

    return result;
  }

  loadDevices(): Device[] {
    return DeviceJSON.devices.map((value) => {
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

        const targets = this.loadTargets(value.targets);
        const userDefines = this.loadUserDefines(value.userDefines);

        const device: Device = {
          id: value.name,
          name: value.name,
          category: value.category,
          targets,
          userDefines,
          wikiUrl: value.wikiUrl,
        };

        return device;
      } catch (error: any) {
        const errormessage = `Issue encountered while parsing device "${value.name}" in the device configuration file devices.json: ${error.message}`;
        this.logger.error(errormessage);
        throw new Error(errormessage);
      }
    });
  }

  getDevices() {
    return this.devices;
  }
}
