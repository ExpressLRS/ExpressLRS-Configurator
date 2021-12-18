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
      (userDefine): UserDefine => {
        switch (userDefine) {
          // BINDING PHRASE
          case UserDefineKey.BINDING_PHRASE:
            return UserDefine.Text(
              UserDefineKey.BINDING_PHRASE,
              '',
              true,
              true
            );
          // Regulatory domains
          case UserDefineKey.REGULATORY_DOMAIN_AU_915:
            return UserDefine.Boolean(
              UserDefineKey.REGULATORY_DOMAIN_AU_915,
              false,
              UserDefineOptionGroup.RegulatoryDomain900
            );
          case UserDefineKey.REGULATORY_DOMAIN_EU_868:
            return UserDefine.Boolean(
              UserDefineKey.REGULATORY_DOMAIN_EU_868,
              false,
              UserDefineOptionGroup.RegulatoryDomain900
            );
          case UserDefineKey.REGULATORY_DOMAIN_IN_866:
            return UserDefine.Boolean(
              UserDefineKey.REGULATORY_DOMAIN_IN_866,
              false,
              UserDefineOptionGroup.RegulatoryDomain900
            );
          case UserDefineKey.REGULATORY_DOMAIN_AU_433:
            return UserDefine.Boolean(UserDefineKey.REGULATORY_DOMAIN_AU_433);
          case UserDefineKey.REGULATORY_DOMAIN_EU_433:
            return UserDefine.Boolean(UserDefineKey.REGULATORY_DOMAIN_EU_433);
          case UserDefineKey.REGULATORY_DOMAIN_FCC_915:
            return UserDefine.Boolean(
              UserDefineKey.REGULATORY_DOMAIN_FCC_915,
              false,
              UserDefineOptionGroup.RegulatoryDomain900
            );
          case UserDefineKey.REGULATORY_DOMAIN_ISM_2400:
            return UserDefine.Boolean(
              UserDefineKey.REGULATORY_DOMAIN_ISM_2400,
              true
            );
          // Hybrid switches
          case UserDefineKey.HYBRID_SWITCHES_8:
            return UserDefine.Boolean(UserDefineKey.HYBRID_SWITCHES_8, true);
          case UserDefineKey.ENABLE_TELEMETRY:
            return UserDefine.Boolean(UserDefineKey.ENABLE_TELEMETRY);
          case UserDefineKey.TLM_REPORT_INTERVAL_MS:
            return UserDefine.Text(
              UserDefineKey.TLM_REPORT_INTERVAL_MS,
              '320LU'
            );
          // Performance options
          case UserDefineKey.FAST_SYNC:
            return UserDefine.Boolean(UserDefineKey.FAST_SYNC);
          case UserDefineKey.R9M_UNLOCK_HIGHER_POWER:
            return UserDefine.Boolean(UserDefineKey.R9M_UNLOCK_HIGHER_POWER);
          case UserDefineKey.UNLOCK_HIGHER_POWER:
            return UserDefine.Boolean(UserDefineKey.UNLOCK_HIGHER_POWER, true);
          case UserDefineKey.USE_DIVERSITY:
            return UserDefine.Boolean(UserDefineKey.USE_DIVERSITY);
          case UserDefineKey.NO_SYNC_ON_ARM:
            return UserDefine.Boolean(UserDefineKey.NO_SYNC_ON_ARM);
          case UserDefineKey.ARM_CHANNEL:
            return UserDefine.Enum(
              UserDefineKey.ARM_CHANNEL,
              ['AUX1', 'AUX2', 'AUX3', 'AUX4', 'AUX5', 'AUX6'],
              'AUX1'
            );
          case UserDefineKey.FEATURE_OPENTX_SYNC:
            return UserDefine.Boolean(UserDefineKey.FEATURE_OPENTX_SYNC, true);
          case UserDefineKey.FEATURE_OPENTX_SYNC_AUTOTUNE:
            return UserDefine.Boolean(
              UserDefineKey.FEATURE_OPENTX_SYNC_AUTOTUNE
            );
          case UserDefineKey.LOCK_ON_FIRST_CONNECTION:
            return UserDefine.Boolean(
              UserDefineKey.LOCK_ON_FIRST_CONNECTION,
              true
            );
          case UserDefineKey.LOCK_ON_50HZ:
            return UserDefine.Boolean(UserDefineKey.LOCK_ON_50HZ);
          // Compatibility options
          case UserDefineKey.USE_UART2:
            return UserDefine.Boolean(UserDefineKey.USE_UART2);
          case UserDefineKey.UART_INVERTED:
            return UserDefine.Boolean(UserDefineKey.UART_INVERTED, true);
          case UserDefineKey.USE_R9MM_R9MINI_SBUS:
            return UserDefine.Boolean(UserDefineKey.USE_R9MM_R9MINI_SBUS);
          case UserDefineKey.RCVR_UART_BAUD:
            return UserDefine.Text(UserDefineKey.RCVR_UART_BAUD, '420000');
          case UserDefineKey.RCVR_INVERT_TX:
            return UserDefine.Boolean(UserDefineKey.RCVR_INVERT_TX);
          // Other options
          case UserDefineKey.BLE_HID_JOYSTICK:
            return UserDefine.Boolean(UserDefineKey.BLE_HID_JOYSTICK);
          case UserDefineKey.USE_ESP8266_BACKPACK:
            return UserDefine.Boolean(UserDefineKey.USE_ESP8266_BACKPACK, true);
          case UserDefineKey.USE_TX_BACKPACK:
            return UserDefine.Boolean(UserDefineKey.USE_TX_BACKPACK);
          case UserDefineKey.JUST_BEEP_ONCE:
            return UserDefine.Boolean(UserDefineKey.JUST_BEEP_ONCE);
          case UserDefineKey.DISABLE_ALL_BEEPS:
            return UserDefine.Boolean(UserDefineKey.DISABLE_ALL_BEEPS);
          case UserDefineKey.DISABLE_STARTUP_BEEP:
            return UserDefine.Boolean(UserDefineKey.DISABLE_STARTUP_BEEP);
          case UserDefineKey.MY_STARTUP_MELODY:
            return UserDefine.Text(UserDefineKey.MY_STARTUP_MELODY);
          case UserDefineKey.USE_500HZ:
            return UserDefine.Boolean(UserDefineKey.USE_500HZ);
          case UserDefineKey.USE_DYNAMIC_POWER:
            return UserDefine.Boolean(UserDefineKey.USE_DYNAMIC_POWER);
          case UserDefineKey.WS2812_IS_GRB:
            return UserDefine.Boolean(UserDefineKey.WS2812_IS_GRB);
          // Network
          case UserDefineKey.HOME_WIFI_SSID:
            return UserDefine.Text(
              UserDefineKey.HOME_WIFI_SSID,
              '',
              false,
              true
            );
          case UserDefineKey.HOME_WIFI_PASSWORD:
            return UserDefine.Text(
              UserDefineKey.HOME_WIFI_PASSWORD,
              '',
              false,
              true
            );
          case UserDefineKey.AUTO_WIFI_ON_BOOT:
            return UserDefine.Boolean(UserDefineKey.AUTO_WIFI_ON_BOOT);
          case UserDefineKey.AUTO_WIFI_ON_INTERVAL:
            return UserDefine.Text(
              UserDefineKey.AUTO_WIFI_ON_INTERVAL,
              '20',
              true
            );
          default:
            throw new Error(`User Define ${userDefine} is not known`);
        }
      }
    );

    if (device === undefined) {
      throw new Error(`device not found for target ${target}`);
    }

    return userDefines || [];
  }
}
