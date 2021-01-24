import {UserDefineCategory} from './Enum/UserDefineCategory';
import {UserDefineKey} from './Enum/UserDefineKey';
import {DeviceTarget} from './Enum/DeviceTarget';

export type UserDefinesByCategory = {
  [key in UserDefineCategory]: UserDefineKey[];
};

export type UserDefinesByTarget = {
  [key in DeviceTarget]: UserDefinesByCategory;
};

export default class UserDefineConstraints {
  private readonly data: UserDefinesByTarget;

  constructor() {
    const Frsky_TX_R9M = {
      [UserDefineCategory.RegulatoryDomains]: [
        UserDefineKey.REGULATORY_DOMAIN_AU_915,
        UserDefineKey.REGULATORY_DOMAIN_EU_868,
        UserDefineKey.REGULATORY_DOMAIN_FCC_915
      ],
      [UserDefineCategory.BindingPhrase]: [
        UserDefineKey.BINDING_PHRASE,
      ],
      [UserDefineCategory.HybridSwitches]: [
        UserDefineKey.HYBRID_SWITCHES_8,
      ],
      [UserDefineCategory.PerformanceOptions]: [
        UserDefineKey.NO_SYNC_ON_ARM,
        UserDefineKey.ARM_CHANNEL,
        UserDefineKey.FEATURE_OPENTX_SYNC,
        UserDefineKey.FEATURE_OPENTX_SYNC_AUTOTUNE,
        UserDefineKey.LOCK_ON_FIRST_CONNECTION,
        UserDefineKey.LOCK_ON_50HZ,
      ],
      [UserDefineCategory.CompatibilityOptions]: [
        UserDefineKey.UART_INVERTED,
        UserDefineKey.R9M_UNLOCK_HIGHER_POWER,
      ],
      [UserDefineCategory.OtherOptions]: [
        UserDefineKey.AUTO_WIFI_ON_BOOT,
        UserDefineKey.USE_ESP8266_BACKPACK,
        UserDefineKey.JUST_BEEP_ONCE,
        UserDefineKey.MY_STARTUP_MELODY,
      ],
    };
    const Frsky_TX_R9M_LITE = {
      [UserDefineCategory.RegulatoryDomains]: [
        UserDefineKey.REGULATORY_DOMAIN_AU_915,
        UserDefineKey.REGULATORY_DOMAIN_EU_868,
        UserDefineKey.REGULATORY_DOMAIN_FCC_915
      ],
      [UserDefineCategory.BindingPhrase]: [
        UserDefineKey.BINDING_PHRASE,
      ],
      [UserDefineCategory.HybridSwitches]: [
        UserDefineKey.HYBRID_SWITCHES_8,
      ],
      [UserDefineCategory.PerformanceOptions]: [
        UserDefineKey.NO_SYNC_ON_ARM,
        UserDefineKey.ARM_CHANNEL,
        UserDefineKey.LOCK_ON_FIRST_CONNECTION,
        UserDefineKey.LOCK_ON_50HZ,
      ],
      [UserDefineCategory.CompatibilityOptions]: [
        UserDefineKey.UART_INVERTED,
        UserDefineKey.R9M_UNLOCK_HIGHER_POWER,
      ],
      [UserDefineCategory.OtherOptions]: [
        UserDefineKey.AUTO_WIFI_ON_BOOT,
        UserDefineKey.USE_ESP8266_BACKPACK,
        UserDefineKey.JUST_BEEP_ONCE,
        UserDefineKey.MY_STARTUP_MELODY,
      ],
    };
    const Frsky_TX_R9M_LITE_PRO = {
      [UserDefineCategory.RegulatoryDomains]: [
        UserDefineKey.REGULATORY_DOMAIN_AU_915,
        UserDefineKey.REGULATORY_DOMAIN_EU_868,
        UserDefineKey.REGULATORY_DOMAIN_FCC_915
      ],
      [UserDefineCategory.BindingPhrase]: [
        UserDefineKey.BINDING_PHRASE,
      ],
      [UserDefineCategory.HybridSwitches]: [
        UserDefineKey.HYBRID_SWITCHES_8,
      ],
      [UserDefineCategory.PerformanceOptions]: [
        UserDefineKey.NO_SYNC_ON_ARM,
        UserDefineKey.ARM_CHANNEL,
        UserDefineKey.LOCK_ON_FIRST_CONNECTION,
        UserDefineKey.LOCK_ON_50HZ,
      ],
      [UserDefineCategory.CompatibilityOptions]: [
        UserDefineKey.UART_INVERTED,
        UserDefineKey.R9M_UNLOCK_HIGHER_POWER,
      ],
      [UserDefineCategory.OtherOptions]: [
        UserDefineKey.AUTO_WIFI_ON_BOOT,
        UserDefineKey.USE_ESP8266_BACKPACK,
        UserDefineKey.JUST_BEEP_ONCE,
        UserDefineKey.MY_STARTUP_MELODY,
      ],
    };
    const Frsky_RX_R9MM_R9MINI = {
      [UserDefineCategory.RegulatoryDomains]: [
        UserDefineKey.REGULATORY_DOMAIN_AU_915,
        UserDefineKey.REGULATORY_DOMAIN_EU_868,
        UserDefineKey.REGULATORY_DOMAIN_FCC_915
      ],
      [UserDefineCategory.BindingPhrase]: [
        UserDefineKey.BINDING_PHRASE,
      ],
      [UserDefineCategory.HybridSwitches]: [
        UserDefineKey.HYBRID_SWITCHES_8,
      ],
      [UserDefineCategory.PerformanceOptions]: [
        UserDefineKey.FAST_SYNC,
        UserDefineKey.LOCK_ON_FIRST_CONNECTION,
        UserDefineKey.LOCK_ON_50HZ,
      ],
      [UserDefineCategory.CompatibilityOptions]: [
        UserDefineKey.UART_INVERTED,
      ],
      [UserDefineCategory.OtherOptions]: [],
    };
    const Frsky_RX_R9SLIMPLUS = {
      [UserDefineCategory.RegulatoryDomains]: [
        UserDefineKey.REGULATORY_DOMAIN_AU_915,
        UserDefineKey.REGULATORY_DOMAIN_EU_868,
        UserDefineKey.REGULATORY_DOMAIN_FCC_915
      ],
      [UserDefineCategory.BindingPhrase]: [
        UserDefineKey.BINDING_PHRASE,
      ],
      [UserDefineCategory.HybridSwitches]: [
        UserDefineKey.HYBRID_SWITCHES_8,
      ],
      [UserDefineCategory.PerformanceOptions]: [
        UserDefineKey.FAST_SYNC,
        UserDefineKey.LOCK_ON_FIRST_CONNECTION,
        UserDefineKey.LOCK_ON_50HZ,
      ],
      [UserDefineCategory.CompatibilityOptions]: [
        UserDefineKey.UART_INVERTED,
      ],
      [UserDefineCategory.OtherOptions]: [],
    };
    const Frsky_RX_R9MX = {
      [UserDefineCategory.RegulatoryDomains]: [
        UserDefineKey.REGULATORY_DOMAIN_AU_915,
        UserDefineKey.REGULATORY_DOMAIN_EU_868,
        UserDefineKey.REGULATORY_DOMAIN_FCC_915
      ],
      [UserDefineCategory.BindingPhrase]: [
        UserDefineKey.BINDING_PHRASE,
      ],
      [UserDefineCategory.HybridSwitches]: [
        UserDefineKey.HYBRID_SWITCHES_8,
      ],
      [UserDefineCategory.PerformanceOptions]: [
        UserDefineKey.FAST_SYNC,
        UserDefineKey.LOCK_ON_FIRST_CONNECTION,
        UserDefineKey.LOCK_ON_50HZ,
      ],
      [UserDefineCategory.CompatibilityOptions]: [
        UserDefineKey.UART_INVERTED,
      ],
      [UserDefineCategory.OtherOptions]: [],
    };
    const Jumper_RX_R900MINI = {
      [UserDefineCategory.RegulatoryDomains]: [
        UserDefineKey.REGULATORY_DOMAIN_AU_915,
        UserDefineKey.REGULATORY_DOMAIN_EU_868,
        UserDefineKey.REGULATORY_DOMAIN_FCC_915
      ],
      [UserDefineCategory.BindingPhrase]: [
        UserDefineKey.BINDING_PHRASE,
      ],
      [UserDefineCategory.HybridSwitches]: [
        UserDefineKey.HYBRID_SWITCHES_8,
      ],
      [UserDefineCategory.PerformanceOptions]: [
        UserDefineKey.FAST_SYNC,
        UserDefineKey.LOCK_ON_FIRST_CONNECTION,
        UserDefineKey.LOCK_ON_50HZ,
      ],
      [UserDefineCategory.CompatibilityOptions]: [
        UserDefineKey.UART_INVERTED,
      ],
      [UserDefineCategory.OtherOptions]: [],
    };
    const DIY_900_TX_TTGO_V1_SX127x = {
      [UserDefineCategory.RegulatoryDomains]: [
        UserDefineKey.REGULATORY_DOMAIN_AU_915,
        UserDefineKey.REGULATORY_DOMAIN_EU_868,
        UserDefineKey.REGULATORY_DOMAIN_FCC_915
      ],
      [UserDefineCategory.BindingPhrase]: [
        UserDefineKey.BINDING_PHRASE,
      ],
      [UserDefineCategory.HybridSwitches]: [
        UserDefineKey.HYBRID_SWITCHES_8,
      ],
      [UserDefineCategory.PerformanceOptions]: [
        UserDefineKey.NO_SYNC_ON_ARM,
        UserDefineKey.ARM_CHANNEL,
        UserDefineKey.FEATURE_OPENTX_SYNC_AUTOTUNE,
        UserDefineKey.FEATURE_OPENTX_SYNC,
        UserDefineKey.LOCK_ON_FIRST_CONNECTION,
        UserDefineKey.LOCK_ON_50HZ,
      ],
      [UserDefineCategory.CompatibilityOptions]: [],
      [UserDefineCategory.OtherOptions]: [],
    };
    const DIY_900_TX_TTGO_V2_SX127x = {
      [UserDefineCategory.RegulatoryDomains]: [
        UserDefineKey.REGULATORY_DOMAIN_AU_915,
        UserDefineKey.REGULATORY_DOMAIN_EU_868,
        UserDefineKey.REGULATORY_DOMAIN_FCC_915
      ],
      [UserDefineCategory.BindingPhrase]: [
        UserDefineKey.BINDING_PHRASE,
      ],
      [UserDefineCategory.HybridSwitches]: [
        UserDefineKey.HYBRID_SWITCHES_8,
      ],
      [UserDefineCategory.PerformanceOptions]: [
        UserDefineKey.NO_SYNC_ON_ARM,
        UserDefineKey.FEATURE_OPENTX_SYNC_AUTOTUNE,
        UserDefineKey.FEATURE_OPENTX_SYNC,
        UserDefineKey.ARM_CHANNEL,
        UserDefineKey.LOCK_ON_FIRST_CONNECTION,
        UserDefineKey.LOCK_ON_50HZ,
      ],
      [UserDefineCategory.CompatibilityOptions]: [],
      [UserDefineCategory.OtherOptions]: [],
    };
    const DIY_900_TX_ESP32_SX127x_E19 = {
      [UserDefineCategory.RegulatoryDomains]: [
        UserDefineKey.REGULATORY_DOMAIN_AU_915,
        UserDefineKey.REGULATORY_DOMAIN_EU_868,
        UserDefineKey.REGULATORY_DOMAIN_FCC_915
      ],
      [UserDefineCategory.BindingPhrase]: [
        UserDefineKey.BINDING_PHRASE,
      ],
      [UserDefineCategory.HybridSwitches]: [
        UserDefineKey.HYBRID_SWITCHES_8,
      ],
      [UserDefineCategory.PerformanceOptions]: [
        UserDefineKey.NO_SYNC_ON_ARM,
        UserDefineKey.FEATURE_OPENTX_SYNC_AUTOTUNE,
        UserDefineKey.FEATURE_OPENTX_SYNC,
        UserDefineKey.ARM_CHANNEL,
        UserDefineKey.LOCK_ON_FIRST_CONNECTION,
        UserDefineKey.LOCK_ON_50HZ,
      ],
      [UserDefineCategory.CompatibilityOptions]: [],
      [UserDefineCategory.OtherOptions]: [],
    };
    const DIY_900_TX_ESP32_SX127x_RFM95 = {
      [UserDefineCategory.RegulatoryDomains]: [
        UserDefineKey.REGULATORY_DOMAIN_AU_915,
        UserDefineKey.REGULATORY_DOMAIN_EU_868,
        UserDefineKey.REGULATORY_DOMAIN_FCC_915
      ],
      [UserDefineCategory.BindingPhrase]: [
        UserDefineKey.BINDING_PHRASE,
      ],
      [UserDefineCategory.HybridSwitches]: [
        UserDefineKey.HYBRID_SWITCHES_8,
      ],
      [UserDefineCategory.PerformanceOptions]: [
        UserDefineKey.NO_SYNC_ON_ARM,
        UserDefineKey.FEATURE_OPENTX_SYNC_AUTOTUNE,
        UserDefineKey.FEATURE_OPENTX_SYNC,
        UserDefineKey.ARM_CHANNEL,
        UserDefineKey.LOCK_ON_FIRST_CONNECTION,
        UserDefineKey.LOCK_ON_50HZ,
      ],
      [UserDefineCategory.CompatibilityOptions]: [],
      [UserDefineCategory.OtherOptions]: [],
    };
    const DIY_900_RX_ESP8285_SX127x = {
      [UserDefineCategory.RegulatoryDomains]: [
        UserDefineKey.REGULATORY_DOMAIN_AU_915,
        UserDefineKey.REGULATORY_DOMAIN_EU_868,
        UserDefineKey.REGULATORY_DOMAIN_FCC_915
      ],
      [UserDefineCategory.BindingPhrase]: [
        UserDefineKey.BINDING_PHRASE,
      ],
      [UserDefineCategory.HybridSwitches]: [
        UserDefineKey.HYBRID_SWITCHES_8,
      ],
      [UserDefineCategory.PerformanceOptions]: [
        UserDefineKey.FAST_SYNC,
        UserDefineKey.FEATURE_OPENTX_SYNC_AUTOTUNE,
        UserDefineKey.FEATURE_OPENTX_SYNC,
        UserDefineKey.LOCK_ON_FIRST_CONNECTION,
        UserDefineKey.LOCK_ON_50HZ,
      ],
      [UserDefineCategory.CompatibilityOptions]: [],
      [UserDefineCategory.OtherOptions]: [],
    };

    const DIY_2400_TX_ESP32_SX1280_Mini = {
      [UserDefineCategory.RegulatoryDomains]: [
        UserDefineKey.REGULATORY_DOMAIN_ISM_2400,
      ],
      [UserDefineCategory.BindingPhrase]: [
        UserDefineKey.BINDING_PHRASE,
      ],
      [UserDefineCategory.HybridSwitches]: [
        UserDefineKey.HYBRID_SWITCHES_8,
      ],
      [UserDefineCategory.PerformanceOptions]: [
        UserDefineKey.NO_SYNC_ON_ARM,
        UserDefineKey.ARM_CHANNEL,
        UserDefineKey.FEATURE_OPENTX_SYNC,
        UserDefineKey.FEATURE_OPENTX_SYNC_AUTOTUNE,
        UserDefineKey.LOCK_ON_FIRST_CONNECTION,
        UserDefineKey.LOCK_ON_50HZ,
      ],
      [UserDefineCategory.CompatibilityOptions]: [
        UserDefineKey.UART_INVERTED,
      ],
      [UserDefineCategory.OtherOptions]: [
        UserDefineKey.AUTO_WIFI_ON_BOOT,
        UserDefineKey.JUST_BEEP_ONCE,
        UserDefineKey.MY_STARTUP_MELODY,
      ],
    };
    const DIY_2400_TX_ESP32_SX1280_E28 = {
      [UserDefineCategory.RegulatoryDomains]: [
        UserDefineKey.REGULATORY_DOMAIN_ISM_2400,
      ],
      [UserDefineCategory.BindingPhrase]: [
        UserDefineKey.BINDING_PHRASE,
      ],
      [UserDefineCategory.HybridSwitches]: [
        UserDefineKey.HYBRID_SWITCHES_8,
      ],
      [UserDefineCategory.PerformanceOptions]: [
        UserDefineKey.NO_SYNC_ON_ARM,
        UserDefineKey.ARM_CHANNEL,
        UserDefineKey.FEATURE_OPENTX_SYNC,
        UserDefineKey.FEATURE_OPENTX_SYNC_AUTOTUNE,
        UserDefineKey.LOCK_ON_FIRST_CONNECTION,
        UserDefineKey.LOCK_ON_50HZ,
      ],
      [UserDefineCategory.CompatibilityOptions]: [
        UserDefineKey.UART_INVERTED,
      ],
      [UserDefineCategory.OtherOptions]: [
        UserDefineKey.AUTO_WIFI_ON_BOOT,
        UserDefineKey.JUST_BEEP_ONCE,
        UserDefineKey.MY_STARTUP_MELODY,
      ],
    };
    const DIY_2400_TX_ESP32_SX1280_LORA1280F27 = {
      [UserDefineCategory.RegulatoryDomains]: [
        UserDefineKey.REGULATORY_DOMAIN_ISM_2400,
      ],
      [UserDefineCategory.BindingPhrase]: [
        UserDefineKey.BINDING_PHRASE,
      ],
      [UserDefineCategory.HybridSwitches]: [
        UserDefineKey.HYBRID_SWITCHES_8,
      ],
      [UserDefineCategory.PerformanceOptions]: [
        UserDefineKey.NO_SYNC_ON_ARM,
        UserDefineKey.ARM_CHANNEL,
        UserDefineKey.FEATURE_OPENTX_SYNC,
        UserDefineKey.FEATURE_OPENTX_SYNC_AUTOTUNE,
        UserDefineKey.LOCK_ON_FIRST_CONNECTION,
        UserDefineKey.LOCK_ON_50HZ,
      ],
      [UserDefineCategory.CompatibilityOptions]: [
        UserDefineKey.UART_INVERTED,
      ],
      [UserDefineCategory.OtherOptions]: [
        UserDefineKey.AUTO_WIFI_ON_BOOT,
        UserDefineKey.JUST_BEEP_ONCE,
        UserDefineKey.MY_STARTUP_MELODY,
      ],
    };

    const GHOST_ATTO_2400_RX = {
      [UserDefineCategory.RegulatoryDomains]: [
        UserDefineKey.REGULATORY_DOMAIN_ISM_2400,
      ],
      [UserDefineCategory.BindingPhrase]: [
        UserDefineKey.BINDING_PHRASE,
      ],
      [UserDefineCategory.HybridSwitches]: [
        UserDefineKey.HYBRID_SWITCHES_8,
      ],
      [UserDefineCategory.PerformanceOptions]: [
        UserDefineKey.FAST_SYNC,
        UserDefineKey.LOCK_ON_FIRST_CONNECTION,
        UserDefineKey.LOCK_ON_50HZ,
      ],
      [UserDefineCategory.CompatibilityOptions]: [
        UserDefineKey.UART_INVERTED,
      ],
      [UserDefineCategory.OtherOptions]: [
        UserDefineKey.AUTO_WIFI_ON_BOOT,
        UserDefineKey.JUST_BEEP_ONCE,
        UserDefineKey.MY_STARTUP_MELODY,
      ],
    };
    const DIY_2400_RX_ESP8285_SX1280 = {
      [UserDefineCategory.RegulatoryDomains]: [
        UserDefineKey.REGULATORY_DOMAIN_ISM_2400,
      ],
      [UserDefineCategory.BindingPhrase]: [
        UserDefineKey.BINDING_PHRASE,
      ],
      [UserDefineCategory.HybridSwitches]: [
        UserDefineKey.HYBRID_SWITCHES_8,
      ],
      [UserDefineCategory.PerformanceOptions]: [
        UserDefineKey.FAST_SYNC,
        UserDefineKey.LOCK_ON_FIRST_CONNECTION,
        UserDefineKey.LOCK_ON_50HZ,
      ],
      [UserDefineCategory.CompatibilityOptions]: [
        UserDefineKey.UART_INVERTED,
      ],
      [UserDefineCategory.OtherOptions]: [
        UserDefineKey.AUTO_WIFI_ON_BOOT,
        UserDefineKey.JUST_BEEP_ONCE,
        UserDefineKey.MY_STARTUP_MELODY,
      ],
    };
    const DIY_2400_RX_STM32_CCG_Nano_v0_5 = {
      [UserDefineCategory.RegulatoryDomains]: [
        UserDefineKey.REGULATORY_DOMAIN_ISM_2400,
      ],
      [UserDefineCategory.BindingPhrase]: [
        UserDefineKey.BINDING_PHRASE,
      ],
      [UserDefineCategory.HybridSwitches]: [
        UserDefineKey.HYBRID_SWITCHES_8,
      ],
      [UserDefineCategory.PerformanceOptions]: [
        UserDefineKey.FAST_SYNC,
        UserDefineKey.LOCK_ON_FIRST_CONNECTION,
        UserDefineKey.LOCK_ON_50HZ,
      ],
      [UserDefineCategory.CompatibilityOptions]: [
        UserDefineKey.UART_INVERTED,
      ],
      [UserDefineCategory.OtherOptions]: [
        UserDefineKey.AUTO_WIFI_ON_BOOT,
        UserDefineKey.JUST_BEEP_ONCE,
        UserDefineKey.MY_STARTUP_MELODY,
      ],
    };

    this.data = {
      // R9M TX
      [DeviceTarget.Frsky_TX_R9M_via_STLINK]: Frsky_TX_R9M,
      [DeviceTarget.Frsky_TX_R9M_via_stock_BL]: Frsky_TX_R9M,
      [DeviceTarget.Frsky_TX_R9M_via_WIFI]: Frsky_TX_R9M,
      // R9M Lite TX
      [DeviceTarget.Frsky_TX_R9M_LITE_via_STLINK]: Frsky_TX_R9M_LITE,
      [DeviceTarget.Frsky_TX_R9M_LITE_via_stock_BL]: Frsky_TX_R9M_LITE,
      // R9M Lite Pro
      [DeviceTarget.Frsky_TX_R9M_LITE_PRO_via_STLINK]: Frsky_TX_R9M_LITE_PRO,
      // R9MM RX / R9Mini RX
      [DeviceTarget.Frsky_RX_R9MM_R9MINI_via_STLINK]: Frsky_RX_R9MM_R9MINI,
      [DeviceTarget.Frsky_RX_R9MM_R9MINI_via_BetaflightPassthrough]: Frsky_RX_R9MM_R9MINI,

      // R9SlimPlus RX
      [DeviceTarget.Frsky_RX_R9SLIMPLUS_via_STLINK]: Frsky_RX_R9SLIMPLUS,
      [DeviceTarget.Frsky_RX_R9SLIMPLUS_via_BetaflightPassthrough]: Frsky_RX_R9SLIMPLUS,
      [DeviceTarget.Frsky_RX_R9SLIMPLUS_OTA_via_STLINK]: Frsky_RX_R9SLIMPLUS,
      [DeviceTarget.Frsky_RX_R9SLIMPLUS_OTA_via_BetaflightPassthrough]: Frsky_RX_R9SLIMPLUS,

      // R9MX RX
      [DeviceTarget.Frsky_RX_R9MX_via_STLINK]: Frsky_RX_R9MX,
      [DeviceTarget.Frsky_RX_R9MX_via_BetaflightPassthrough]: Frsky_RX_R9MX,

      // Jumper R900 Mini RX
      [DeviceTarget.Jumper_RX_R900MINI_via_STLINK]: Jumper_RX_R900MINI,
      [DeviceTarget.Jumper_RX_R900MINI_via_BetaflightPassthrough]: Jumper_RX_R900MINI,

      // 900Mhz TTGO V1 TX
      [DeviceTarget.DIY_900_TX_TTGO_V1_SX127x_via_UART]: DIY_900_TX_TTGO_V1_SX127x,

      // 900 TTGO V2 TX
      [DeviceTarget.DIY_900_TX_TTGO_V2_SX127x_via_UART]: DIY_900_TX_TTGO_V2_SX127x,

      // DIY 900 Mhz TXs
      [DeviceTarget.DIY_900_TX_ESP32_SX127x_E19_via_UART]: DIY_900_TX_ESP32_SX127x_E19,
      [DeviceTarget.DIY_900_TX_ESP32_SX127x_RFM95_via_UART]: DIY_900_TX_ESP32_SX127x_RFM95,
      [DeviceTarget.DIY_900_RX_ESP8285_SX127x_via_UART]: DIY_900_RX_ESP8285_SX127x,
      [DeviceTarget.DIY_900_RX_ESP8285_SX127x_via_BetaflightPassthrough]: DIY_900_RX_ESP8285_SX127x,

      // DIY 2400 Mhz TXs
      [DeviceTarget.DIY_2400_TX_ESP32_SX1280_Mini_via_UART]: DIY_2400_TX_ESP32_SX1280_Mini,
      [DeviceTarget.DIY_2400_TX_ESP32_SX1280_E28_via_UART]: DIY_2400_TX_ESP32_SX1280_E28,
      [DeviceTarget.DIY_2400_TX_ESP32_SX1280_LORA1280F27_via_UART]: DIY_2400_TX_ESP32_SX1280_LORA1280F27,

      // GHOST_ATTO_2400_RX
      [DeviceTarget.GHOST_ATTO_2400_RX_via_STLINK]: GHOST_ATTO_2400_RX,
      [DeviceTarget.GHOST_ATTO_2400_RX_via_BetaflightPassthrough]: GHOST_ATTO_2400_RX,

      // DIY_2400_RX_ESP8285_SX1280
      [DeviceTarget.DIY_2400_RX_ESP8285_SX1280_via_UART]: DIY_2400_RX_ESP8285_SX1280,
      [DeviceTarget.DIY_2400_RX_ESP8285_SX1280_via_BetaflightPassthrough]: DIY_2400_RX_ESP8285_SX1280,

      // DIY_2400_RX_STM32_CCG_Nano_v0_5
      [DeviceTarget.DIY_2400_RX_STM32_CCG_Nano_v0_5]: DIY_2400_RX_STM32_CCG_Nano_v0_5,
      [DeviceTarget.DIY_2400_RX_STM32_CCG_Nano_v0_5_via_BetaflightPassthrough]: DIY_2400_RX_STM32_CCG_Nano_v0_5,
    };
  }

  getCategorizedByTarget(target: DeviceTarget): UserDefinesByCategory {
    return this.data[target];
  }

  getByTarget(target: DeviceTarget): UserDefineKey[] {
    return Object.values(this.data[target]).flat();
  }
}
