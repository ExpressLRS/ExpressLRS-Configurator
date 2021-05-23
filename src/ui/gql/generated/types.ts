import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';

export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K];
};
export type MakeOptional<T, K extends keyof T> = Omit<T, K> &
  { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> &
  { [SubKey in K]: Maybe<T[SubKey]> };
const defaultOptions = {};
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type Query = {
  readonly __typename?: 'Query';
  readonly availableFirmwareTargets: ReadonlyArray<DeviceTarget>;
  readonly targetDeviceOptions: ReadonlyArray<UserDefine>;
  readonly gitBranches: ReadonlyArray<Scalars['String']>;
  readonly gitTags: ReadonlyArray<Scalars['String']>;
  readonly checkForUpdates: UpdatesAvailability;
  readonly availableDevicesList: ReadonlyArray<SerialPortInformation>;
};

export type QueryTargetDeviceOptionsArgs = {
  target?: Maybe<DeviceTarget>;
  source?: Maybe<FirmwareSource>;
  gitTag?: Maybe<Scalars['String']>;
  gitBranch?: Maybe<Scalars['String']>;
  gitCommit?: Maybe<Scalars['String']>;
  localPath?: Maybe<Scalars['String']>;
};

export type QueryCheckForUpdatesArgs = {
  currentVersion: Scalars['String'];
};

export enum DeviceTarget {
  Frsky_TX_R9M_via_STLINK = 'Frsky_TX_R9M_via_STLINK',
  Frsky_TX_R9M_via_stock_BL = 'Frsky_TX_R9M_via_stock_BL',
  Frsky_TX_R9M_via_WIFI = 'Frsky_TX_R9M_via_WIFI',
  Frsky_TX_R9M_LITE_via_STLINK = 'Frsky_TX_R9M_LITE_via_STLINK',
  Frsky_TX_R9M_LITE_via_stock_BL = 'Frsky_TX_R9M_LITE_via_stock_BL',
  Frsky_TX_R9M_LITE_PRO_via_STLINK = 'Frsky_TX_R9M_LITE_PRO_via_STLINK',
  Frsky_RX_R9MM_R9MINI_via_STLINK = 'Frsky_RX_R9MM_R9MINI_via_STLINK',
  Frsky_RX_R9MM_R9MINI_via_BetaflightPassthrough = 'Frsky_RX_R9MM_R9MINI_via_BetaflightPassthrough',
  Frsky_RX_R9SLIMPLUS_via_STLINK = 'Frsky_RX_R9SLIMPLUS_via_STLINK',
  Frsky_RX_R9SLIMPLUS_via_BetaflightPassthrough = 'Frsky_RX_R9SLIMPLUS_via_BetaflightPassthrough',
  Frsky_RX_R9SLIM_via_STLINK = 'Frsky_RX_R9SLIM_via_STLINK',
  Frsky_RX_R9SLIM_via_BetaflightPassthrough = 'Frsky_RX_R9SLIM_via_BetaflightPassthrough',
  Frsky_RX_R9SLIMPLUS_OTA_via_STLINK = 'Frsky_RX_R9SLIMPLUS_OTA_via_STLINK',
  Frsky_RX_R9SLIMPLUS_OTA_via_BetaflightPassthrough = 'Frsky_RX_R9SLIMPLUS_OTA_via_BetaflightPassthrough',
  Frsky_RX_R9MX_via_STLINK = 'Frsky_RX_R9MX_via_STLINK',
  Frsky_RX_R9MX_via_BetaflightPassthrough = 'Frsky_RX_R9MX_via_BetaflightPassthrough',
  Jumper_RX_R900MINI_via_STLINK = 'Jumper_RX_R900MINI_via_STLINK',
  Jumper_RX_R900MINI_via_BetaflightPassthrough = 'Jumper_RX_R900MINI_via_BetaflightPassthrough',
  HappyModel_ES24TX_2400_TX_via_UART = 'HappyModel_ES24TX_2400_TX_via_UART',
  HappyModel_ES24TX_2400_TX_via_WIFI = 'HappyModel_ES24TX_2400_TX_via_WIFI',
  HappyModel_EP_2400_RX_via_UART = 'HappyModel_EP_2400_RX_via_UART',
  HappyModel_EP_2400_RX_via_BetaflightPassthrough = 'HappyModel_EP_2400_RX_via_BetaflightPassthrough',
  HappyModel_EP_2400_RX_via_WIFI = 'HappyModel_EP_2400_RX_via_WIFI',
  HappyModel_PP_2400_RX_via_STLINK = 'HappyModel_PP_2400_RX_via_STLINK',
  HappyModel_PP_2400_RX_via_BetaflightPassthrough = 'HappyModel_PP_2400_RX_via_BetaflightPassthrough',
  HappyModel_TX_ES915TX_via_STLINK = 'HappyModel_TX_ES915TX_via_STLINK',
  HappyModel_TX_ES915TX_via_stock_BL = 'HappyModel_TX_ES915TX_via_stock_BL',
  HappyModel_RX_ES915RX_via_STLINK = 'HappyModel_RX_ES915RX_via_STLINK',
  HappyModel_RX_ES915RX_via_BetaflightPassthrough = 'HappyModel_RX_ES915RX_via_BetaflightPassthrough',
  DIY_900_TX_TTGO_V1_SX127x_via_UART = 'DIY_900_TX_TTGO_V1_SX127x_via_UART',
  DIY_900_TX_TTGO_V2_SX127x_via_UART = 'DIY_900_TX_TTGO_V2_SX127x_via_UART',
  DIY_900_TX_ESP32_SX127x_E19_via_UART = 'DIY_900_TX_ESP32_SX127x_E19_via_UART',
  DIY_900_TX_ESP32_SX127x_RFM95_via_UART = 'DIY_900_TX_ESP32_SX127x_RFM95_via_UART',
  DIY_900_RX_ESP8285_SX127x_via_UART = 'DIY_900_RX_ESP8285_SX127x_via_UART',
  DIY_900_RX_ESP8285_SX127x_via_BetaflightPassthrough = 'DIY_900_RX_ESP8285_SX127x_via_BetaflightPassthrough',
  DIY_2400_TX_ESP32_SX1280_Mini_via_UART = 'DIY_2400_TX_ESP32_SX1280_Mini_via_UART',
  DIY_2400_TX_ESP32_SX1280_E28_via_UART = 'DIY_2400_TX_ESP32_SX1280_E28_via_UART',
  DIY_2400_TX_ESP32_SX1280_LORA1280F27_via_UART = 'DIY_2400_TX_ESP32_SX1280_LORA1280F27_via_UART',
  GHOST_2400_TX_via_STLINK = 'GHOST_2400_TX_via_STLINK',
  GHOST_2400_TX_LITE_via_STLINK = 'GHOST_2400_TX_LITE_via_STLINK',
  GHOST_ATTO_2400_RX_via_STLINK = 'GHOST_ATTO_2400_RX_via_STLINK',
  GHOST_ATTO_2400_RX_via_BetaflightPassthrough = 'GHOST_ATTO_2400_RX_via_BetaflightPassthrough',
  DIY_2400_RX_ESP8285_SX1280_via_UART = 'DIY_2400_RX_ESP8285_SX1280_via_UART',
  DIY_2400_RX_ESP8285_SX1280_via_WIFI = 'DIY_2400_RX_ESP8285_SX1280_via_WIFI',
  DIY_2400_RX_ESP8285_SX1280_via_BetaflightPassthrough = 'DIY_2400_RX_ESP8285_SX1280_via_BetaflightPassthrough',
  DIY_2400_RX_STM32_CCG_Nano_v0_5_via_STLINK = 'DIY_2400_RX_STM32_CCG_Nano_v0_5_via_STLINK',
  DIY_2400_RX_STM32_CCG_Nano_v0_5_via_BetaflightPassthrough = 'DIY_2400_RX_STM32_CCG_Nano_v0_5_via_BetaflightPassthrough',
  NamimnoRC_VOYAGER_900_TX_via_STLINK = 'NamimnoRC_VOYAGER_900_TX_via_STLINK',
  NamimnoRC_VOYAGER_900_TX_via_WIFI = 'NamimnoRC_VOYAGER_900_TX_via_WIFI',
  NamimnoRC_VOYAGER_900_RX_via_STLINK = 'NamimnoRC_VOYAGER_900_RX_via_STLINK',
  NamimnoRC_VOYAGER_900_RX_via_BetaflightPassthrough = 'NamimnoRC_VOYAGER_900_RX_via_BetaflightPassthrough',
  NamimnoRC_VOYAGER_900_ESP_RX_via_UART = 'NamimnoRC_VOYAGER_900_ESP_RX_via_UART',
  NamimnoRC_VOYAGER_900_ESP_RX_via_BetaflightPassthrough = 'NamimnoRC_VOYAGER_900_ESP_RX_via_BetaflightPassthrough',
  NamimnoRC_VOYAGER_900_ESP_RX_via_WIFI = 'NamimnoRC_VOYAGER_900_ESP_RX_via_WIFI',
  NamimnoRC_FLASH_2400_TX_via_STLINK = 'NamimnoRC_FLASH_2400_TX_via_STLINK',
  NamimnoRC_FLASH_2400_TX_via_WIFI = 'NamimnoRC_FLASH_2400_TX_via_WIFI',
  NamimnoRC_FLASH_2400_RX_via_STLINK = 'NamimnoRC_FLASH_2400_RX_via_STLINK',
  NamimnoRC_FLASH_2400_RX_via_BetaflightPassthrough = 'NamimnoRC_FLASH_2400_RX_via_BetaflightPassthrough',
  NamimnoRC_FLASH_2400_ESP_RX_via_UART = 'NamimnoRC_FLASH_2400_ESP_RX_via_UART',
  NamimnoRC_FLASH_2400_ESP_RX_via_BetaflightPassthrough = 'NamimnoRC_FLASH_2400_ESP_RX_via_BetaflightPassthrough',
  NamimnoRC_FLASH_2400_ESP_RX_via_WIFI = 'NamimnoRC_FLASH_2400_ESP_RX_via_WIFI',
  FM30_TX_via_STLINK = 'FM30_TX_via_STLINK',
  FM30_TX_via_DFU = 'FM30_TX_via_DFU',
  FM30_RX_MINI_via_STLINK = 'FM30_RX_MINI_via_STLINK',
  FM30_RX_MINI_via_BetaflightPassthrough = 'FM30_RX_MINI_via_BetaflightPassthrough',
  NeutronRC_900_RX_via_UART = 'NeutronRC_900_RX_via_UART',
  NeutronRC_900_RX_via_BetaflightPassthrough = 'NeutronRC_900_RX_via_BetaflightPassthrough',
  NeutronRC_900_RX_via_WIFI = 'NeutronRC_900_RX_via_WIFI',
}

export type UserDefine = {
  readonly __typename?: 'UserDefine';
  readonly type: UserDefineKind;
  readonly key: UserDefineKey;
  readonly enabled: Scalars['Boolean'];
  readonly enumValues?: Maybe<ReadonlyArray<Scalars['String']>>;
  readonly value?: Maybe<Scalars['String']>;
};

export enum UserDefineKind {
  Boolean = 'Boolean',
  Text = 'Text',
  Enum = 'Enum',
}

export enum UserDefineKey {
  BINDING_PHRASE = 'BINDING_PHRASE',
  REGULATORY_DOMAIN_AU_915 = 'REGULATORY_DOMAIN_AU_915',
  REGULATORY_DOMAIN_EU_868 = 'REGULATORY_DOMAIN_EU_868',
  REGULATORY_DOMAIN_AU_433 = 'REGULATORY_DOMAIN_AU_433',
  REGULATORY_DOMAIN_EU_433 = 'REGULATORY_DOMAIN_EU_433',
  REGULATORY_DOMAIN_FCC_915 = 'REGULATORY_DOMAIN_FCC_915',
  REGULATORY_DOMAIN_ISM_2400 = 'REGULATORY_DOMAIN_ISM_2400',
  HYBRID_SWITCHES_8 = 'HYBRID_SWITCHES_8',
  ENABLE_TELEMETRY = 'ENABLE_TELEMETRY',
  TLM_REPORT_INTERVAL_MS = 'TLM_REPORT_INTERVAL_MS',
  FAST_SYNC = 'FAST_SYNC',
  R9M_UNLOCK_HIGHER_POWER = 'R9M_UNLOCK_HIGHER_POWER',
  UNLOCK_HIGHER_POWER = 'UNLOCK_HIGHER_POWER',
  USE_DIVERSITY = 'USE_DIVERSITY',
  NO_SYNC_ON_ARM = 'NO_SYNC_ON_ARM',
  ARM_CHANNEL = 'ARM_CHANNEL',
  FEATURE_OPENTX_SYNC = 'FEATURE_OPENTX_SYNC',
  FEATURE_OPENTX_SYNC_AUTOTUNE = 'FEATURE_OPENTX_SYNC_AUTOTUNE',
  LOCK_ON_FIRST_CONNECTION = 'LOCK_ON_FIRST_CONNECTION',
  LOCK_ON_50HZ = 'LOCK_ON_50HZ',
  USE_UART2 = 'USE_UART2',
  UART_INVERTED = 'UART_INVERTED',
  USE_R9MM_R9MINI_SBUS = 'USE_R9MM_R9MINI_SBUS',
  BLE_HID_JOYSTICK = 'BLE_HID_JOYSTICK',
  AUTO_WIFI_ON_BOOT = 'AUTO_WIFI_ON_BOOT',
  AUTO_WIFI_ON_INTERVAL = 'AUTO_WIFI_ON_INTERVAL',
  USE_ESP8266_BACKPACK = 'USE_ESP8266_BACKPACK',
  JUST_BEEP_ONCE = 'JUST_BEEP_ONCE',
  DISABLE_STARTUP_BEEP = 'DISABLE_STARTUP_BEEP',
  MY_STARTUP_MELODY = 'MY_STARTUP_MELODY',
  USE_500HZ = 'USE_500HZ',
}

export enum FirmwareSource {
  GitTag = 'GitTag',
  GitBranch = 'GitBranch',
  GitCommit = 'GitCommit',
  Local = 'Local',
}

export type UpdatesAvailability = {
  readonly __typename?: 'UpdatesAvailability';
  readonly updateAvailable: Scalars['Boolean'];
  readonly newestVersion: Scalars['String'];
  readonly releaseUrl: Scalars['String'];
};

export type SerialPortInformation = {
  readonly __typename?: 'SerialPortInformation';
  readonly path: Scalars['String'];
  readonly manufacturer: Scalars['String'];
};

export type Mutation = {
  readonly __typename?: 'Mutation';
  readonly buildFlashFirmware: BuildFlashFirmwareResult;
  readonly clearPlatformioCoreDir: ClearPlatformioCoreDirResult;
  readonly connectToSerialDevice: SerialPortConnectResult;
  readonly disconnectFromSerialDevice: SerialPortDisconnectResult;
};

export type MutationBuildFlashFirmwareArgs = {
  input: BuildFlashFirmwareInput;
};

export type MutationConnectToSerialDeviceArgs = {
  input: SerialConnectionConfigInput;
};

export type BuildFlashFirmwareResult = {
  readonly __typename?: 'BuildFlashFirmwareResult';
  readonly success: Scalars['Boolean'];
  readonly errorType?: Maybe<BuildFirmwareErrorType>;
  readonly message?: Maybe<Scalars['String']>;
  readonly firmwareBinPath?: Maybe<Scalars['String']>;
};

export enum BuildFirmwareErrorType {
  PythonDependencyError = 'PythonDependencyError',
  PlatformioDependencyError = 'PlatformioDependencyError',
  GitDependencyError = 'GitDependencyError',
  BuildError = 'BuildError',
  FlashError = 'FlashError',
  GenericError = 'GenericError',
}

export type BuildFlashFirmwareInput = {
  readonly type?: Maybe<BuildJobType>;
  readonly serialDevice?: Maybe<Scalars['String']>;
  readonly firmware?: Maybe<FirmwareVersionDataInput>;
  readonly target?: Maybe<DeviceTarget>;
  readonly userDefinesMode?: Maybe<UserDefinesMode>;
  readonly userDefines?: Maybe<ReadonlyArray<UserDefineInput>>;
  readonly userDefinesTxt?: Maybe<Scalars['String']>;
};

export enum BuildJobType {
  Build = 'Build',
  BuildAndFlash = 'BuildAndFlash',
}

export type FirmwareVersionDataInput = {
  readonly source?: Maybe<FirmwareSource>;
  readonly gitTag?: Maybe<Scalars['String']>;
  readonly gitBranch?: Maybe<Scalars['String']>;
  readonly gitCommit?: Maybe<Scalars['String']>;
  readonly localPath?: Maybe<Scalars['String']>;
};

export enum UserDefinesMode {
  UserInterface = 'UserInterface',
  Manual = 'Manual',
}

export type UserDefineInput = {
  readonly type?: Maybe<UserDefineKind>;
  readonly key?: Maybe<UserDefineKey>;
  readonly enabled?: Maybe<Scalars['Boolean']>;
  readonly enumValues?: Maybe<ReadonlyArray<Scalars['String']>>;
  readonly value?: Maybe<Scalars['String']>;
};

export type ClearPlatformioCoreDirResult = {
  readonly __typename?: 'ClearPlatformioCoreDirResult';
  readonly success: Scalars['Boolean'];
  readonly message?: Maybe<Scalars['String']>;
};

export type SerialPortConnectResult = {
  readonly __typename?: 'SerialPortConnectResult';
  readonly success: Scalars['Boolean'];
  readonly message?: Maybe<Scalars['String']>;
};

export type SerialConnectionConfigInput = {
  readonly port?: Maybe<Scalars['String']>;
  readonly baudRate?: Maybe<Scalars['Float']>;
};

export type SerialPortDisconnectResult = {
  readonly __typename?: 'SerialPortDisconnectResult';
  readonly success: Scalars['Boolean'];
  readonly message?: Maybe<Scalars['String']>;
};

export type Subscription = {
  readonly __typename?: 'Subscription';
  readonly buildProgressNotifications: BuildProgressNotification;
  readonly buildLogUpdates: BuildLogUpdate;
  readonly serialMonitorLogs: SerialMonitorLogUpdate;
  readonly serialMonitorEvents: SerialMonitorEvent;
};

export type BuildProgressNotification = {
  readonly __typename?: 'BuildProgressNotification';
  readonly type: BuildProgressNotificationType;
  readonly step?: Maybe<BuildFirmwareStep>;
  readonly message?: Maybe<Scalars['String']>;
};

export enum BuildProgressNotificationType {
  Success = 'Success',
  Info = 'Info',
  Error = 'Error',
}

export enum BuildFirmwareStep {
  VERIFYING_BUILD_SYSTEM = 'VERIFYING_BUILD_SYSTEM',
  DOWNLOADING_FIRMWARE = 'DOWNLOADING_FIRMWARE',
  BUILDING_USER_DEFINES = 'BUILDING_USER_DEFINES',
  BUILDING_FIRMWARE = 'BUILDING_FIRMWARE',
  FLASHING_FIRMWARE = 'FLASHING_FIRMWARE',
}

export type BuildLogUpdate = {
  readonly __typename?: 'BuildLogUpdate';
  readonly data: Scalars['String'];
};

export type SerialMonitorLogUpdate = {
  readonly __typename?: 'SerialMonitorLogUpdate';
  readonly data: Scalars['String'];
};

export type SerialMonitorEvent = {
  readonly __typename?: 'SerialMonitorEvent';
  readonly type: SerialMonitorEventType;
};

export enum SerialMonitorEventType {
  Connecting = 'Connecting',
  Connected = 'Connected',
  Disconnected = 'Disconnected',
  Error = 'Error',
}

export type AvailableDevicesListQueryVariables = Exact<{
  [key: string]: never;
}>;

export type AvailableDevicesListQuery = { readonly __typename?: 'Query' } & {
  readonly availableDevicesList: ReadonlyArray<
    { readonly __typename?: 'SerialPortInformation' } & Pick<
      SerialPortInformation,
      'path' | 'manufacturer'
    >
  >;
};

export type AvailableFirmwareTargetsQueryVariables = Exact<{
  [key: string]: never;
}>;

export type AvailableFirmwareTargetsQuery = {
  readonly __typename?: 'Query';
} & Pick<Query, 'availableFirmwareTargets'>;

export type BuildFlashFirmwareMutationVariables = Exact<{
  input: BuildFlashFirmwareInput;
}>;

export type BuildFlashFirmwareMutation = {
  readonly __typename?: 'Mutation';
} & {
  readonly buildFlashFirmware: {
    readonly __typename?: 'BuildFlashFirmwareResult';
  } & Pick<
    BuildFlashFirmwareResult,
    'success' | 'errorType' | 'message' | 'firmwareBinPath'
  >;
};

export type BuildLogUpdatesSubscriptionVariables = Exact<{
  [key: string]: never;
}>;

export type BuildLogUpdatesSubscription = {
  readonly __typename?: 'Subscription';
} & {
  readonly buildLogUpdates: { readonly __typename?: 'BuildLogUpdate' } & Pick<
    BuildLogUpdate,
    'data'
  >;
};

export type BuildProgressNotificationsSubscriptionVariables = Exact<{
  [key: string]: never;
}>;

export type BuildProgressNotificationsSubscription = {
  readonly __typename?: 'Subscription';
} & {
  readonly buildProgressNotifications: {
    readonly __typename?: 'BuildProgressNotification';
  } & Pick<BuildProgressNotification, 'type' | 'step' | 'message'>;
};

export type CheckForUpdatesQueryVariables = Exact<{
  currentVersion: Scalars['String'];
}>;

export type CheckForUpdatesQuery = { readonly __typename?: 'Query' } & {
  readonly checkForUpdates: {
    readonly __typename?: 'UpdatesAvailability';
  } & Pick<
    UpdatesAvailability,
    'updateAvailable' | 'newestVersion' | 'releaseUrl'
  >;
};

export type ClearPlatformioCoreDirMutationVariables = Exact<{
  [key: string]: never;
}>;

export type ClearPlatformioCoreDirMutation = {
  readonly __typename?: 'Mutation';
} & {
  readonly clearPlatformioCoreDir: {
    readonly __typename?: 'ClearPlatformioCoreDirResult';
  } & Pick<ClearPlatformioCoreDirResult, 'success' | 'message'>;
};

export type ConnectToSerialDeviceMutationVariables = Exact<{
  input: SerialConnectionConfigInput;
}>;

export type ConnectToSerialDeviceMutation = {
  readonly __typename?: 'Mutation';
} & {
  readonly connectToSerialDevice: {
    readonly __typename?: 'SerialPortConnectResult';
  } & Pick<SerialPortConnectResult, 'success' | 'message'>;
};

export type TargetDeviceOptionsQueryVariables = Exact<{
  target: DeviceTarget;
  source: FirmwareSource;
  gitTag: Scalars['String'];
  gitBranch: Scalars['String'];
  gitCommit: Scalars['String'];
  localPath: Scalars['String'];
}>;

export type TargetDeviceOptionsQuery = { readonly __typename?: 'Query' } & {
  readonly targetDeviceOptions: ReadonlyArray<
    { readonly __typename?: 'UserDefine' } & Pick<
      UserDefine,
      'type' | 'key' | 'enabled' | 'enumValues' | 'value'
    >
  >;
};

export type DisconnectFromSerialDeviceMutationVariables = Exact<{
  [key: string]: never;
}>;

export type DisconnectFromSerialDeviceMutation = {
  readonly __typename?: 'Mutation';
} & {
  readonly disconnectFromSerialDevice: {
    readonly __typename?: 'SerialPortDisconnectResult';
  } & Pick<SerialPortDisconnectResult, 'success' | 'message'>;
};

export type GetBranchesQueryVariables = Exact<{ [key: string]: never }>;

export type GetBranchesQuery = { readonly __typename?: 'Query' } & Pick<
  Query,
  'gitBranches'
>;

export type GetTagsQueryVariables = Exact<{ [key: string]: never }>;

export type GetTagsQuery = { readonly __typename?: 'Query' } & Pick<
  Query,
  'gitTags'
>;

export type SerialMonitorEventsSubscriptionVariables = Exact<{
  [key: string]: never;
}>;

export type SerialMonitorEventsSubscription = {
  readonly __typename?: 'Subscription';
} & {
  readonly serialMonitorEvents: {
    readonly __typename?: 'SerialMonitorEvent';
  } & Pick<SerialMonitorEvent, 'type'>;
};

export type SerialMonitorLogsSubscriptionVariables = Exact<{
  [key: string]: never;
}>;

export type SerialMonitorLogsSubscription = {
  readonly __typename?: 'Subscription';
} & {
  readonly serialMonitorLogs: {
    readonly __typename?: 'SerialMonitorLogUpdate';
  } & Pick<SerialMonitorLogUpdate, 'data'>;
};

export const AvailableDevicesListDocument = gql`
  query availableDevicesList {
    availableDevicesList {
      path
      manufacturer
    }
  }
`;

/**
 * __useAvailableDevicesListQuery__
 *
 * To run a query within a React component, call `useAvailableDevicesListQuery` and pass it any options that fit your needs.
 * When your component renders, `useAvailableDevicesListQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useAvailableDevicesListQuery({
 *   variables: {
 *   },
 * });
 */
export function useAvailableDevicesListQuery(
  baseOptions?: Apollo.QueryHookOptions<
    AvailableDevicesListQuery,
    AvailableDevicesListQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<
    AvailableDevicesListQuery,
    AvailableDevicesListQueryVariables
  >(AvailableDevicesListDocument, options);
}
export function useAvailableDevicesListLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    AvailableDevicesListQuery,
    AvailableDevicesListQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    AvailableDevicesListQuery,
    AvailableDevicesListQueryVariables
  >(AvailableDevicesListDocument, options);
}
export type AvailableDevicesListQueryHookResult = ReturnType<
  typeof useAvailableDevicesListQuery
>;
export type AvailableDevicesListLazyQueryHookResult = ReturnType<
  typeof useAvailableDevicesListLazyQuery
>;
export type AvailableDevicesListQueryResult = Apollo.QueryResult<
  AvailableDevicesListQuery,
  AvailableDevicesListQueryVariables
>;
export const AvailableFirmwareTargetsDocument = gql`
  query availableFirmwareTargets {
    availableFirmwareTargets
  }
`;

/**
 * __useAvailableFirmwareTargetsQuery__
 *
 * To run a query within a React component, call `useAvailableFirmwareTargetsQuery` and pass it any options that fit your needs.
 * When your component renders, `useAvailableFirmwareTargetsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useAvailableFirmwareTargetsQuery({
 *   variables: {
 *   },
 * });
 */
export function useAvailableFirmwareTargetsQuery(
  baseOptions?: Apollo.QueryHookOptions<
    AvailableFirmwareTargetsQuery,
    AvailableFirmwareTargetsQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<
    AvailableFirmwareTargetsQuery,
    AvailableFirmwareTargetsQueryVariables
  >(AvailableFirmwareTargetsDocument, options);
}
export function useAvailableFirmwareTargetsLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    AvailableFirmwareTargetsQuery,
    AvailableFirmwareTargetsQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    AvailableFirmwareTargetsQuery,
    AvailableFirmwareTargetsQueryVariables
  >(AvailableFirmwareTargetsDocument, options);
}
export type AvailableFirmwareTargetsQueryHookResult = ReturnType<
  typeof useAvailableFirmwareTargetsQuery
>;
export type AvailableFirmwareTargetsLazyQueryHookResult = ReturnType<
  typeof useAvailableFirmwareTargetsLazyQuery
>;
export type AvailableFirmwareTargetsQueryResult = Apollo.QueryResult<
  AvailableFirmwareTargetsQuery,
  AvailableFirmwareTargetsQueryVariables
>;
export const BuildFlashFirmwareDocument = gql`
  mutation buildFlashFirmware($input: BuildFlashFirmwareInput!) {
    buildFlashFirmware(input: $input) {
      success
      errorType
      message
      firmwareBinPath
    }
  }
`;
export type BuildFlashFirmwareMutationFn = Apollo.MutationFunction<
  BuildFlashFirmwareMutation,
  BuildFlashFirmwareMutationVariables
>;

/**
 * __useBuildFlashFirmwareMutation__
 *
 * To run a mutation, you first call `useBuildFlashFirmwareMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useBuildFlashFirmwareMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [buildFlashFirmwareMutation, { data, loading, error }] = useBuildFlashFirmwareMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useBuildFlashFirmwareMutation(
  baseOptions?: Apollo.MutationHookOptions<
    BuildFlashFirmwareMutation,
    BuildFlashFirmwareMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    BuildFlashFirmwareMutation,
    BuildFlashFirmwareMutationVariables
  >(BuildFlashFirmwareDocument, options);
}
export type BuildFlashFirmwareMutationHookResult = ReturnType<
  typeof useBuildFlashFirmwareMutation
>;
export type BuildFlashFirmwareMutationResult = Apollo.MutationResult<BuildFlashFirmwareMutation>;
export type BuildFlashFirmwareMutationOptions = Apollo.BaseMutationOptions<
  BuildFlashFirmwareMutation,
  BuildFlashFirmwareMutationVariables
>;
export const BuildLogUpdatesDocument = gql`
  subscription buildLogUpdates {
    buildLogUpdates {
      data
    }
  }
`;

/**
 * __useBuildLogUpdatesSubscription__
 *
 * To run a query within a React component, call `useBuildLogUpdatesSubscription` and pass it any options that fit your needs.
 * When your component renders, `useBuildLogUpdatesSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useBuildLogUpdatesSubscription({
 *   variables: {
 *   },
 * });
 */
export function useBuildLogUpdatesSubscription(
  baseOptions?: Apollo.SubscriptionHookOptions<
    BuildLogUpdatesSubscription,
    BuildLogUpdatesSubscriptionVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useSubscription<
    BuildLogUpdatesSubscription,
    BuildLogUpdatesSubscriptionVariables
  >(BuildLogUpdatesDocument, options);
}
export type BuildLogUpdatesSubscriptionHookResult = ReturnType<
  typeof useBuildLogUpdatesSubscription
>;
export type BuildLogUpdatesSubscriptionResult = Apollo.SubscriptionResult<BuildLogUpdatesSubscription>;
export const BuildProgressNotificationsDocument = gql`
  subscription buildProgressNotifications {
    buildProgressNotifications {
      type
      step
      message
    }
  }
`;

/**
 * __useBuildProgressNotificationsSubscription__
 *
 * To run a query within a React component, call `useBuildProgressNotificationsSubscription` and pass it any options that fit your needs.
 * When your component renders, `useBuildProgressNotificationsSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useBuildProgressNotificationsSubscription({
 *   variables: {
 *   },
 * });
 */
export function useBuildProgressNotificationsSubscription(
  baseOptions?: Apollo.SubscriptionHookOptions<
    BuildProgressNotificationsSubscription,
    BuildProgressNotificationsSubscriptionVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useSubscription<
    BuildProgressNotificationsSubscription,
    BuildProgressNotificationsSubscriptionVariables
  >(BuildProgressNotificationsDocument, options);
}
export type BuildProgressNotificationsSubscriptionHookResult = ReturnType<
  typeof useBuildProgressNotificationsSubscription
>;
export type BuildProgressNotificationsSubscriptionResult = Apollo.SubscriptionResult<BuildProgressNotificationsSubscription>;
export const CheckForUpdatesDocument = gql`
  query checkForUpdates($currentVersion: String!) {
    checkForUpdates(currentVersion: $currentVersion) {
      updateAvailable
      newestVersion
      releaseUrl
    }
  }
`;

/**
 * __useCheckForUpdatesQuery__
 *
 * To run a query within a React component, call `useCheckForUpdatesQuery` and pass it any options that fit your needs.
 * When your component renders, `useCheckForUpdatesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCheckForUpdatesQuery({
 *   variables: {
 *      currentVersion: // value for 'currentVersion'
 *   },
 * });
 */
export function useCheckForUpdatesQuery(
  baseOptions: Apollo.QueryHookOptions<
    CheckForUpdatesQuery,
    CheckForUpdatesQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<CheckForUpdatesQuery, CheckForUpdatesQueryVariables>(
    CheckForUpdatesDocument,
    options
  );
}
export function useCheckForUpdatesLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    CheckForUpdatesQuery,
    CheckForUpdatesQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    CheckForUpdatesQuery,
    CheckForUpdatesQueryVariables
  >(CheckForUpdatesDocument, options);
}
export type CheckForUpdatesQueryHookResult = ReturnType<
  typeof useCheckForUpdatesQuery
>;
export type CheckForUpdatesLazyQueryHookResult = ReturnType<
  typeof useCheckForUpdatesLazyQuery
>;
export type CheckForUpdatesQueryResult = Apollo.QueryResult<
  CheckForUpdatesQuery,
  CheckForUpdatesQueryVariables
>;
export const ClearPlatformioCoreDirDocument = gql`
  mutation clearPlatformioCoreDir {
    clearPlatformioCoreDir {
      success
      message
    }
  }
`;
export type ClearPlatformioCoreDirMutationFn = Apollo.MutationFunction<
  ClearPlatformioCoreDirMutation,
  ClearPlatformioCoreDirMutationVariables
>;

/**
 * __useClearPlatformioCoreDirMutation__
 *
 * To run a mutation, you first call `useClearPlatformioCoreDirMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useClearPlatformioCoreDirMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [clearPlatformioCoreDirMutation, { data, loading, error }] = useClearPlatformioCoreDirMutation({
 *   variables: {
 *   },
 * });
 */
export function useClearPlatformioCoreDirMutation(
  baseOptions?: Apollo.MutationHookOptions<
    ClearPlatformioCoreDirMutation,
    ClearPlatformioCoreDirMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    ClearPlatformioCoreDirMutation,
    ClearPlatformioCoreDirMutationVariables
  >(ClearPlatformioCoreDirDocument, options);
}
export type ClearPlatformioCoreDirMutationHookResult = ReturnType<
  typeof useClearPlatformioCoreDirMutation
>;
export type ClearPlatformioCoreDirMutationResult = Apollo.MutationResult<ClearPlatformioCoreDirMutation>;
export type ClearPlatformioCoreDirMutationOptions = Apollo.BaseMutationOptions<
  ClearPlatformioCoreDirMutation,
  ClearPlatformioCoreDirMutationVariables
>;
export const ConnectToSerialDeviceDocument = gql`
  mutation connectToSerialDevice($input: SerialConnectionConfigInput!) {
    connectToSerialDevice(input: $input) {
      success
      message
    }
  }
`;
export type ConnectToSerialDeviceMutationFn = Apollo.MutationFunction<
  ConnectToSerialDeviceMutation,
  ConnectToSerialDeviceMutationVariables
>;

/**
 * __useConnectToSerialDeviceMutation__
 *
 * To run a mutation, you first call `useConnectToSerialDeviceMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useConnectToSerialDeviceMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [connectToSerialDeviceMutation, { data, loading, error }] = useConnectToSerialDeviceMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useConnectToSerialDeviceMutation(
  baseOptions?: Apollo.MutationHookOptions<
    ConnectToSerialDeviceMutation,
    ConnectToSerialDeviceMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    ConnectToSerialDeviceMutation,
    ConnectToSerialDeviceMutationVariables
  >(ConnectToSerialDeviceDocument, options);
}
export type ConnectToSerialDeviceMutationHookResult = ReturnType<
  typeof useConnectToSerialDeviceMutation
>;
export type ConnectToSerialDeviceMutationResult = Apollo.MutationResult<ConnectToSerialDeviceMutation>;
export type ConnectToSerialDeviceMutationOptions = Apollo.BaseMutationOptions<
  ConnectToSerialDeviceMutation,
  ConnectToSerialDeviceMutationVariables
>;
export const TargetDeviceOptionsDocument = gql`
  query targetDeviceOptions(
    $target: DeviceTarget!
    $source: FirmwareSource!
    $gitTag: String!
    $gitBranch: String!
    $gitCommit: String!
    $localPath: String!
  ) {
    targetDeviceOptions(
      target: $target
      source: $source
      gitTag: $gitTag
      gitBranch: $gitBranch
      gitCommit: $gitCommit
      localPath: $localPath
    ) {
      type
      key
      enabled
      enumValues
      value
    }
  }
`;

/**
 * __useTargetDeviceOptionsQuery__
 *
 * To run a query within a React component, call `useTargetDeviceOptionsQuery` and pass it any options that fit your needs.
 * When your component renders, `useTargetDeviceOptionsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useTargetDeviceOptionsQuery({
 *   variables: {
 *      target: // value for 'target'
 *      source: // value for 'source'
 *      gitTag: // value for 'gitTag'
 *      gitBranch: // value for 'gitBranch'
 *      gitCommit: // value for 'gitCommit'
 *      localPath: // value for 'localPath'
 *   },
 * });
 */
export function useTargetDeviceOptionsQuery(
  baseOptions: Apollo.QueryHookOptions<
    TargetDeviceOptionsQuery,
    TargetDeviceOptionsQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<
    TargetDeviceOptionsQuery,
    TargetDeviceOptionsQueryVariables
  >(TargetDeviceOptionsDocument, options);
}
export function useTargetDeviceOptionsLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    TargetDeviceOptionsQuery,
    TargetDeviceOptionsQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    TargetDeviceOptionsQuery,
    TargetDeviceOptionsQueryVariables
  >(TargetDeviceOptionsDocument, options);
}
export type TargetDeviceOptionsQueryHookResult = ReturnType<
  typeof useTargetDeviceOptionsQuery
>;
export type TargetDeviceOptionsLazyQueryHookResult = ReturnType<
  typeof useTargetDeviceOptionsLazyQuery
>;
export type TargetDeviceOptionsQueryResult = Apollo.QueryResult<
  TargetDeviceOptionsQuery,
  TargetDeviceOptionsQueryVariables
>;
export const DisconnectFromSerialDeviceDocument = gql`
  mutation disconnectFromSerialDevice {
    disconnectFromSerialDevice {
      success
      message
    }
  }
`;
export type DisconnectFromSerialDeviceMutationFn = Apollo.MutationFunction<
  DisconnectFromSerialDeviceMutation,
  DisconnectFromSerialDeviceMutationVariables
>;

/**
 * __useDisconnectFromSerialDeviceMutation__
 *
 * To run a mutation, you first call `useDisconnectFromSerialDeviceMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDisconnectFromSerialDeviceMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [disconnectFromSerialDeviceMutation, { data, loading, error }] = useDisconnectFromSerialDeviceMutation({
 *   variables: {
 *   },
 * });
 */
export function useDisconnectFromSerialDeviceMutation(
  baseOptions?: Apollo.MutationHookOptions<
    DisconnectFromSerialDeviceMutation,
    DisconnectFromSerialDeviceMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    DisconnectFromSerialDeviceMutation,
    DisconnectFromSerialDeviceMutationVariables
  >(DisconnectFromSerialDeviceDocument, options);
}
export type DisconnectFromSerialDeviceMutationHookResult = ReturnType<
  typeof useDisconnectFromSerialDeviceMutation
>;
export type DisconnectFromSerialDeviceMutationResult = Apollo.MutationResult<DisconnectFromSerialDeviceMutation>;
export type DisconnectFromSerialDeviceMutationOptions = Apollo.BaseMutationOptions<
  DisconnectFromSerialDeviceMutation,
  DisconnectFromSerialDeviceMutationVariables
>;
export const GetBranchesDocument = gql`
  query getBranches {
    gitBranches
  }
`;

/**
 * __useGetBranchesQuery__
 *
 * To run a query within a React component, call `useGetBranchesQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetBranchesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetBranchesQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetBranchesQuery(
  baseOptions?: Apollo.QueryHookOptions<
    GetBranchesQuery,
    GetBranchesQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<GetBranchesQuery, GetBranchesQueryVariables>(
    GetBranchesDocument,
    options
  );
}
export function useGetBranchesLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetBranchesQuery,
    GetBranchesQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<GetBranchesQuery, GetBranchesQueryVariables>(
    GetBranchesDocument,
    options
  );
}
export type GetBranchesQueryHookResult = ReturnType<typeof useGetBranchesQuery>;
export type GetBranchesLazyQueryHookResult = ReturnType<
  typeof useGetBranchesLazyQuery
>;
export type GetBranchesQueryResult = Apollo.QueryResult<
  GetBranchesQuery,
  GetBranchesQueryVariables
>;
export const GetTagsDocument = gql`
  query getTags {
    gitTags
  }
`;

/**
 * __useGetTagsQuery__
 *
 * To run a query within a React component, call `useGetTagsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetTagsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetTagsQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetTagsQuery(
  baseOptions?: Apollo.QueryHookOptions<GetTagsQuery, GetTagsQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<GetTagsQuery, GetTagsQueryVariables>(
    GetTagsDocument,
    options
  );
}
export function useGetTagsLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<GetTagsQuery, GetTagsQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<GetTagsQuery, GetTagsQueryVariables>(
    GetTagsDocument,
    options
  );
}
export type GetTagsQueryHookResult = ReturnType<typeof useGetTagsQuery>;
export type GetTagsLazyQueryHookResult = ReturnType<typeof useGetTagsLazyQuery>;
export type GetTagsQueryResult = Apollo.QueryResult<
  GetTagsQuery,
  GetTagsQueryVariables
>;
export const SerialMonitorEventsDocument = gql`
  subscription serialMonitorEvents {
    serialMonitorEvents {
      type
    }
  }
`;

/**
 * __useSerialMonitorEventsSubscription__
 *
 * To run a query within a React component, call `useSerialMonitorEventsSubscription` and pass it any options that fit your needs.
 * When your component renders, `useSerialMonitorEventsSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSerialMonitorEventsSubscription({
 *   variables: {
 *   },
 * });
 */
export function useSerialMonitorEventsSubscription(
  baseOptions?: Apollo.SubscriptionHookOptions<
    SerialMonitorEventsSubscription,
    SerialMonitorEventsSubscriptionVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useSubscription<
    SerialMonitorEventsSubscription,
    SerialMonitorEventsSubscriptionVariables
  >(SerialMonitorEventsDocument, options);
}
export type SerialMonitorEventsSubscriptionHookResult = ReturnType<
  typeof useSerialMonitorEventsSubscription
>;
export type SerialMonitorEventsSubscriptionResult = Apollo.SubscriptionResult<SerialMonitorEventsSubscription>;
export const SerialMonitorLogsDocument = gql`
  subscription serialMonitorLogs {
    serialMonitorLogs {
      data
    }
  }
`;

/**
 * __useSerialMonitorLogsSubscription__
 *
 * To run a query within a React component, call `useSerialMonitorLogsSubscription` and pass it any options that fit your needs.
 * When your component renders, `useSerialMonitorLogsSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSerialMonitorLogsSubscription({
 *   variables: {
 *   },
 * });
 */
export function useSerialMonitorLogsSubscription(
  baseOptions?: Apollo.SubscriptionHookOptions<
    SerialMonitorLogsSubscription,
    SerialMonitorLogsSubscriptionVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useSubscription<
    SerialMonitorLogsSubscription,
    SerialMonitorLogsSubscriptionVariables
  >(SerialMonitorLogsDocument, options);
}
export type SerialMonitorLogsSubscriptionHookResult = ReturnType<
  typeof useSerialMonitorLogsSubscription
>;
export type SerialMonitorLogsSubscriptionResult = Apollo.SubscriptionResult<SerialMonitorLogsSubscription>;
