import UserDefineKey from '../library/FirmwareBuilder/Enum/UserDefineKey';
import UserDefineOptionGroup from '../models/enum/UserDefineOptionGroup';
import UserDefine from '../models/UserDefine';

export default class TargetUserDefinesFactory {
  constructor(private readonly platform: string | null) {}

  build(userDefineKey: UserDefineKey): UserDefine {
    switch (userDefineKey) {
      // BINDING PHRASE
      case UserDefineKey.BINDING_PHRASE:
        return UserDefine.Text(UserDefineKey.BINDING_PHRASE, '', true, true);
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
          true,
          UserDefineOptionGroup.RegulatoryDomain2400
        );
      case UserDefineKey.REGULATORY_DOMAIN_EU_CE_2400:
        return UserDefine.Boolean(
          UserDefineKey.REGULATORY_DOMAIN_EU_CE_2400,
          true,
          UserDefineOptionGroup.RegulatoryDomain2400
        );
      // Hybrid switches
      case UserDefineKey.TLM_REPORT_INTERVAL_MS:
        return UserDefine.Text(UserDefineKey.TLM_REPORT_INTERVAL_MS, '240LU');
      // Performance options
      case UserDefineKey.UNLOCK_HIGHER_POWER:
        return UserDefine.Boolean(UserDefineKey.UNLOCK_HIGHER_POWER, false);
      case UserDefineKey.LOCK_ON_FIRST_CONNECTION:
        return UserDefine.Boolean(UserDefineKey.LOCK_ON_FIRST_CONNECTION, true);
      // Compatibility options
      case UserDefineKey.UART_INVERTED:
        return UserDefine.Boolean(UserDefineKey.UART_INVERTED, true);
      case UserDefineKey.USE_R9MM_R9MINI_SBUS:
        return UserDefine.Boolean(UserDefineKey.USE_R9MM_R9MINI_SBUS);
      case UserDefineKey.RCVR_UART_BAUD:
        return UserDefine.Text(UserDefineKey.RCVR_UART_BAUD, '420000');
      case UserDefineKey.RCVR_INVERT_TX:
        return UserDefine.Boolean(UserDefineKey.RCVR_INVERT_TX);
      // Other options
      case UserDefineKey.JUST_BEEP_ONCE:
        return UserDefine.Boolean(UserDefineKey.JUST_BEEP_ONCE);
      case UserDefineKey.DISABLE_ALL_BEEPS:
        return UserDefine.Boolean(UserDefineKey.DISABLE_ALL_BEEPS);
      case UserDefineKey.DISABLE_STARTUP_BEEP:
        return UserDefine.Boolean(UserDefineKey.DISABLE_STARTUP_BEEP);
      case UserDefineKey.MY_STARTUP_MELODY:
        return UserDefine.Text(UserDefineKey.MY_STARTUP_MELODY);
      // Network
      case UserDefineKey.HOME_WIFI_SSID:
        return UserDefine.Text(UserDefineKey.HOME_WIFI_SSID, '', false, true);
      case UserDefineKey.HOME_WIFI_PASSWORD:
        return UserDefine.Text(
          UserDefineKey.HOME_WIFI_PASSWORD,
          '',
          false,
          true
        );
      case UserDefineKey.AUTO_WIFI_ON_INTERVAL:
        return UserDefine.Text(UserDefineKey.AUTO_WIFI_ON_INTERVAL, '60', true);
      case UserDefineKey.RX_AS_TX:
        let rxAxTxTypes: string[] = [];
        if (this.platform === 'esp32') {
          rxAxTxTypes = ['internal', 'external'];
        }
        if (this.platform === 'esp8285') {
          rxAxTxTypes = ['internal'];
        }
        return UserDefine.Enum(UserDefineKey.RX_AS_TX, rxAxTxTypes, 'internal');
      default:
        throw new Error(`User Define ${userDefineKey} is not known`);
    }
  }
}
