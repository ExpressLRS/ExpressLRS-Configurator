/*
  We want to persist configurations between very closely related targets, for example:

    * DeviceTarget.Frsky_TX_R9M_via_STLINK
    * DeviceTarget.Frsky_TX_R9M_via_stock_BL
    * DeviceTarget.Frsky_TX_R9M_via_WIFI

  This is essentially the same device that we targeting.
 */
import { DeviceTarget } from '../gql/generated/types';

const deviceTargetKey = (target: DeviceTarget): DeviceTarget => {
  switch (target) {
    case DeviceTarget.NamimnoRC_VOYAGER_900_TX_via_STLINK:
    case DeviceTarget.NamimnoRC_VOYAGER_900_TX_via_WIFI:
      return DeviceTarget.NamimnoRC_VOYAGER_900_TX_via_WIFI;
    case DeviceTarget.NamimnoRC_VOYAGER_900_RX_via_STLINK:
    case DeviceTarget.NamimnoRC_VOYAGER_900_RX_via_BetaflightPassthrough:
      return DeviceTarget.NamimnoRC_VOYAGER_900_RX_via_STLINK;
    case DeviceTarget.NamimnoRC_VOYAGER_900_ESP_RX_via_UART:
    case DeviceTarget.NamimnoRC_VOYAGER_900_ESP_RX_via_BetaflightPassthrough:
    case DeviceTarget.NamimnoRC_VOYAGER_900_ESP_RX_via_WIFI:
      return DeviceTarget.NamimnoRC_VOYAGER_900_ESP_RX_via_UART;
    case DeviceTarget.NamimnoRC_FLASH_2400_TX_via_STLINK:
    case DeviceTarget.NamimnoRC_FLASH_2400_TX_via_WIFI:
      return DeviceTarget.NamimnoRC_FLASH_2400_TX_via_STLINK;
    case DeviceTarget.NamimnoRC_FLASH_2400_RX_via_STLINK:
    case DeviceTarget.NamimnoRC_FLASH_2400_RX_via_BetaflightPassthrough:
      return DeviceTarget.NamimnoRC_FLASH_2400_RX_via_STLINK;
    case DeviceTarget.NamimnoRC_FLASH_2400_ESP_RX_via_UART:
    case DeviceTarget.NamimnoRC_FLASH_2400_ESP_RX_via_BetaflightPassthrough:
    case DeviceTarget.NamimnoRC_FLASH_2400_ESP_RX_via_WIFI:
      return DeviceTarget.NamimnoRC_FLASH_2400_ESP_RX_via_UART;
    case DeviceTarget.FM30_TX_via_STLINK:
    case DeviceTarget.FM30_TX_via_DFU:
      return DeviceTarget.FM30_TX_via_STLINK;
    case DeviceTarget.FM30_RX_MINI_via_STLINK:
    case DeviceTarget.FM30_RX_MINI_via_BetaflightPassthrough:
      return DeviceTarget.FM30_RX_MINI_via_STLINK;
    case DeviceTarget.NeutronRC_900_RX_via_UART:
    case DeviceTarget.NeutronRC_900_RX_via_BetaflightPassthrough:
    case DeviceTarget.NeutronRC_900_RX_via_WIFI:
      return DeviceTarget.NeutronRC_900_RX_via_UART;
    case DeviceTarget.Frsky_TX_R9M_via_STLINK:
    case DeviceTarget.Frsky_TX_R9M_via_stock_BL:
    case DeviceTarget.Frsky_TX_R9M_via_WIFI:
      return DeviceTarget.Frsky_TX_R9M_via_STLINK;
    case DeviceTarget.Frsky_TX_R9M_LITE_via_STLINK:
    case DeviceTarget.Frsky_TX_R9M_LITE_via_stock_BL:
      return DeviceTarget.Frsky_TX_R9M_LITE_via_STLINK;
    case DeviceTarget.Frsky_RX_R9MM_R9MINI_via_STLINK:
    case DeviceTarget.Frsky_RX_R9MM_R9MINI_via_BetaflightPassthrough:
      return DeviceTarget.Frsky_RX_R9MM_R9MINI_via_STLINK;
    case DeviceTarget.Frsky_RX_R9SLIMPLUS_via_STLINK:
    case DeviceTarget.Frsky_RX_R9SLIMPLUS_via_BetaflightPassthrough:
      return DeviceTarget.Frsky_RX_R9SLIMPLUS_via_STLINK;
    case DeviceTarget.Frsky_RX_R9SLIM_via_STLINK:
    case DeviceTarget.Frsky_RX_R9SLIM_via_BetaflightPassthrough:
      return DeviceTarget.Frsky_RX_R9SLIM_via_STLINK;
    case DeviceTarget.Frsky_RX_R9SLIMPLUS_OTA_via_STLINK:
    case DeviceTarget.Frsky_RX_R9SLIMPLUS_OTA_via_BetaflightPassthrough:
      return DeviceTarget.Frsky_RX_R9SLIMPLUS_OTA_via_STLINK;
    case DeviceTarget.Frsky_RX_R9MX_via_STLINK:
    case DeviceTarget.Frsky_RX_R9MX_via_BetaflightPassthrough:
      return DeviceTarget.Frsky_RX_R9MX_via_STLINK;
    case DeviceTarget.Jumper_RX_R900MINI_via_STLINK:
    case DeviceTarget.Jumper_RX_R900MINI_via_BetaflightPassthrough:
      return DeviceTarget.Jumper_RX_R900MINI_via_STLINK;
    case DeviceTarget.DIY_900_RX_ESP8285_SX127x_via_UART:
    case DeviceTarget.DIY_900_RX_ESP8285_SX127x_via_BetaflightPassthrough:
      return DeviceTarget.DIY_900_RX_ESP8285_SX127x_via_UART;
    case DeviceTarget.GHOST_ATTO_2400_RX_via_STLINK:
    case DeviceTarget.GHOST_ATTO_2400_RX_via_BetaflightPassthrough:
      return DeviceTarget.GHOST_ATTO_2400_RX_via_STLINK;
    case DeviceTarget.DIY_2400_RX_ESP8285_SX1280_via_UART:
    case DeviceTarget.DIY_2400_RX_ESP8285_SX1280_via_WIFI:
    case DeviceTarget.DIY_2400_RX_ESP8285_SX1280_via_BetaflightPassthrough:
      return DeviceTarget.DIY_2400_RX_ESP8285_SX1280_via_UART;
    case DeviceTarget.DIY_2400_RX_STM32_CCG_Nano_v0_5_via_STLINK:
    case DeviceTarget.DIY_2400_RX_STM32_CCG_Nano_v0_5_via_BetaflightPassthrough:
      return DeviceTarget.DIY_2400_RX_STM32_CCG_Nano_v0_5_via_STLINK;
    case DeviceTarget.HappyModel_TX_ES915TX_via_stock_BL:
    case DeviceTarget.HappyModel_TX_ES915TX_via_STLINK:
      return DeviceTarget.HappyModel_TX_ES915TX_via_stock_BL;
    case DeviceTarget.HappyModel_RX_ES915RX_via_STLINK:
    case DeviceTarget.HappyModel_RX_ES915RX_via_BetaflightPassthrough:
      return DeviceTarget.HappyModel_RX_ES915RX_via_STLINK;
    case DeviceTarget.HappyModel_ES24TX_2400_TX_via_UART:
    case DeviceTarget.HappyModel_ES24TX_2400_TX_via_WIFI:
      return DeviceTarget.HappyModel_ES24TX_2400_TX_via_UART;
    case DeviceTarget.HappyModel_EP_2400_RX_via_UART:
    case DeviceTarget.HappyModel_EP_2400_RX_via_BetaflightPassthrough:
    case DeviceTarget.HappyModel_EP_2400_RX_via_WIFI:
      return DeviceTarget.HappyModel_EP_2400_RX_via_UART;
    case DeviceTarget.HappyModel_PP_2400_RX_via_STLINK:
    case DeviceTarget.HappyModel_PP_2400_RX_via_BetaflightPassthrough:
      return DeviceTarget.HappyModel_EP_2400_RX_via_UART;
    default:
      return target;
  }
};

export default deviceTargetKey;
