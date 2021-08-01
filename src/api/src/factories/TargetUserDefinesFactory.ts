/* eslint-disable @typescript-eslint/naming-convention */
import DeviceTarget from '../library/FirmwareBuilder/Enum/DeviceTarget';
import UserDefineKey from '../library/FirmwareBuilder/Enum/UserDefineKey';
import UserDefine from '../models/UserDefine';

export type DeviceOptionsByTarget = {
  [key in DeviceTarget]: UserDefine[];
};

export default class TargetUserDefinesFactory {
  build(target: DeviceTarget): UserDefine[] {
    const NamimnoRC_FLASH_2400_TX: UserDefine[] = [
      // regulatory options
      UserDefine.Boolean(UserDefineKey.REGULATORY_DOMAIN_ISM_2400, true),
      // binding
      UserDefine.Text(UserDefineKey.BINDING_PHRASE, '', true),
      // hybrid switches
      UserDefine.Boolean(UserDefineKey.HYBRID_SWITCHES_8, true),
      UserDefine.Boolean(UserDefineKey.ENABLE_TELEMETRY),
      UserDefine.Text(UserDefineKey.TLM_REPORT_INTERVAL_MS, '320LU'),
      // performance options
      UserDefine.Boolean(UserDefineKey.NO_SYNC_ON_ARM),
      UserDefine.Enum(
        UserDefineKey.ARM_CHANNEL,
        ['AUX1', 'AUX2', 'AUX3', 'AUX4', 'AUX5', 'AUX6'],
        'AUX1'
      ),
      UserDefine.Boolean(UserDefineKey.FEATURE_OPENTX_SYNC, true),
      // UserDefine.Boolean(UserDefineKey.FEATURE_OPENTX_SYNC_AUTOTUNE),
      UserDefine.Boolean(UserDefineKey.USE_500HZ),
      // compat
      UserDefine.Boolean(UserDefineKey.UART_INVERTED, true),
      // other
      UserDefine.Boolean(UserDefineKey.BLE_HID_JOYSTICK),
      UserDefine.Boolean(UserDefineKey.USE_DYNAMIC_POWER),
    ];

    const NamimnoRC_FLASH_2400_RX: UserDefine[] = [
      // regulatory options
      UserDefine.Boolean(UserDefineKey.REGULATORY_DOMAIN_ISM_2400, true),
      // binding
      UserDefine.Text(UserDefineKey.BINDING_PHRASE, '', true),
      // hybrid switches
      UserDefine.Boolean(UserDefineKey.HYBRID_SWITCHES_8, true),
      UserDefine.Boolean(UserDefineKey.ENABLE_TELEMETRY),
      // performance options
      UserDefine.Boolean(UserDefineKey.NO_SYNC_ON_ARM),
      UserDefine.Boolean(UserDefineKey.LOCK_ON_FIRST_CONNECTION, true),
      UserDefine.Boolean(UserDefineKey.USE_500HZ),
    ];
    const NamimnoRC_FLASH_2400_ESP_RX: UserDefine[] = [
      // regulatory options
      UserDefine.Boolean(UserDefineKey.REGULATORY_DOMAIN_ISM_2400, true),
      // binding
      UserDefine.Text(UserDefineKey.BINDING_PHRASE, '', true),
      // hybrid switches
      UserDefine.Boolean(UserDefineKey.HYBRID_SWITCHES_8, true),
      UserDefine.Boolean(UserDefineKey.ENABLE_TELEMETRY),
      UserDefine.Text(UserDefineKey.TLM_REPORT_INTERVAL_MS, '320LU'),
      // performance options
      UserDefine.Boolean(UserDefineKey.NO_SYNC_ON_ARM),
      UserDefine.Enum(
        UserDefineKey.ARM_CHANNEL,
        ['AUX1', 'AUX2', 'AUX3', 'AUX4', 'AUX5', 'AUX6'],
        'AUX1'
      ),
      UserDefine.Boolean(UserDefineKey.FEATURE_OPENTX_SYNC, true),
      // UserDefine.Boolean(UserDefineKey.FEATURE_OPENTX_SYNC_AUTOTUNE),
      UserDefine.Boolean(UserDefineKey.USE_500HZ),
      // compat
      UserDefine.Boolean(UserDefineKey.UART_INVERTED, true),
      // other options
      UserDefine.Boolean(UserDefineKey.AUTO_WIFI_ON_BOOT),
      UserDefine.Text(UserDefineKey.AUTO_WIFI_ON_INTERVAL, '20', true),
    ];

    const NamimnoRC_VOYAGER_900_TX: UserDefine[] = [
      // regulatory options
      UserDefine.Boolean(UserDefineKey.REGULATORY_DOMAIN_AU_915),
      UserDefine.Boolean(UserDefineKey.REGULATORY_DOMAIN_EU_868),
      UserDefine.Boolean(UserDefineKey.REGULATORY_DOMAIN_FCC_915),
      // binding
      UserDefine.Text(UserDefineKey.BINDING_PHRASE, '', true),
      // hybrid switches
      UserDefine.Boolean(UserDefineKey.HYBRID_SWITCHES_8, true),
      UserDefine.Boolean(UserDefineKey.ENABLE_TELEMETRY),
      UserDefine.Text(UserDefineKey.TLM_REPORT_INTERVAL_MS, '320LU'),
      // performance options
      UserDefine.Boolean(UserDefineKey.NO_SYNC_ON_ARM),
      UserDefine.Enum(
        UserDefineKey.ARM_CHANNEL,
        ['AUX1', 'AUX2', 'AUX3', 'AUX4', 'AUX5', 'AUX6', 'AUX7', 'AUX8'],
        'AUX1'
      ),
      UserDefine.Boolean(UserDefineKey.FEATURE_OPENTX_SYNC, true),
      // other options
      UserDefine.Boolean(UserDefineKey.USE_ESP8266_BACKPACK, true),
      UserDefine.Boolean(UserDefineKey.JUST_BEEP_ONCE),
      UserDefine.Boolean(UserDefineKey.DISABLE_STARTUP_BEEP),
      UserDefine.Text(UserDefineKey.MY_STARTUP_MELODY),
      UserDefine.Boolean(UserDefineKey.BLE_HID_JOYSTICK),
      UserDefine.Boolean(UserDefineKey.USE_DYNAMIC_POWER),
    ];
    const NamimnoRC_VOYAGER_900_RX: UserDefine[] = [
      // regulatory options
      UserDefine.Boolean(UserDefineKey.REGULATORY_DOMAIN_AU_915),
      UserDefine.Boolean(UserDefineKey.REGULATORY_DOMAIN_EU_868),
      UserDefine.Boolean(UserDefineKey.REGULATORY_DOMAIN_FCC_915),
      UserDefine.Boolean(UserDefineKey.REGULATORY_DOMAIN_IN_866),
      // binding
      UserDefine.Text(UserDefineKey.BINDING_PHRASE, '', true),
      // hybrid switches
      UserDefine.Boolean(UserDefineKey.HYBRID_SWITCHES_8, true),
      UserDefine.Boolean(UserDefineKey.ENABLE_TELEMETRY),
      // performance options
      UserDefine.Boolean(UserDefineKey.NO_SYNC_ON_ARM),
      UserDefine.Enum(
        UserDefineKey.ARM_CHANNEL,
        ['AUX1', 'AUX2', 'AUX3', 'AUX4', 'AUX5', 'AUX6'],
        'AUX1'
      ),
      UserDefine.Boolean(UserDefineKey.LOCK_ON_FIRST_CONNECTION, true),
    ];
    const NamimnoRC_VOYAGER_900_ESP_RX: UserDefine[] = [
      // regulatory options
      UserDefine.Boolean(UserDefineKey.REGULATORY_DOMAIN_AU_915),
      UserDefine.Boolean(UserDefineKey.REGULATORY_DOMAIN_EU_868),
      UserDefine.Boolean(UserDefineKey.REGULATORY_DOMAIN_FCC_915),
      UserDefine.Boolean(UserDefineKey.REGULATORY_DOMAIN_IN_866),
      // binding
      UserDefine.Text(UserDefineKey.BINDING_PHRASE, '', true),
      // hybrid switches
      UserDefine.Boolean(UserDefineKey.HYBRID_SWITCHES_8, true),
      UserDefine.Boolean(UserDefineKey.ENABLE_TELEMETRY),
      // performance options
      UserDefine.Boolean(UserDefineKey.NO_SYNC_ON_ARM),
      UserDefine.Enum(
        UserDefineKey.ARM_CHANNEL,
        ['AUX1', 'AUX2', 'AUX3', 'AUX4', 'AUX5', 'AUX6'],
        'AUX1'
      ),
      UserDefine.Boolean(UserDefineKey.LOCK_ON_FIRST_CONNECTION, true),
      // other options
      UserDefine.Boolean(UserDefineKey.AUTO_WIFI_ON_BOOT),
      UserDefine.Text(UserDefineKey.AUTO_WIFI_ON_INTERVAL, '20', true),
    ];

    const NeutronRC_900_RX: UserDefine[] = [
      // regulatory options
      UserDefine.Boolean(UserDefineKey.REGULATORY_DOMAIN_AU_915),
      UserDefine.Boolean(UserDefineKey.REGULATORY_DOMAIN_EU_868),
      UserDefine.Boolean(UserDefineKey.REGULATORY_DOMAIN_FCC_915),
      UserDefine.Boolean(UserDefineKey.REGULATORY_DOMAIN_IN_866),
      // binding
      UserDefine.Text(UserDefineKey.BINDING_PHRASE, '', true),
      // hybrid switches
      UserDefine.Boolean(UserDefineKey.HYBRID_SWITCHES_8, true),
      UserDefine.Boolean(UserDefineKey.ENABLE_TELEMETRY),
      // performance options
      UserDefine.Boolean(UserDefineKey.NO_SYNC_ON_ARM),
      UserDefine.Enum(
        UserDefineKey.ARM_CHANNEL,
        ['AUX1', 'AUX2', 'AUX3', 'AUX4', 'AUX5', 'AUX6'],
        'AUX1'
      ),
      UserDefine.Boolean(UserDefineKey.LOCK_ON_FIRST_CONNECTION, true),
      UserDefine.Boolean(UserDefineKey.AUTO_WIFI_ON_BOOT),
      UserDefine.Text(UserDefineKey.AUTO_WIFI_ON_INTERVAL, '20', true),
    ];

    const Frsky_TX_R9M: UserDefine[] = [
      // regulatory options
      UserDefine.Boolean(UserDefineKey.REGULATORY_DOMAIN_AU_915),
      UserDefine.Boolean(UserDefineKey.REGULATORY_DOMAIN_EU_868),
      UserDefine.Boolean(UserDefineKey.REGULATORY_DOMAIN_FCC_915),
      UserDefine.Boolean(UserDefineKey.REGULATORY_DOMAIN_IN_866),
      // binding
      UserDefine.Text(UserDefineKey.BINDING_PHRASE, '', true),
      // hybrid switches
      UserDefine.Boolean(UserDefineKey.HYBRID_SWITCHES_8, true),
      UserDefine.Boolean(UserDefineKey.ENABLE_TELEMETRY),
      UserDefine.Text(UserDefineKey.TLM_REPORT_INTERVAL_MS, '320LU'),
      // performance options
      UserDefine.Boolean(UserDefineKey.NO_SYNC_ON_ARM),
      UserDefine.Enum(
        UserDefineKey.ARM_CHANNEL,
        ['AUX1', 'AUX2', 'AUX3', 'AUX4', 'AUX5', 'AUX6', 'AUX7', 'AUX8'],
        'AUX1'
      ),
      UserDefine.Boolean(UserDefineKey.FEATURE_OPENTX_SYNC, true),
      // other options
      UserDefine.Boolean(UserDefineKey.USE_ESP8266_BACKPACK, true),
      UserDefine.Boolean(UserDefineKey.JUST_BEEP_ONCE),
      UserDefine.Boolean(UserDefineKey.DISABLE_STARTUP_BEEP),
      UserDefine.Text(UserDefineKey.MY_STARTUP_MELODY),
      UserDefine.Boolean(UserDefineKey.USE_DYNAMIC_POWER),
      UserDefine.Boolean(UserDefineKey.R9M_UNLOCK_HIGHER_POWER),
      UserDefine.Boolean(UserDefineKey.UNLOCK_HIGHER_POWER),
    ];
    const Frsky_TX_R9M_LITE: UserDefine[] = [
      // regulatory options
      UserDefine.Boolean(UserDefineKey.REGULATORY_DOMAIN_AU_915),
      UserDefine.Boolean(UserDefineKey.REGULATORY_DOMAIN_EU_868),
      UserDefine.Boolean(UserDefineKey.REGULATORY_DOMAIN_FCC_915),
      UserDefine.Boolean(UserDefineKey.REGULATORY_DOMAIN_IN_866),
      // binding
      UserDefine.Text(UserDefineKey.BINDING_PHRASE, '', true),
      // hybrid switches
      UserDefine.Boolean(UserDefineKey.HYBRID_SWITCHES_8, true),
      UserDefine.Boolean(UserDefineKey.ENABLE_TELEMETRY),
      UserDefine.Text(UserDefineKey.TLM_REPORT_INTERVAL_MS, '320LU'),
      // performance options
      UserDefine.Boolean(UserDefineKey.NO_SYNC_ON_ARM),
      UserDefine.Enum(
        UserDefineKey.ARM_CHANNEL,
        ['AUX1', 'AUX2', 'AUX3', 'AUX4', 'AUX5', 'AUX6'],
        'AUX1'
      ),
      UserDefine.Boolean(UserDefineKey.FEATURE_OPENTX_SYNC, true),
      // other options
      UserDefine.Boolean(UserDefineKey.JUST_BEEP_ONCE),
      UserDefine.Boolean(UserDefineKey.DISABLE_STARTUP_BEEP),
      UserDefine.Boolean(UserDefineKey.USE_DYNAMIC_POWER),
    ];

    const Frsky_TX_R9M_LITE_PRO: UserDefine[] = [
      // regulatory options
      UserDefine.Boolean(UserDefineKey.REGULATORY_DOMAIN_AU_915),
      UserDefine.Boolean(UserDefineKey.REGULATORY_DOMAIN_EU_868),
      UserDefine.Boolean(UserDefineKey.REGULATORY_DOMAIN_FCC_915),
      UserDefine.Boolean(UserDefineKey.REGULATORY_DOMAIN_IN_866),
      // binding
      UserDefine.Text(UserDefineKey.BINDING_PHRASE, '', true),
      // hybrid switches
      UserDefine.Boolean(UserDefineKey.HYBRID_SWITCHES_8, true),
      UserDefine.Boolean(UserDefineKey.ENABLE_TELEMETRY),
      UserDefine.Text(UserDefineKey.TLM_REPORT_INTERVAL_MS, '320LU'),
      // performance options
      UserDefine.Boolean(UserDefineKey.NO_SYNC_ON_ARM),
      UserDefine.Enum(
        UserDefineKey.ARM_CHANNEL,
        ['AUX1', 'AUX2', 'AUX3', 'AUX4', 'AUX5', 'AUX6'],
        'AUX1'
      ),
      UserDefine.Boolean(UserDefineKey.FEATURE_OPENTX_SYNC, true),
      // UserDefine.Boolean(UserDefineKey.FEATURE_OPENTX_SYNC_AUTOTUNE),
      // other options
      UserDefine.Boolean(UserDefineKey.UNLOCK_HIGHER_POWER),
      UserDefine.Boolean(UserDefineKey.JUST_BEEP_ONCE),
      UserDefine.Boolean(UserDefineKey.DISABLE_STARTUP_BEEP),
      UserDefine.Boolean(UserDefineKey.USE_DYNAMIC_POWER),
    ];

    const Frsky_RX_R9MM_R9MINI: UserDefine[] = [
      // regulatory options
      UserDefine.Boolean(UserDefineKey.REGULATORY_DOMAIN_AU_915),
      UserDefine.Boolean(UserDefineKey.REGULATORY_DOMAIN_EU_868),
      UserDefine.Boolean(UserDefineKey.REGULATORY_DOMAIN_FCC_915),
      UserDefine.Boolean(UserDefineKey.REGULATORY_DOMAIN_IN_866),
      // binding
      UserDefine.Text(UserDefineKey.BINDING_PHRASE, '', true),
      // hybrid switches
      UserDefine.Boolean(UserDefineKey.HYBRID_SWITCHES_8, true),
      UserDefine.Boolean(UserDefineKey.ENABLE_TELEMETRY),
      // performance options
      UserDefine.Boolean(UserDefineKey.NO_SYNC_ON_ARM),
      UserDefine.Enum(
        UserDefineKey.ARM_CHANNEL,
        ['AUX1', 'AUX2', 'AUX3', 'AUX4', 'AUX5', 'AUX6'],
        'AUX1'
      ),
      UserDefine.Boolean(UserDefineKey.LOCK_ON_FIRST_CONNECTION, true),
      // compat
      UserDefine.Boolean(UserDefineKey.USE_R9MM_R9MINI_SBUS),
    ];

    const Frsky_RX_R9SLIMPLUS: UserDefine[] = [
      // regulatory options
      UserDefine.Boolean(UserDefineKey.REGULATORY_DOMAIN_AU_915),
      UserDefine.Boolean(UserDefineKey.REGULATORY_DOMAIN_EU_868),
      UserDefine.Boolean(UserDefineKey.REGULATORY_DOMAIN_FCC_915),
      UserDefine.Boolean(UserDefineKey.REGULATORY_DOMAIN_IN_866),
      // binding
      UserDefine.Text(UserDefineKey.BINDING_PHRASE, '', true),
      // hybrid switches
      UserDefine.Boolean(UserDefineKey.HYBRID_SWITCHES_8, true),
      UserDefine.Boolean(UserDefineKey.ENABLE_TELEMETRY),
      // performance options
      UserDefine.Boolean(UserDefineKey.NO_SYNC_ON_ARM),
      UserDefine.Enum(
        UserDefineKey.ARM_CHANNEL,
        ['AUX1', 'AUX2', 'AUX3', 'AUX4', 'AUX5', 'AUX6'],
        'AUX1'
      ),
      UserDefine.Boolean(UserDefineKey.LOCK_ON_FIRST_CONNECTION, true),
      UserDefine.Boolean(UserDefineKey.USE_DIVERSITY, true),
    ];

    const Frsky_RX_R9SLIM: UserDefine[] = [
      // regulatory options
      UserDefine.Boolean(UserDefineKey.REGULATORY_DOMAIN_AU_915),
      UserDefine.Boolean(UserDefineKey.REGULATORY_DOMAIN_EU_868),
      UserDefine.Boolean(UserDefineKey.REGULATORY_DOMAIN_FCC_915),
      UserDefine.Boolean(UserDefineKey.REGULATORY_DOMAIN_IN_866),
      // binding
      UserDefine.Text(UserDefineKey.BINDING_PHRASE, '', true),
      // hybrid switches
      UserDefine.Boolean(UserDefineKey.HYBRID_SWITCHES_8, true),
      UserDefine.Boolean(UserDefineKey.ENABLE_TELEMETRY),
      // performance options
      UserDefine.Boolean(UserDefineKey.NO_SYNC_ON_ARM),
      UserDefine.Enum(
        UserDefineKey.ARM_CHANNEL,
        ['AUX1', 'AUX2', 'AUX3', 'AUX4', 'AUX5', 'AUX6'],
        'AUX1'
      ),
      UserDefine.Boolean(UserDefineKey.LOCK_ON_FIRST_CONNECTION, true),
    ];

    const Frsky_RX_R9MX: UserDefine[] = [
      // regulatory options
      UserDefine.Boolean(UserDefineKey.REGULATORY_DOMAIN_AU_915),
      UserDefine.Boolean(UserDefineKey.REGULATORY_DOMAIN_EU_868),
      UserDefine.Boolean(UserDefineKey.REGULATORY_DOMAIN_FCC_915),
      UserDefine.Boolean(UserDefineKey.REGULATORY_DOMAIN_IN_866),
      // binding
      UserDefine.Text(UserDefineKey.BINDING_PHRASE, '', true),
      // hybrid switches
      UserDefine.Boolean(UserDefineKey.HYBRID_SWITCHES_8, true),
      UserDefine.Boolean(UserDefineKey.ENABLE_TELEMETRY),
      // performance options
      UserDefine.Boolean(UserDefineKey.NO_SYNC_ON_ARM),
      UserDefine.Enum(
        UserDefineKey.ARM_CHANNEL,
        ['AUX1', 'AUX2', 'AUX3', 'AUX4', 'AUX5', 'AUX6'],
        'AUX1'
      ),
      UserDefine.Boolean(UserDefineKey.LOCK_ON_FIRST_CONNECTION, true),
    ];

    const HappyModel_TX_ES915TX: UserDefine[] = [
      // regulatory options
      UserDefine.Boolean(UserDefineKey.REGULATORY_DOMAIN_AU_915),
      UserDefine.Boolean(UserDefineKey.REGULATORY_DOMAIN_EU_868),
      UserDefine.Boolean(UserDefineKey.REGULATORY_DOMAIN_FCC_915),
      UserDefine.Boolean(UserDefineKey.REGULATORY_DOMAIN_IN_866),
      // binding
      UserDefine.Text(UserDefineKey.BINDING_PHRASE, '', true),
      // hybrid switches
      UserDefine.Boolean(UserDefineKey.HYBRID_SWITCHES_8, true),
      UserDefine.Boolean(UserDefineKey.ENABLE_TELEMETRY),
      UserDefine.Text(UserDefineKey.TLM_REPORT_INTERVAL_MS, '320LU'),
      // performance options
      UserDefine.Boolean(UserDefineKey.NO_SYNC_ON_ARM),
      UserDefine.Enum(
        UserDefineKey.ARM_CHANNEL,
        ['AUX1', 'AUX2', 'AUX3', 'AUX4', 'AUX5', 'AUX6', 'AUX7', 'AUX8'],
        'AUX1'
      ),
      UserDefine.Boolean(UserDefineKey.FEATURE_OPENTX_SYNC, true),
      // UserDefine.Boolean(UserDefineKey.FEATURE_OPENTX_SYNC_AUTOTUNE),
      // other options
      UserDefine.Boolean(UserDefineKey.UNLOCK_HIGHER_POWER),
      UserDefine.Boolean(UserDefineKey.JUST_BEEP_ONCE),
      UserDefine.Boolean(UserDefineKey.DISABLE_STARTUP_BEEP),
      UserDefine.Text(UserDefineKey.MY_STARTUP_MELODY),
      UserDefine.Boolean(UserDefineKey.BLE_HID_JOYSTICK),
      UserDefine.Boolean(UserDefineKey.USE_DYNAMIC_POWER),
    ];

    const HappyModel_TX_ES900TX: UserDefine[] = [
      // regulatory options
      UserDefine.Boolean(UserDefineKey.REGULATORY_DOMAIN_AU_915),
      UserDefine.Boolean(UserDefineKey.REGULATORY_DOMAIN_EU_868),
      UserDefine.Boolean(UserDefineKey.REGULATORY_DOMAIN_FCC_915),
      UserDefine.Boolean(UserDefineKey.REGULATORY_DOMAIN_IN_866),
      // binding
      UserDefine.Text(UserDefineKey.BINDING_PHRASE, '', true),
      // hybrid switches
      UserDefine.Boolean(UserDefineKey.HYBRID_SWITCHES_8, true),
      UserDefine.Boolean(UserDefineKey.ENABLE_TELEMETRY),
      UserDefine.Text(UserDefineKey.TLM_REPORT_INTERVAL_MS, '320LU'),
      // performance options
      UserDefine.Boolean(UserDefineKey.NO_SYNC_ON_ARM),
      UserDefine.Enum(
        UserDefineKey.ARM_CHANNEL,
        ['AUX1', 'AUX2', 'AUX3', 'AUX4', 'AUX5', 'AUX6', 'AUX7', 'AUX8'],
        'AUX1'
      ),
      UserDefine.Boolean(UserDefineKey.FEATURE_OPENTX_SYNC, true),
      // UserDefine.Boolean(UserDefineKey.FEATURE_OPENTX_SYNC_AUTOTUNE),
      // other options
      UserDefine.Boolean(UserDefineKey.BLE_HID_JOYSTICK),
      UserDefine.Boolean(UserDefineKey.UNLOCK_HIGHER_POWER),
      UserDefine.Boolean(UserDefineKey.USE_DYNAMIC_POWER),
      // compat
      UserDefine.Boolean(UserDefineKey.UART_INVERTED, true),
    ];

    const HappyModel_RX_ES915RX: UserDefine[] = [
      // regulatory options
      UserDefine.Boolean(UserDefineKey.REGULATORY_DOMAIN_AU_915),
      UserDefine.Boolean(UserDefineKey.REGULATORY_DOMAIN_EU_868),
      UserDefine.Boolean(UserDefineKey.REGULATORY_DOMAIN_FCC_915),
      UserDefine.Boolean(UserDefineKey.REGULATORY_DOMAIN_IN_866),
      // binding
      UserDefine.Text(UserDefineKey.BINDING_PHRASE, '', true),
      // hybrid switches
      UserDefine.Boolean(UserDefineKey.HYBRID_SWITCHES_8, true),
      UserDefine.Boolean(UserDefineKey.ENABLE_TELEMETRY),
      // performance options
      UserDefine.Boolean(UserDefineKey.NO_SYNC_ON_ARM),
      UserDefine.Enum(
        UserDefineKey.ARM_CHANNEL,
        ['AUX1', 'AUX2', 'AUX3', 'AUX4', 'AUX5', 'AUX6'],
        'AUX1'
      ),
      UserDefine.Boolean(UserDefineKey.LOCK_ON_FIRST_CONNECTION, true),
    ];

    const HappyModel_RX_ES900RX: UserDefine[] = [
      // regulatory options
      UserDefine.Boolean(UserDefineKey.REGULATORY_DOMAIN_AU_915),
      UserDefine.Boolean(UserDefineKey.REGULATORY_DOMAIN_EU_868),
      UserDefine.Boolean(UserDefineKey.REGULATORY_DOMAIN_FCC_915),
      UserDefine.Boolean(UserDefineKey.REGULATORY_DOMAIN_IN_866),
      // binding
      UserDefine.Text(UserDefineKey.BINDING_PHRASE, '', true),
      // hybrid switches
      UserDefine.Boolean(UserDefineKey.HYBRID_SWITCHES_8, true),
      UserDefine.Boolean(UserDefineKey.ENABLE_TELEMETRY),
      // performance options
      UserDefine.Boolean(UserDefineKey.NO_SYNC_ON_ARM),
      UserDefine.Enum(
        UserDefineKey.ARM_CHANNEL,
        ['AUX1', 'AUX2', 'AUX3', 'AUX4', 'AUX5', 'AUX6'],
        'AUX1'
      ),
      UserDefine.Boolean(UserDefineKey.LOCK_ON_FIRST_CONNECTION, true),
      UserDefine.Boolean(UserDefineKey.AUTO_WIFI_ON_BOOT),
      UserDefine.Text(UserDefineKey.AUTO_WIFI_ON_INTERVAL, '20', true),
    ];

    const Jumper_RX_R900MINI: UserDefine[] = [
      // regulatory options
      UserDefine.Boolean(UserDefineKey.REGULATORY_DOMAIN_AU_915),
      UserDefine.Boolean(UserDefineKey.REGULATORY_DOMAIN_EU_868),
      UserDefine.Boolean(UserDefineKey.REGULATORY_DOMAIN_FCC_915),
      UserDefine.Boolean(UserDefineKey.REGULATORY_DOMAIN_IN_866),
      // binding
      UserDefine.Text(UserDefineKey.BINDING_PHRASE, '', true),
      // hybrid switches
      UserDefine.Boolean(UserDefineKey.HYBRID_SWITCHES_8, true),
      UserDefine.Boolean(UserDefineKey.ENABLE_TELEMETRY),
      // performance options
      UserDefine.Boolean(UserDefineKey.NO_SYNC_ON_ARM),
      UserDefine.Enum(
        UserDefineKey.ARM_CHANNEL,
        ['AUX1', 'AUX2', 'AUX3', 'AUX4', 'AUX5', 'AUX6'],
        'AUX1'
      ),
      UserDefine.Boolean(UserDefineKey.LOCK_ON_FIRST_CONNECTION, true),
    ];

    const DIY_900_TX_TTGO_V1_SX127x: UserDefine[] = [
      // regulatory options
      UserDefine.Boolean(UserDefineKey.REGULATORY_DOMAIN_AU_915),
      UserDefine.Boolean(UserDefineKey.REGULATORY_DOMAIN_EU_868),
      UserDefine.Boolean(UserDefineKey.REGULATORY_DOMAIN_FCC_915),
      UserDefine.Boolean(UserDefineKey.REGULATORY_DOMAIN_IN_866),
      // binding
      UserDefine.Text(UserDefineKey.BINDING_PHRASE, '', true),
      // hybrid switches
      UserDefine.Boolean(UserDefineKey.HYBRID_SWITCHES_8, true),
      UserDefine.Boolean(UserDefineKey.ENABLE_TELEMETRY),
      UserDefine.Text(UserDefineKey.TLM_REPORT_INTERVAL_MS, '320LU'),
      // performance options
      UserDefine.Boolean(UserDefineKey.NO_SYNC_ON_ARM),
      UserDefine.Enum(
        UserDefineKey.ARM_CHANNEL,
        ['AUX1', 'AUX2', 'AUX3', 'AUX4', 'AUX5', 'AUX6'],
        'AUX1'
      ),
      UserDefine.Boolean(UserDefineKey.FEATURE_OPENTX_SYNC, true),
      // compat
      UserDefine.Boolean(UserDefineKey.UART_INVERTED, true),
      // other
      UserDefine.Boolean(UserDefineKey.USE_DYNAMIC_POWER),
    ];

    const DIY_900_TX_TTGO_V2_SX127x: UserDefine[] = [
      // regulatory options
      UserDefine.Boolean(UserDefineKey.REGULATORY_DOMAIN_AU_915),
      UserDefine.Boolean(UserDefineKey.REGULATORY_DOMAIN_EU_868),
      UserDefine.Boolean(UserDefineKey.REGULATORY_DOMAIN_FCC_915),
      UserDefine.Boolean(UserDefineKey.REGULATORY_DOMAIN_IN_866),
      // binding
      UserDefine.Text(UserDefineKey.BINDING_PHRASE, '', true),
      // hybrid switches
      UserDefine.Boolean(UserDefineKey.HYBRID_SWITCHES_8, true),
      UserDefine.Boolean(UserDefineKey.ENABLE_TELEMETRY),
      UserDefine.Text(UserDefineKey.TLM_REPORT_INTERVAL_MS, '320LU'),
      // performance options
      UserDefine.Boolean(UserDefineKey.NO_SYNC_ON_ARM),
      UserDefine.Enum(
        UserDefineKey.ARM_CHANNEL,
        ['AUX1', 'AUX2', 'AUX3', 'AUX4', 'AUX5', 'AUX6'],
        'AUX1'
      ),
      UserDefine.Boolean(UserDefineKey.FEATURE_OPENTX_SYNC, true),
      // other
      UserDefine.Boolean(UserDefineKey.USE_DYNAMIC_POWER),
      // compat
      UserDefine.Boolean(UserDefineKey.UART_INVERTED, true),
    ];

    const DIY_900_TX_ESP32_SX127x: UserDefine[] = [
      // regulatory options
      UserDefine.Boolean(UserDefineKey.REGULATORY_DOMAIN_AU_915),
      UserDefine.Boolean(UserDefineKey.REGULATORY_DOMAIN_EU_868),
      UserDefine.Boolean(UserDefineKey.REGULATORY_DOMAIN_FCC_915),
      UserDefine.Boolean(UserDefineKey.REGULATORY_DOMAIN_IN_866),
      // binding
      UserDefine.Text(UserDefineKey.BINDING_PHRASE, '', true),
      // hybrid switches
      UserDefine.Boolean(UserDefineKey.HYBRID_SWITCHES_8, true),
      UserDefine.Boolean(UserDefineKey.ENABLE_TELEMETRY),
      UserDefine.Text(UserDefineKey.TLM_REPORT_INTERVAL_MS, '320LU'),
      // performance options
      UserDefine.Boolean(UserDefineKey.NO_SYNC_ON_ARM),
      UserDefine.Enum(
        UserDefineKey.ARM_CHANNEL,
        ['AUX1', 'AUX2', 'AUX3', 'AUX4', 'AUX5', 'AUX6'],
        'AUX1'
      ),
      UserDefine.Boolean(UserDefineKey.FEATURE_OPENTX_SYNC, true),
      // UserDefine.Boolean(UserDefineKey.FEATURE_OPENTX_SYNC_AUTOTUNE),
      // compat
      UserDefine.Boolean(UserDefineKey.UART_INVERTED, true),
      // other
      UserDefine.Boolean(UserDefineKey.BLE_HID_JOYSTICK),
      UserDefine.Boolean(UserDefineKey.USE_DYNAMIC_POWER),
      UserDefine.Boolean(UserDefineKey.UNLOCK_HIGHER_POWER),
    ];

    const DIY_900_RX_ESP8285_SX127x: UserDefine[] = [
      // regulatory options
      UserDefine.Boolean(UserDefineKey.REGULATORY_DOMAIN_AU_915),
      UserDefine.Boolean(UserDefineKey.REGULATORY_DOMAIN_EU_868),
      UserDefine.Boolean(UserDefineKey.REGULATORY_DOMAIN_FCC_915),
      UserDefine.Boolean(UserDefineKey.REGULATORY_DOMAIN_IN_866),
      // binding
      UserDefine.Text(UserDefineKey.BINDING_PHRASE, '', true),
      // hybrid switches
      UserDefine.Boolean(UserDefineKey.HYBRID_SWITCHES_8, true),
      UserDefine.Boolean(UserDefineKey.ENABLE_TELEMETRY),
      // performance options
      UserDefine.Boolean(UserDefineKey.NO_SYNC_ON_ARM),
      UserDefine.Enum(
        UserDefineKey.ARM_CHANNEL,
        ['AUX1', 'AUX2', 'AUX3', 'AUX4', 'AUX5', 'AUX6'],
        'AUX1'
      ),
      UserDefine.Boolean(UserDefineKey.LOCK_ON_FIRST_CONNECTION, true),
      // other options
      UserDefine.Boolean(UserDefineKey.AUTO_WIFI_ON_BOOT),
      UserDefine.Text(UserDefineKey.AUTO_WIFI_ON_INTERVAL, '20', true),
    ];

    const DIY_2400_TX_ESP32_SX1280: UserDefine[] = [
      // regulatory options
      UserDefine.Boolean(UserDefineKey.REGULATORY_DOMAIN_ISM_2400, true),
      // binding
      UserDefine.Text(UserDefineKey.BINDING_PHRASE, '', true),
      // hybrid switches
      UserDefine.Boolean(UserDefineKey.HYBRID_SWITCHES_8, true),
      UserDefine.Boolean(UserDefineKey.ENABLE_TELEMETRY),
      UserDefine.Text(UserDefineKey.TLM_REPORT_INTERVAL_MS, '320LU'),
      // performance options
      UserDefine.Boolean(UserDefineKey.NO_SYNC_ON_ARM),
      UserDefine.Enum(
        UserDefineKey.ARM_CHANNEL,
        ['AUX1', 'AUX2', 'AUX3', 'AUX4', 'AUX5', 'AUX6'],
        'AUX1'
      ),
      UserDefine.Boolean(UserDefineKey.FEATURE_OPENTX_SYNC, true),
      // UserDefine.Boolean(UserDefineKey.FEATURE_OPENTX_SYNC_AUTOTUNE),
      UserDefine.Boolean(UserDefineKey.USE_500HZ),
      // compat
      UserDefine.Boolean(UserDefineKey.UART_INVERTED, true),
      UserDefine.Boolean(UserDefineKey.USE_DYNAMIC_POWER),
      UserDefine.Boolean(UserDefineKey.UNLOCK_HIGHER_POWER, true),
    ];

    const GHOST_2400_TX: UserDefine[] = [
      // regulatory options
      UserDefine.Boolean(UserDefineKey.REGULATORY_DOMAIN_ISM_2400, true),
      // binding
      UserDefine.Text(UserDefineKey.BINDING_PHRASE, '', true),
      // hybrid switches
      UserDefine.Boolean(UserDefineKey.HYBRID_SWITCHES_8, true),
      UserDefine.Boolean(UserDefineKey.ENABLE_TELEMETRY),
      UserDefine.Text(UserDefineKey.TLM_REPORT_INTERVAL_MS, '320LU'),
      // performance options
      UserDefine.Boolean(UserDefineKey.NO_SYNC_ON_ARM),
      UserDefine.Enum(
        UserDefineKey.ARM_CHANNEL,
        ['AUX1', 'AUX2', 'AUX3', 'AUX4', 'AUX5', 'AUX6'],
        'AUX1'
      ),
      UserDefine.Boolean(UserDefineKey.FEATURE_OPENTX_SYNC, true),
      UserDefine.Boolean(UserDefineKey.USE_500HZ),
      // other
      UserDefine.Boolean(UserDefineKey.USE_DYNAMIC_POWER),
    ];

    const FM30_TX: UserDefine[] = [
      // regulatory options
      UserDefine.Boolean(UserDefineKey.REGULATORY_DOMAIN_ISM_2400, true),
      // binding
      UserDefine.Text(UserDefineKey.BINDING_PHRASE, '', true),
      // hybrid switches
      UserDefine.Boolean(UserDefineKey.HYBRID_SWITCHES_8, true),
      UserDefine.Boolean(UserDefineKey.ENABLE_TELEMETRY),
      UserDefine.Text(UserDefineKey.TLM_REPORT_INTERVAL_MS, '320LU'),
      // performance options
      UserDefine.Boolean(UserDefineKey.NO_SYNC_ON_ARM),
      UserDefine.Enum(
        UserDefineKey.ARM_CHANNEL,
        ['AUX1', 'AUX2', 'AUX3', 'AUX4', 'AUX5', 'AUX6'],
        'AUX1'
      ),
      UserDefine.Boolean(UserDefineKey.FEATURE_OPENTX_SYNC, true),
      UserDefine.Boolean(UserDefineKey.USE_500HZ),
      // compat
      UserDefine.Boolean(UserDefineKey.UART_INVERTED, true),
      // other
      UserDefine.Boolean(UserDefineKey.USE_DYNAMIC_POWER),
    ];

    const FM30_RX: UserDefine[] = [
      // regulatory options
      UserDefine.Boolean(UserDefineKey.REGULATORY_DOMAIN_ISM_2400, true),
      // binding
      UserDefine.Text(UserDefineKey.BINDING_PHRASE, '', true),
      // hybrid switches
      UserDefine.Boolean(UserDefineKey.HYBRID_SWITCHES_8, true),
      UserDefine.Boolean(UserDefineKey.ENABLE_TELEMETRY),
      // performance options
      UserDefine.Boolean(UserDefineKey.NO_SYNC_ON_ARM),
      UserDefine.Boolean(UserDefineKey.LOCK_ON_FIRST_CONNECTION, true),
      UserDefine.Boolean(UserDefineKey.USE_500HZ),
      UserDefine.Boolean(UserDefineKey.USE_DIVERSITY, true),
    ];

    const GHOST_ATTO_2400_RX: UserDefine[] = [
      // regulatory options
      UserDefine.Boolean(UserDefineKey.REGULATORY_DOMAIN_ISM_2400, true),
      // binding
      UserDefine.Text(UserDefineKey.BINDING_PHRASE, '', true),
      // hybrid switches
      UserDefine.Boolean(UserDefineKey.HYBRID_SWITCHES_8, true),
      UserDefine.Boolean(UserDefineKey.ENABLE_TELEMETRY),
      // performance options
      UserDefine.Boolean(UserDefineKey.NO_SYNC_ON_ARM),
      UserDefine.Boolean(UserDefineKey.LOCK_ON_FIRST_CONNECTION, true),
      UserDefine.Boolean(UserDefineKey.USE_500HZ),
    ];

    const DIY_2400_RX_ESP8285_SX1280: UserDefine[] = [
      // regulatory options
      UserDefine.Boolean(UserDefineKey.REGULATORY_DOMAIN_ISM_2400, true),
      // binding
      UserDefine.Text(UserDefineKey.BINDING_PHRASE, '', true),
      // hybrid switches
      UserDefine.Boolean(UserDefineKey.HYBRID_SWITCHES_8, true),
      UserDefine.Boolean(UserDefineKey.ENABLE_TELEMETRY),
      // performance options
      UserDefine.Boolean(UserDefineKey.NO_SYNC_ON_ARM),
      UserDefine.Boolean(UserDefineKey.LOCK_ON_FIRST_CONNECTION, true),
      UserDefine.Boolean(UserDefineKey.USE_500HZ),
      // other options
      UserDefine.Boolean(UserDefineKey.AUTO_WIFI_ON_BOOT),
      UserDefine.Text(UserDefineKey.AUTO_WIFI_ON_INTERVAL, '20', true),
      UserDefine.Boolean(UserDefineKey.USE_DIVERSITY, false),
    ];

    const DIY_2400_RX_ESP8285_SX1280_NO_DIVERSITY: UserDefine[] = DIY_2400_RX_ESP8285_SX1280.filter(
      (item) => item.key !== UserDefineKey.USE_DIVERSITY
    );

    const DIY_2400_RX_STM32_CCG_Nano_v0_5: UserDefine[] = [
      // regulatory options
      UserDefine.Boolean(UserDefineKey.REGULATORY_DOMAIN_ISM_2400, true),
      // binding
      UserDefine.Text(UserDefineKey.BINDING_PHRASE, '', true),
      // hybrid switches
      UserDefine.Boolean(UserDefineKey.HYBRID_SWITCHES_8, true),
      UserDefine.Boolean(UserDefineKey.ENABLE_TELEMETRY),
      // performance options
      UserDefine.Boolean(UserDefineKey.NO_SYNC_ON_ARM),
      UserDefine.Boolean(UserDefineKey.LOCK_ON_FIRST_CONNECTION, true),
      UserDefine.Boolean(UserDefineKey.USE_500HZ),
    ];

    const data: DeviceOptionsByTarget = {
      // NamimnoRC VOYAGER 900
      [DeviceTarget.NamimnoRC_VOYAGER_900_TX_via_STLINK]: NamimnoRC_VOYAGER_900_TX,
      [DeviceTarget.NamimnoRC_VOYAGER_900_TX_via_WIFI]: NamimnoRC_VOYAGER_900_TX,
      [DeviceTarget.NamimnoRC_VOYAGER_900_RX_via_STLINK]: NamimnoRC_VOYAGER_900_RX,
      [DeviceTarget.NamimnoRC_VOYAGER_900_RX_via_BetaflightPassthrough]: NamimnoRC_VOYAGER_900_RX,
      [DeviceTarget.NamimnoRC_VOYAGER_900_ESP_RX_via_UART]: NamimnoRC_VOYAGER_900_ESP_RX,
      [DeviceTarget.NamimnoRC_VOYAGER_900_ESP_RX_via_BetaflightPassthrough]: NamimnoRC_VOYAGER_900_ESP_RX,
      [DeviceTarget.NamimnoRC_VOYAGER_900_ESP_RX_via_WIFI]: NamimnoRC_VOYAGER_900_ESP_RX,

      // NamimnoRC 2.4 Ghz
      [DeviceTarget.NamimnoRC_FLASH_2400_TX_via_STLINK]: NamimnoRC_FLASH_2400_TX,
      [DeviceTarget.NamimnoRC_FLASH_2400_TX_via_WIFI]: NamimnoRC_FLASH_2400_TX,
      [DeviceTarget.NamimnoRC_FLASH_2400_RX_via_STLINK]: NamimnoRC_FLASH_2400_RX,
      [DeviceTarget.NamimnoRC_FLASH_2400_RX_via_BetaflightPassthrough]: NamimnoRC_FLASH_2400_RX,
      [DeviceTarget.NamimnoRC_FLASH_2400_ESP_RX_via_UART]: NamimnoRC_FLASH_2400_ESP_RX,
      [DeviceTarget.NamimnoRC_FLASH_2400_ESP_RX_via_BetaflightPassthrough]: NamimnoRC_FLASH_2400_ESP_RX,
      [DeviceTarget.NamimnoRC_FLASH_2400_ESP_RX_via_WIFI]: NamimnoRC_FLASH_2400_ESP_RX,

      // SIYI FM30
      [DeviceTarget.FM30_TX_via_STLINK]: FM30_TX,
      [DeviceTarget.FM30_TX_via_DFU]: FM30_TX,
      [DeviceTarget.FM30_RX_MINI_via_STLINK]: FM30_RX,
      [DeviceTarget.FM30_RX_MINI_via_BetaflightPassthrough]: FM30_RX,

      // NeutronRC 900 Mhz
      [DeviceTarget.NeutronRC_900_RX_via_UART]: NeutronRC_900_RX,
      [DeviceTarget.NeutronRC_900_RX_via_BetaflightPassthrough]: NeutronRC_900_RX,
      [DeviceTarget.NeutronRC_900_RX_via_WIFI]: NeutronRC_900_RX,

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

      // R9 Slim RX
      [DeviceTarget.Frsky_RX_R9SLIM_via_STLINK]: Frsky_RX_R9SLIM,
      [DeviceTarget.Frsky_RX_R9SLIM_via_BetaflightPassthrough]: Frsky_RX_R9SLIM,

      // Happymodel 915mhz
      [DeviceTarget.HappyModel_TX_ES915TX_via_stock_BL]: HappyModel_TX_ES915TX,
      [DeviceTarget.HappyModel_TX_ES915TX_via_STLINK]: HappyModel_TX_ES915TX,
      [DeviceTarget.HappyModel_TX_ES915TX_via_WIFI]: HappyModel_TX_ES915TX,
      [DeviceTarget.HappyModel_RX_ES915RX_via_STLINK]: HappyModel_RX_ES915RX,
      [DeviceTarget.HappyModel_RX_ES915RX_via_BetaflightPassthrough]: HappyModel_RX_ES915RX,

      // Happymodel ES900 TX & RX
      [DeviceTarget.HappyModel_TX_ES900TX_via_UART]: HappyModel_TX_ES900TX,
      [DeviceTarget.HappyModel_TX_ES900TX_via_WIFI]: HappyModel_TX_ES900TX,
      [DeviceTarget.HappyModel_RX_ES900RX_via_BetaflightPassthrough]: HappyModel_RX_ES900RX,
      [DeviceTarget.HappyModel_RX_ES900RX_via_WIFI]: HappyModel_RX_ES900RX,

      // Happymodel 2.4 Ghz
      [DeviceTarget.HappyModel_ES24TX_2400_TX_via_UART]: DIY_2400_TX_ESP32_SX1280,
      [DeviceTarget.HappyModel_ES24TX_2400_TX_via_WIFI]: DIY_2400_TX_ESP32_SX1280,
      [DeviceTarget.HappyModel_EP_2400_RX_via_UART]: DIY_2400_RX_ESP8285_SX1280_NO_DIVERSITY,
      [DeviceTarget.HappyModel_EP_2400_RX_via_BetaflightPassthrough]: DIY_2400_RX_ESP8285_SX1280_NO_DIVERSITY,
      [DeviceTarget.HappyModel_EP_2400_RX_via_WIFI]: DIY_2400_RX_ESP8285_SX1280_NO_DIVERSITY,
      [DeviceTarget.HappyModel_PP_2400_RX_via_STLINK]: DIY_2400_RX_STM32_CCG_Nano_v0_5,
      [DeviceTarget.HappyModel_PP_2400_RX_via_BetaflightPassthrough]: DIY_2400_RX_STM32_CCG_Nano_v0_5,

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

      // DIY 900 Mhz TX
      [DeviceTarget.DIY_900_TX_ESP32_SX127x_E19_via_UART]: DIY_900_TX_ESP32_SX127x,
      [DeviceTarget.DIY_900_TX_ESP32_SX127x_RFM95_via_UART]: DIY_900_TX_ESP32_SX127x,
      [DeviceTarget.DIY_900_RX_ESP8285_SX127x_via_UART]: DIY_900_RX_ESP8285_SX127x,
      [DeviceTarget.DIY_900_RX_ESP8285_SX127x_via_BetaflightPassthrough]: DIY_900_RX_ESP8285_SX127x,

      // DIY 2400 Mhz TX
      [DeviceTarget.DIY_2400_TX_ESP32_SX1280_Mini_via_UART]: DIY_2400_TX_ESP32_SX1280,
      [DeviceTarget.DIY_2400_TX_ESP32_SX1280_E28_via_UART]: DIY_2400_TX_ESP32_SX1280,
      [DeviceTarget.DIY_2400_TX_ESP32_SX1280_LORA1280F27_via_UART]: DIY_2400_TX_ESP32_SX1280,

      // Ghost TX
      [DeviceTarget.GHOST_2400_TX_via_STLINK]: GHOST_2400_TX,
      [DeviceTarget.GHOST_2400_TX_LITE_via_STLINK]: GHOST_2400_TX,

      // GHOST_ATTO_2400_RX
      [DeviceTarget.GHOST_ATTO_2400_RX_via_STLINK]: GHOST_ATTO_2400_RX,
      [DeviceTarget.GHOST_ATTO_2400_RX_via_BetaflightPassthrough]: GHOST_ATTO_2400_RX,

      // DIY_2400_RX_ESP8285_SX1280
      [DeviceTarget.DIY_2400_RX_ESP8285_SX1280_via_UART]: DIY_2400_RX_ESP8285_SX1280,
      [DeviceTarget.DIY_2400_RX_ESP8285_SX1280_via_WIFI]: DIY_2400_RX_ESP8285_SX1280,
      [DeviceTarget.DIY_2400_RX_ESP8285_SX1280_via_BetaflightPassthrough]: DIY_2400_RX_ESP8285_SX1280,

      // DIY_2400_RX_STM32_CCG_Nano_v0_5
      [DeviceTarget.DIY_2400_RX_STM32_CCG_Nano_v0_5_via_STLINK]: DIY_2400_RX_STM32_CCG_Nano_v0_5,
      [DeviceTarget.DIY_2400_RX_STM32_CCG_Nano_v0_5_via_BetaflightPassthrough]: DIY_2400_RX_STM32_CCG_Nano_v0_5,

      // BETAFPV 900
      [DeviceTarget.BETAFPV_900_TX_via_UART]: DIY_900_TX_ESP32_SX127x,
      [DeviceTarget.BETAFPV_900_TX_via_WIFI]: DIY_900_TX_ESP32_SX127x,
      [DeviceTarget.BETAFPV_900_RX_via_UART]: DIY_900_RX_ESP8285_SX127x,
      [DeviceTarget.BETAFPV_900_RX_via_WIFI]: DIY_900_RX_ESP8285_SX127x,
      [DeviceTarget.BETAFPV_900_RX_via_BetaflightPassthrough]: DIY_900_RX_ESP8285_SX127x,

      // BETAFPV 2.4 Ghz
      [DeviceTarget.BETAFPV_2400_TX_via_UART]: DIY_2400_TX_ESP32_SX1280,
      [DeviceTarget.BETAFPV_2400_TX_via_WIFI]: DIY_2400_TX_ESP32_SX1280,
      [DeviceTarget.BETAFPV_2400_RX_via_UART]: DIY_2400_RX_ESP8285_SX1280,
      [DeviceTarget.BETAFPV_2400_RX_via_WIFI]: DIY_2400_RX_ESP8285_SX1280,
      [DeviceTarget.BETAFPV_2400_RX_via_BetaflightPassthrough]: DIY_2400_RX_ESP8285_SX1280,

      // HGLRC Hermes 900
      [DeviceTarget.HGLRC_Hermes_900_RX_via_UART]: DIY_900_RX_ESP8285_SX127x,
      [DeviceTarget.HGLRC_Hermes_900_RX_via_BetaflightPassthrough]: DIY_900_RX_ESP8285_SX127x,
      [DeviceTarget.HGLRC_Hermes_900_RX_via_WIFI]: DIY_900_RX_ESP8285_SX127x,

      // HGLRC Hermes 2.4 Ghz
      [DeviceTarget.HGLRC_Hermes_2400_TX_via_UART]: DIY_2400_TX_ESP32_SX1280,
      [DeviceTarget.HGLRC_Hermes_2400_TX_via_WIFI]: DIY_2400_TX_ESP32_SX1280,
      [DeviceTarget.HGLRC_Hermes_2400_RX_via_UART]: DIY_2400_RX_ESP8285_SX1280_NO_DIVERSITY,
      [DeviceTarget.HGLRC_Hermes_2400_RX_via_BetaflightPassthrough]: DIY_2400_RX_ESP8285_SX1280_NO_DIVERSITY,
      [DeviceTarget.HGLRC_Hermes_2400_RX_via_WIFI]: DIY_2400_RX_ESP8285_SX1280_NO_DIVERSITY,
    };

    if (data[target] === undefined) {
      throw new Error(`target ${target} configuration does not exist`);
    }

    return data[target];
  }
}
