/* eslint-disable @typescript-eslint/naming-convention */
import { Service } from 'typedi';
import UserDefineKey from '../library/FirmwareBuilder/Enum/UserDefineKey';
import UserDefineOptionGroup from '../models/enum/UserDefineOptionGroup';
import UserDefine from '../models/UserDefine';
import DeviceService from '../services/Device';

@Service()
export default class TargetUserDefinesFactory {
  constructor(private deviceService: DeviceService) {}

  build(target: string): UserDefine[] {
    const device = this.deviceService.getDevices().find((item) => {
      return item.targets.find((t) => t.name === target);
    });

    const userDefines = device?.userDefines.map(
      (key): UserDefine => {
        switch (key) {
          // BINDING PHRASE
          case UserDefineKey.BINDING_PHRASE:
            return UserDefine.Text(key, '', true, true);
          // Regulatory domains
          case UserDefineKey.REGULATORY_DOMAIN_AU_915:
            return UserDefine.Boolean(
              key,
              false,
              UserDefineOptionGroup.RegulatoryDomain900
            );
          case UserDefineKey.REGULATORY_DOMAIN_EU_868:
            return UserDefine.Boolean(
              key,
              false,
              UserDefineOptionGroup.RegulatoryDomain900
            );
          case UserDefineKey.REGULATORY_DOMAIN_IN_866:
            return UserDefine.Boolean(
              key,
              false,
              UserDefineOptionGroup.RegulatoryDomain900
            );
          case UserDefineKey.REGULATORY_DOMAIN_AU_433:
            return UserDefine.Boolean(key);
          case UserDefineKey.REGULATORY_DOMAIN_EU_433:
            return UserDefine.Boolean(key);
          case UserDefineKey.REGULATORY_DOMAIN_FCC_915:
            return UserDefine.Boolean(
              key,
              false,
              UserDefineOptionGroup.RegulatoryDomain900
            );
          case UserDefineKey.REGULATORY_DOMAIN_ISM_2400:
            return UserDefine.Boolean(
              key,
              true,
              UserDefineOptionGroup.RegulatoryDomain2400
            );
          case UserDefineKey.REGULATORY_DOMAIN_EU_CE_2400:
            return UserDefine.Boolean(
              key,
              true,
              UserDefineOptionGroup.RegulatoryDomain2400
            );
          // Hybrid switches
          case UserDefineKey.HYBRID_SWITCHES_8:
            return UserDefine.Boolean(key, true);
          case UserDefineKey.ENABLE_TELEMETRY:
            return UserDefine.Boolean(key);
          case UserDefineKey.TLM_REPORT_INTERVAL_MS:
            return UserDefine.Text(key, '320LU');
          // Performance options
          case UserDefineKey.FAST_SYNC:
            return UserDefine.Boolean(key);
          case UserDefineKey.R9M_UNLOCK_HIGHER_POWER:
            return UserDefine.Boolean(key);
          case UserDefineKey.UNLOCK_HIGHER_POWER:
            return UserDefine.Boolean(key, true);
          case UserDefineKey.USE_DIVERSITY:
            return UserDefine.Boolean(key);
          case UserDefineKey.NO_SYNC_ON_ARM:
            return UserDefine.Boolean(key);
          case UserDefineKey.ARM_CHANNEL:
            return UserDefine.Enum(
              key,
              ['AUX1', 'AUX2', 'AUX3', 'AUX4', 'AUX5', 'AUX6'],
              'AUX1'
            );
          case UserDefineKey.FEATURE_OPENTX_SYNC:
            return UserDefine.Boolean(key, true);
          case UserDefineKey.FEATURE_OPENTX_SYNC_AUTOTUNE:
            return UserDefine.Boolean(key);
          case UserDefineKey.LOCK_ON_FIRST_CONNECTION:
            return UserDefine.Boolean(key, true);
          case UserDefineKey.LOCK_ON_50HZ:
            return UserDefine.Boolean(key);
          // Compatibility options
          case UserDefineKey.USE_UART2:
            return UserDefine.Boolean(key);
          case UserDefineKey.UART_INVERTED:
            return UserDefine.Boolean(key, true);
          case UserDefineKey.USE_R9MM_R9MINI_SBUS:
            return UserDefine.Boolean(key);
          case UserDefineKey.RCVR_UART_BAUD:
            return UserDefine.Text(key, '420000');
          case UserDefineKey.RCVR_INVERT_TX:
            return UserDefine.Boolean(key);
          // Other options
          case UserDefineKey.BLE_HID_JOYSTICK:
            return UserDefine.Boolean(key);
          case UserDefineKey.USE_ESP8266_BACKPACK:
            return UserDefine.Boolean(key, true);
          case UserDefineKey.USE_TX_BACKPACK:
            return UserDefine.Boolean(key);
          case UserDefineKey.JUST_BEEP_ONCE:
            return UserDefine.Boolean(key);
          case UserDefineKey.DISABLE_ALL_BEEPS:
            return UserDefine.Boolean(key);
          case UserDefineKey.DISABLE_STARTUP_BEEP:
            return UserDefine.Boolean(key);
          case UserDefineKey.MY_STARTUP_MELODY:
            return UserDefine.Text(key);
          case UserDefineKey.USE_500HZ:
            return UserDefine.Boolean(key);
          case UserDefineKey.USE_DYNAMIC_POWER:
            return UserDefine.Boolean(key);
          case UserDefineKey.WS2812_IS_GRB:
            return UserDefine.Boolean(key);
          // Network
          case UserDefineKey.HOME_WIFI_SSID:
            return UserDefine.Text(key, '', false, true);
          case UserDefineKey.HOME_WIFI_PASSWORD:
            return UserDefine.Text(key, '', false, true);
          case UserDefineKey.AUTO_WIFI_ON_BOOT:
            return UserDefine.Boolean(key);
          case UserDefineKey.AUTO_WIFI_ON_INTERVAL:
            return UserDefine.Text(key, '60', true);
          case UserDefineKey.DVR_START_STOP_CHANNEL:
            return UserDefine.Enum(
              key,
              ['AUX1', 'AUX2', 'AUX3', 'AUX4', 'AUX5', 'AUX6'],
              'AUX6'
            );
          default:
            throw new Error(`User Define ${key} is not known`);
        }
      }
    );

    if (device === undefined) {
      throw new Error(`device not found for target ${target}`);
    }

    return userDefines || [];
  }
}
