import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
const defaultOptions = {} as const;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  JSONObject: { input: any; output: any; }
};

export enum BuildFirmwareErrorType {
  BuildError = 'BuildError',
  FlashError = 'FlashError',
  GenericError = 'GenericError',
  GitDependencyError = 'GitDependencyError',
  PlatformioDependencyError = 'PlatformioDependencyError',
  PythonDependencyError = 'PythonDependencyError',
  TargetMismatch = 'TargetMismatch'
}

export enum BuildFirmwareStep {
  BUILDING_FIRMWARE = 'BUILDING_FIRMWARE',
  BUILDING_USER_DEFINES = 'BUILDING_USER_DEFINES',
  DOWNLOADING_FIRMWARE = 'DOWNLOADING_FIRMWARE',
  FLASHING_FIRMWARE = 'FLASHING_FIRMWARE',
  VERIFYING_BUILD_SYSTEM = 'VERIFYING_BUILD_SYSTEM'
}

export type BuildFlashFirmwareInput = {
  readonly erase?: Scalars['Boolean']['input'];
  readonly firmware?: FirmwareVersionDataInput;
  readonly forceFlash?: Scalars['Boolean']['input'];
  readonly serialDevice?: InputMaybe<Scalars['String']['input']>;
  readonly target?: Scalars['String']['input'];
  readonly type?: BuildJobType;
  readonly userDefines?: ReadonlyArray<UserDefineInput>;
  readonly userDefinesMode?: UserDefinesMode;
  readonly userDefinesTxt?: Scalars['String']['input'];
};

export type BuildFlashFirmwareResult = {
  readonly __typename?: 'BuildFlashFirmwareResult';
  readonly errorType?: Maybe<BuildFirmwareErrorType>;
  readonly firmwareBinPath?: Maybe<Scalars['String']['output']>;
  readonly message?: Maybe<Scalars['String']['output']>;
  readonly success: Scalars['Boolean']['output'];
};

export enum BuildJobType {
  Build = 'Build',
  Flash = 'Flash'
}

export type BuildLogUpdate = {
  readonly __typename?: 'BuildLogUpdate';
  readonly data: Scalars['String']['output'];
};

export type BuildProgressNotification = {
  readonly __typename?: 'BuildProgressNotification';
  readonly message?: Maybe<Scalars['String']['output']>;
  readonly step?: Maybe<BuildFirmwareStep>;
  readonly type: BuildProgressNotificationType;
};

export enum BuildProgressNotificationType {
  Error = 'Error',
  Info = 'Info',
  Success = 'Success'
}

export type BuildUserDefinesTxtInput = {
  readonly userDefines?: ReadonlyArray<UserDefineInput>;
};

export type BuildUserDefinesTxtResult = {
  readonly __typename?: 'BuildUserDefinesTxtResult';
  readonly userDefinesTxt?: Maybe<Scalars['String']['output']>;
};

export type ClearFirmwareFilesResult = {
  readonly __typename?: 'ClearFirmwareFilesResult';
  readonly message?: Maybe<Scalars['String']['output']>;
  readonly success: Scalars['Boolean']['output'];
};

export type ClearPlatformioCoreDirResult = {
  readonly __typename?: 'ClearPlatformioCoreDirResult';
  readonly message?: Maybe<Scalars['String']['output']>;
  readonly success: Scalars['Boolean']['output'];
};

export type Device = {
  readonly __typename?: 'Device';
  readonly abbreviatedName?: Maybe<Scalars['String']['output']>;
  readonly category: Scalars['String']['output'];
  readonly deviceType: DeviceType;
  readonly id: Scalars['String']['output'];
  readonly luaName?: Maybe<Scalars['String']['output']>;
  readonly name: Scalars['String']['output'];
  readonly parent?: Maybe<Scalars['String']['output']>;
  readonly platform?: Maybe<Scalars['String']['output']>;
  readonly priorTargetName?: Maybe<Scalars['String']['output']>;
  readonly targets: ReadonlyArray<Target>;
  readonly userDefines: ReadonlyArray<UserDefine>;
  readonly verifiedHardware: Scalars['Boolean']['output'];
  readonly wikiUrl?: Maybe<Scalars['String']['output']>;
};

export enum DeviceType {
  Backpack = 'Backpack',
  ExpressLRS = 'ExpressLRS'
}

export enum FirmwareSource {
  GitBranch = 'GitBranch',
  GitCommit = 'GitCommit',
  GitPullRequest = 'GitPullRequest',
  GitTag = 'GitTag',
  Local = 'Local'
}

export type FirmwareVersionDataInput = {
  readonly gitBranch?: Scalars['String']['input'];
  readonly gitCommit?: Scalars['String']['input'];
  readonly gitPullRequest?: InputMaybe<PullRequestInput>;
  readonly gitTag?: Scalars['String']['input'];
  readonly localPath?: Scalars['String']['input'];
  readonly source?: FirmwareSource;
};

export enum FlashingMethod {
  BetaflightPassthrough = 'BetaflightPassthrough',
  DFU = 'DFU',
  EdgeTxPassthrough = 'EdgeTxPassthrough',
  Passthrough = 'Passthrough',
  STLink = 'STLink',
  Stock_BL = 'Stock_BL',
  UART = 'UART',
  WIFI = 'WIFI',
  Zip = 'Zip'
}

export type GitRepositoryInput = {
  readonly hardwareArtifactUrl?: InputMaybe<Scalars['String']['input']>;
  readonly owner: Scalars['String']['input'];
  readonly rawRepoUrl: Scalars['String']['input'];
  readonly repositoryName: Scalars['String']['input'];
  readonly srcFolder: Scalars['String']['input'];
  readonly url: Scalars['String']['input'];
};

export type LogEntry = {
  readonly __typename?: 'LogEntry';
  readonly context?: Maybe<Scalars['JSONObject']['output']>;
  readonly level: Scalars['String']['output'];
  readonly message: Scalars['String']['output'];
  readonly timestamp: Scalars['String']['output'];
};

export type LogFile = {
  readonly __typename?: 'LogFile';
  readonly content?: Maybe<ReadonlyArray<LogEntry>>;
};

export type LuaScript = {
  readonly __typename?: 'LuaScript';
  readonly fileLocation?: Maybe<Scalars['String']['output']>;
};

export enum MulticastDnsEventType {
  DeviceAdded = 'DeviceAdded',
  DeviceRemoved = 'DeviceRemoved',
  DeviceUpdated = 'DeviceUpdated'
}

export type MulticastDnsInformation = {
  readonly __typename?: 'MulticastDnsInformation';
  readonly deviceName: Scalars['String']['output'];
  readonly dns: Scalars['String']['output'];
  readonly ip: Scalars['String']['output'];
  readonly name: Scalars['String']['output'];
  readonly options: ReadonlyArray<UserDefine>;
  readonly port: Scalars['Float']['output'];
  readonly target: Scalars['String']['output'];
  readonly type: Scalars['String']['output'];
  readonly vendor: Scalars['String']['output'];
  readonly version: Scalars['String']['output'];
};

export type MulticastDnsMonitorUpdate = {
  readonly __typename?: 'MulticastDnsMonitorUpdate';
  readonly data: MulticastDnsInformation;
  readonly type: MulticastDnsEventType;
};

export type Mutation = {
  readonly __typename?: 'Mutation';
  readonly buildFlashFirmware: BuildFlashFirmwareResult;
  readonly buildUserDefinesTxt: BuildUserDefinesTxtResult;
  readonly clearFirmwareFiles: ClearFirmwareFilesResult;
  readonly clearPlatformioCoreDir: ClearPlatformioCoreDirResult;
  readonly connectToSerialDevice: SerialPortConnectResult;
  readonly disconnectFromSerialDevice: SerialPortDisconnectResult;
};


export type MutationBuildFlashFirmwareArgs = {
  gitRepository: GitRepositoryInput;
  input: BuildFlashFirmwareInput;
};


export type MutationBuildUserDefinesTxtArgs = {
  input: BuildUserDefinesTxtInput;
};


export type MutationConnectToSerialDeviceArgs = {
  input: SerialConnectionConfigInput;
};

export type PullRequestInput = {
  readonly headCommitHash: Scalars['String']['input'];
  readonly id: Scalars['Float']['input'];
  readonly number: Scalars['Float']['input'];
  readonly title: Scalars['String']['input'];
};

export type PullRequestType = {
  readonly __typename?: 'PullRequestType';
  readonly headCommitHash: Scalars['String']['output'];
  readonly id: Scalars['Float']['output'];
  readonly number: Scalars['Float']['output'];
  readonly title: Scalars['String']['output'];
};

export type Query = {
  readonly __typename?: 'Query';
  readonly availableDevicesList: ReadonlyArray<SerialPortInformation>;
  readonly availableFirmwareTargets: ReadonlyArray<Device>;
  readonly availableMulticastDnsDevicesList: ReadonlyArray<MulticastDnsInformation>;
  readonly checkForUpdates: UpdatesAvailability;
  readonly gitBranches: ReadonlyArray<Scalars['String']['output']>;
  readonly gitTags: ReadonlyArray<Scalars['String']['output']>;
  readonly logFile: LogFile;
  readonly luaScript: LuaScript;
  readonly pullRequests: ReadonlyArray<PullRequestType>;
  readonly releases: ReadonlyArray<Release>;
  readonly targetDeviceOptions: ReadonlyArray<UserDefine>;
};


export type QueryAvailableFirmwareTargetsArgs = {
  gitBranch?: Scalars['String']['input'];
  gitCommit?: Scalars['String']['input'];
  gitPullRequest?: InputMaybe<PullRequestInput>;
  gitRepository: GitRepositoryInput;
  gitTag?: Scalars['String']['input'];
  localPath?: Scalars['String']['input'];
  source?: FirmwareSource;
};


export type QueryCheckForUpdatesArgs = {
  currentVersion: Scalars['String']['input'];
};


export type QueryGitBranchesArgs = {
  owner: Scalars['String']['input'];
  repository: Scalars['String']['input'];
};


export type QueryGitTagsArgs = {
  owner: Scalars['String']['input'];
  repository: Scalars['String']['input'];
};


export type QueryLogFileArgs = {
  numberOfLines?: Scalars['Int']['input'];
};


export type QueryLuaScriptArgs = {
  gitBranch?: Scalars['String']['input'];
  gitCommit?: Scalars['String']['input'];
  gitPullRequest?: InputMaybe<PullRequestInput>;
  gitRepository: GitRepositoryInput;
  gitTag?: Scalars['String']['input'];
  localPath?: Scalars['String']['input'];
  source?: FirmwareSource;
};


export type QueryPullRequestsArgs = {
  owner: Scalars['String']['input'];
  repository: Scalars['String']['input'];
};


export type QueryReleasesArgs = {
  owner: Scalars['String']['input'];
  repository: Scalars['String']['input'];
};


export type QueryTargetDeviceOptionsArgs = {
  gitBranch?: Scalars['String']['input'];
  gitCommit?: Scalars['String']['input'];
  gitPullRequest?: InputMaybe<PullRequestInput>;
  gitRepository: GitRepositoryInput;
  gitTag?: Scalars['String']['input'];
  localPath?: Scalars['String']['input'];
  source?: FirmwareSource;
  target?: Scalars['String']['input'];
};

export type Release = {
  readonly __typename?: 'Release';
  readonly preRelease: Scalars['Boolean']['output'];
  readonly tagName: Scalars['String']['output'];
};

export type SerialConnectionConfigInput = {
  readonly baudRate?: Scalars['Float']['input'];
  readonly port?: Scalars['String']['input'];
};

export type SerialMonitorEvent = {
  readonly __typename?: 'SerialMonitorEvent';
  readonly type: SerialMonitorEventType;
};

export enum SerialMonitorEventType {
  Connected = 'Connected',
  Connecting = 'Connecting',
  Disconnected = 'Disconnected',
  Error = 'Error'
}

export type SerialMonitorLogUpdate = {
  readonly __typename?: 'SerialMonitorLogUpdate';
  readonly data: Scalars['String']['output'];
};

export type SerialPortConnectResult = {
  readonly __typename?: 'SerialPortConnectResult';
  readonly message?: Maybe<Scalars['String']['output']>;
  readonly success: Scalars['Boolean']['output'];
};

export type SerialPortDisconnectResult = {
  readonly __typename?: 'SerialPortDisconnectResult';
  readonly message?: Maybe<Scalars['String']['output']>;
  readonly success: Scalars['Boolean']['output'];
};

export type SerialPortInformation = {
  readonly __typename?: 'SerialPortInformation';
  readonly manufacturer: Scalars['String']['output'];
  readonly path: Scalars['String']['output'];
};

export type Subscription = {
  readonly __typename?: 'Subscription';
  readonly buildLogUpdates: BuildLogUpdate;
  readonly buildProgressNotifications: BuildProgressNotification;
  readonly multicastDnsMonitorUpdates: MulticastDnsMonitorUpdate;
  readonly serialMonitorEvents: SerialMonitorEvent;
  readonly serialMonitorLogs: SerialMonitorLogUpdate;
};

export type Target = {
  readonly __typename?: 'Target';
  readonly flashingMethod: FlashingMethod;
  readonly id: Scalars['String']['output'];
  readonly name: Scalars['String']['output'];
};

export type UpdatesAvailability = {
  readonly __typename?: 'UpdatesAvailability';
  readonly newestVersion: Scalars['String']['output'];
  readonly releaseUrl: Scalars['String']['output'];
  readonly updateAvailable: Scalars['Boolean']['output'];
};

export type UserDefine = {
  readonly __typename?: 'UserDefine';
  readonly enabled: Scalars['Boolean']['output'];
  readonly enumValues?: Maybe<ReadonlyArray<Scalars['String']['output']>>;
  readonly key: UserDefineKey;
  readonly optionGroup?: Maybe<UserDefineOptionGroup>;
  readonly sensitive?: Maybe<Scalars['Boolean']['output']>;
  readonly type: UserDefineKind;
  readonly value?: Maybe<Scalars['String']['output']>;
};

export type UserDefineInput = {
  readonly enabled?: Scalars['Boolean']['input'];
  readonly enumValues?: InputMaybe<ReadonlyArray<Scalars['String']['input']>>;
  readonly key?: UserDefineKey;
  readonly type?: UserDefineKind;
  readonly value?: InputMaybe<Scalars['String']['input']>;
};

export enum UserDefineKey {
  AUTO_WIFI_ON_INTERVAL = 'AUTO_WIFI_ON_INTERVAL',
  BINDING_PHRASE = 'BINDING_PHRASE',
  DEVICE_NAME = 'DEVICE_NAME',
  DISABLE_ALL_BEEPS = 'DISABLE_ALL_BEEPS',
  DISABLE_STARTUP_BEEP = 'DISABLE_STARTUP_BEEP',
  HOME_WIFI_PASSWORD = 'HOME_WIFI_PASSWORD',
  HOME_WIFI_SSID = 'HOME_WIFI_SSID',
  JUST_BEEP_ONCE = 'JUST_BEEP_ONCE',
  LOCK_ON_FIRST_CONNECTION = 'LOCK_ON_FIRST_CONNECTION',
  MY_STARTUP_MELODY = 'MY_STARTUP_MELODY',
  RCVR_INVERT_TX = 'RCVR_INVERT_TX',
  RCVR_UART_BAUD = 'RCVR_UART_BAUD',
  REGULATORY_DOMAIN_AU_433 = 'REGULATORY_DOMAIN_AU_433',
  REGULATORY_DOMAIN_AU_915 = 'REGULATORY_DOMAIN_AU_915',
  REGULATORY_DOMAIN_EU_433 = 'REGULATORY_DOMAIN_EU_433',
  REGULATORY_DOMAIN_EU_868 = 'REGULATORY_DOMAIN_EU_868',
  REGULATORY_DOMAIN_EU_CE_2400 = 'REGULATORY_DOMAIN_EU_CE_2400',
  REGULATORY_DOMAIN_FCC_915 = 'REGULATORY_DOMAIN_FCC_915',
  REGULATORY_DOMAIN_IN_866 = 'REGULATORY_DOMAIN_IN_866',
  REGULATORY_DOMAIN_ISM_2400 = 'REGULATORY_DOMAIN_ISM_2400',
  RX_AS_TX = 'RX_AS_TX',
  TLM_REPORT_INTERVAL_MS = 'TLM_REPORT_INTERVAL_MS',
  UART_INVERTED = 'UART_INVERTED',
  UNLOCK_HIGHER_POWER = 'UNLOCK_HIGHER_POWER',
  USE_R9MM_R9MINI_SBUS = 'USE_R9MM_R9MINI_SBUS'
}

export enum UserDefineKind {
  Boolean = 'Boolean',
  Enum = 'Enum',
  Text = 'Text'
}

export enum UserDefineOptionGroup {
  RegulatoryDomain900 = 'RegulatoryDomain900',
  RegulatoryDomain2400 = 'RegulatoryDomain2400'
}

export enum UserDefinesMode {
  Manual = 'Manual',
  UserInterface = 'UserInterface'
}

export type AvailableDevicesListQueryVariables = Exact<{ [key: string]: never; }>;


export type AvailableDevicesListQuery = { readonly __typename?: 'Query', readonly availableDevicesList: ReadonlyArray<{ readonly __typename?: 'SerialPortInformation', readonly path: string, readonly manufacturer: string }> };

export type AvailableFirmwareTargetsQueryVariables = Exact<{
  source: FirmwareSource;
  gitTag: Scalars['String']['input'];
  gitBranch: Scalars['String']['input'];
  gitCommit: Scalars['String']['input'];
  localPath: Scalars['String']['input'];
  gitPullRequest?: InputMaybe<PullRequestInput>;
  gitRepository: GitRepositoryInput;
}>;


export type AvailableFirmwareTargetsQuery = { readonly __typename?: 'Query', readonly availableFirmwareTargets: ReadonlyArray<{ readonly __typename?: 'Device', readonly id: string, readonly name: string, readonly category: string, readonly wikiUrl?: string | null, readonly deviceType: DeviceType, readonly parent?: string | null, readonly abbreviatedName?: string | null, readonly verifiedHardware: boolean, readonly luaName?: string | null, readonly priorTargetName?: string | null, readonly platform?: string | null, readonly targets: ReadonlyArray<{ readonly __typename?: 'Target', readonly id: string, readonly name: string, readonly flashingMethod: FlashingMethod }> }> };

export type AvailableMulticastDnsDevicesListQueryVariables = Exact<{ [key: string]: never; }>;


export type AvailableMulticastDnsDevicesListQuery = { readonly __typename?: 'Query', readonly availableMulticastDnsDevicesList: ReadonlyArray<{ readonly __typename?: 'MulticastDnsInformation', readonly name: string, readonly version: string, readonly target: string, readonly type: string, readonly vendor: string, readonly ip: string, readonly dns: string, readonly port: number, readonly deviceName: string, readonly options: ReadonlyArray<{ readonly __typename?: 'UserDefine', readonly type: UserDefineKind, readonly key: UserDefineKey, readonly enabled: boolean, readonly enumValues?: ReadonlyArray<string> | null, readonly value?: string | null, readonly sensitive?: boolean | null }> }> };

export type BuildFlashFirmwareMutationVariables = Exact<{
  input: BuildFlashFirmwareInput;
  gitRepository: GitRepositoryInput;
}>;


export type BuildFlashFirmwareMutation = { readonly __typename?: 'Mutation', readonly buildFlashFirmware: { readonly __typename?: 'BuildFlashFirmwareResult', readonly success: boolean, readonly errorType?: BuildFirmwareErrorType | null, readonly message?: string | null, readonly firmwareBinPath?: string | null } };

export type BuildLogUpdatesSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type BuildLogUpdatesSubscription = { readonly __typename?: 'Subscription', readonly buildLogUpdates: { readonly __typename?: 'BuildLogUpdate', readonly data: string } };

export type BuildProgressNotificationsSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type BuildProgressNotificationsSubscription = { readonly __typename?: 'Subscription', readonly buildProgressNotifications: { readonly __typename?: 'BuildProgressNotification', readonly type: BuildProgressNotificationType, readonly step?: BuildFirmwareStep | null, readonly message?: string | null } };

export type BuildUserDefinesTxtMutationVariables = Exact<{
  input: BuildUserDefinesTxtInput;
}>;


export type BuildUserDefinesTxtMutation = { readonly __typename?: 'Mutation', readonly buildUserDefinesTxt: { readonly __typename?: 'BuildUserDefinesTxtResult', readonly userDefinesTxt?: string | null } };

export type CheckForUpdatesQueryVariables = Exact<{
  currentVersion: Scalars['String']['input'];
}>;


export type CheckForUpdatesQuery = { readonly __typename?: 'Query', readonly checkForUpdates: { readonly __typename?: 'UpdatesAvailability', readonly updateAvailable: boolean, readonly newestVersion: string, readonly releaseUrl: string } };

export type ClearFirmwareFilesMutationVariables = Exact<{ [key: string]: never; }>;


export type ClearFirmwareFilesMutation = { readonly __typename?: 'Mutation', readonly clearFirmwareFiles: { readonly __typename?: 'ClearFirmwareFilesResult', readonly success: boolean, readonly message?: string | null } };

export type ClearPlatformioCoreDirMutationVariables = Exact<{ [key: string]: never; }>;


export type ClearPlatformioCoreDirMutation = { readonly __typename?: 'Mutation', readonly clearPlatformioCoreDir: { readonly __typename?: 'ClearPlatformioCoreDirResult', readonly success: boolean, readonly message?: string | null } };

export type ConnectToSerialDeviceMutationVariables = Exact<{
  input: SerialConnectionConfigInput;
}>;


export type ConnectToSerialDeviceMutation = { readonly __typename?: 'Mutation', readonly connectToSerialDevice: { readonly __typename?: 'SerialPortConnectResult', readonly success: boolean, readonly message?: string | null } };

export type TargetDeviceOptionsQueryVariables = Exact<{
  target: Scalars['String']['input'];
  source: FirmwareSource;
  gitTag: Scalars['String']['input'];
  gitBranch: Scalars['String']['input'];
  gitCommit: Scalars['String']['input'];
  localPath: Scalars['String']['input'];
  gitPullRequest?: InputMaybe<PullRequestInput>;
  gitRepository: GitRepositoryInput;
}>;


export type TargetDeviceOptionsQuery = { readonly __typename?: 'Query', readonly targetDeviceOptions: ReadonlyArray<{ readonly __typename?: 'UserDefine', readonly type: UserDefineKind, readonly key: UserDefineKey, readonly enabled: boolean, readonly enumValues?: ReadonlyArray<string> | null, readonly value?: string | null, readonly optionGroup?: UserDefineOptionGroup | null, readonly sensitive?: boolean | null }> };

export type DisconnectFromSerialDeviceMutationVariables = Exact<{ [key: string]: never; }>;


export type DisconnectFromSerialDeviceMutation = { readonly __typename?: 'Mutation', readonly disconnectFromSerialDevice: { readonly __typename?: 'SerialPortDisconnectResult', readonly success: boolean, readonly message?: string | null } };

export type GetBranchesQueryVariables = Exact<{
  owner: Scalars['String']['input'];
  repository: Scalars['String']['input'];
}>;


export type GetBranchesQuery = { readonly __typename?: 'Query', readonly gitBranches: ReadonlyArray<string> };

export type GetPullRequestsQueryVariables = Exact<{
  owner: Scalars['String']['input'];
  repository: Scalars['String']['input'];
}>;


export type GetPullRequestsQuery = { readonly __typename?: 'Query', readonly pullRequests: ReadonlyArray<{ readonly __typename?: 'PullRequestType', readonly id: number, readonly number: number, readonly title: string, readonly headCommitHash: string }> };

export type GetReleasesQueryVariables = Exact<{
  owner: Scalars['String']['input'];
  repository: Scalars['String']['input'];
}>;


export type GetReleasesQuery = { readonly __typename?: 'Query', readonly releases: ReadonlyArray<{ readonly __typename?: 'Release', readonly tagName: string, readonly preRelease: boolean }> };

export type LogFileQueryVariables = Exact<{
  numberOfLines: Scalars['Int']['input'];
}>;


export type LogFileQuery = { readonly __typename?: 'Query', readonly logFile: { readonly __typename?: 'LogFile', readonly content?: ReadonlyArray<{ readonly __typename?: 'LogEntry', readonly timestamp: string, readonly level: string, readonly message: string, readonly context?: any | null }> | null } };

export type LuaScriptQueryVariables = Exact<{
  source: FirmwareSource;
  gitTag: Scalars['String']['input'];
  gitBranch: Scalars['String']['input'];
  gitCommit: Scalars['String']['input'];
  localPath: Scalars['String']['input'];
  gitPullRequest?: InputMaybe<PullRequestInput>;
  gitRepository: GitRepositoryInput;
}>;


export type LuaScriptQuery = { readonly __typename?: 'Query', readonly luaScript: { readonly __typename?: 'LuaScript', readonly fileLocation?: string | null } };

export type MulticastDnsMonitorUpdatesSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type MulticastDnsMonitorUpdatesSubscription = { readonly __typename?: 'Subscription', readonly multicastDnsMonitorUpdates: { readonly __typename?: 'MulticastDnsMonitorUpdate', readonly type: MulticastDnsEventType, readonly data: { readonly __typename?: 'MulticastDnsInformation', readonly name: string, readonly version: string, readonly target: string, readonly type: string, readonly vendor: string, readonly ip: string, readonly dns: string, readonly port: number, readonly deviceName: string, readonly options: ReadonlyArray<{ readonly __typename?: 'UserDefine', readonly type: UserDefineKind, readonly key: UserDefineKey, readonly enabled: boolean, readonly enumValues?: ReadonlyArray<string> | null, readonly value?: string | null, readonly sensitive?: boolean | null }> } } };

export type GetTagsQueryVariables = Exact<{
  owner: Scalars['String']['input'];
  repository: Scalars['String']['input'];
}>;


export type GetTagsQuery = { readonly __typename?: 'Query', readonly gitTags: ReadonlyArray<string> };

export type SerialMonitorEventsSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type SerialMonitorEventsSubscription = { readonly __typename?: 'Subscription', readonly serialMonitorEvents: { readonly __typename?: 'SerialMonitorEvent', readonly type: SerialMonitorEventType } };

export type SerialMonitorLogsSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type SerialMonitorLogsSubscription = { readonly __typename?: 'Subscription', readonly serialMonitorLogs: { readonly __typename?: 'SerialMonitorLogUpdate', readonly data: string } };


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
export function useAvailableDevicesListQuery(baseOptions?: Apollo.QueryHookOptions<AvailableDevicesListQuery, AvailableDevicesListQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<AvailableDevicesListQuery, AvailableDevicesListQueryVariables>(AvailableDevicesListDocument, options);
      }
export function useAvailableDevicesListLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<AvailableDevicesListQuery, AvailableDevicesListQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<AvailableDevicesListQuery, AvailableDevicesListQueryVariables>(AvailableDevicesListDocument, options);
        }
export function useAvailableDevicesListSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<AvailableDevicesListQuery, AvailableDevicesListQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<AvailableDevicesListQuery, AvailableDevicesListQueryVariables>(AvailableDevicesListDocument, options);
        }
export type AvailableDevicesListQueryHookResult = ReturnType<typeof useAvailableDevicesListQuery>;
export type AvailableDevicesListLazyQueryHookResult = ReturnType<typeof useAvailableDevicesListLazyQuery>;
export type AvailableDevicesListSuspenseQueryHookResult = ReturnType<typeof useAvailableDevicesListSuspenseQuery>;
export type AvailableDevicesListQueryResult = Apollo.QueryResult<AvailableDevicesListQuery, AvailableDevicesListQueryVariables>;
export const AvailableFirmwareTargetsDocument = gql`
    query availableFirmwareTargets($source: FirmwareSource!, $gitTag: String!, $gitBranch: String!, $gitCommit: String!, $localPath: String!, $gitPullRequest: PullRequestInput, $gitRepository: GitRepositoryInput!) {
  availableFirmwareTargets(
    source: $source
    gitTag: $gitTag
    gitBranch: $gitBranch
    gitCommit: $gitCommit
    localPath: $localPath
    gitPullRequest: $gitPullRequest
    gitRepository: $gitRepository
  ) {
    id
    name
    category
    targets {
      id
      name
      flashingMethod
    }
    wikiUrl
    deviceType
    parent
    abbreviatedName
    verifiedHardware
    luaName
    priorTargetName
    platform
  }
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
 *      source: // value for 'source'
 *      gitTag: // value for 'gitTag'
 *      gitBranch: // value for 'gitBranch'
 *      gitCommit: // value for 'gitCommit'
 *      localPath: // value for 'localPath'
 *      gitPullRequest: // value for 'gitPullRequest'
 *      gitRepository: // value for 'gitRepository'
 *   },
 * });
 */
export function useAvailableFirmwareTargetsQuery(baseOptions: Apollo.QueryHookOptions<AvailableFirmwareTargetsQuery, AvailableFirmwareTargetsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<AvailableFirmwareTargetsQuery, AvailableFirmwareTargetsQueryVariables>(AvailableFirmwareTargetsDocument, options);
      }
export function useAvailableFirmwareTargetsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<AvailableFirmwareTargetsQuery, AvailableFirmwareTargetsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<AvailableFirmwareTargetsQuery, AvailableFirmwareTargetsQueryVariables>(AvailableFirmwareTargetsDocument, options);
        }
export function useAvailableFirmwareTargetsSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<AvailableFirmwareTargetsQuery, AvailableFirmwareTargetsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<AvailableFirmwareTargetsQuery, AvailableFirmwareTargetsQueryVariables>(AvailableFirmwareTargetsDocument, options);
        }
export type AvailableFirmwareTargetsQueryHookResult = ReturnType<typeof useAvailableFirmwareTargetsQuery>;
export type AvailableFirmwareTargetsLazyQueryHookResult = ReturnType<typeof useAvailableFirmwareTargetsLazyQuery>;
export type AvailableFirmwareTargetsSuspenseQueryHookResult = ReturnType<typeof useAvailableFirmwareTargetsSuspenseQuery>;
export type AvailableFirmwareTargetsQueryResult = Apollo.QueryResult<AvailableFirmwareTargetsQuery, AvailableFirmwareTargetsQueryVariables>;
export const AvailableMulticastDnsDevicesListDocument = gql`
    query availableMulticastDnsDevicesList {
  availableMulticastDnsDevicesList {
    name
    options {
      type
      key
      enabled
      enumValues
      value
      sensitive
    }
    version
    target
    type
    vendor
    ip
    dns
    port
    deviceName
  }
}
    `;

/**
 * __useAvailableMulticastDnsDevicesListQuery__
 *
 * To run a query within a React component, call `useAvailableMulticastDnsDevicesListQuery` and pass it any options that fit your needs.
 * When your component renders, `useAvailableMulticastDnsDevicesListQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useAvailableMulticastDnsDevicesListQuery({
 *   variables: {
 *   },
 * });
 */
export function useAvailableMulticastDnsDevicesListQuery(baseOptions?: Apollo.QueryHookOptions<AvailableMulticastDnsDevicesListQuery, AvailableMulticastDnsDevicesListQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<AvailableMulticastDnsDevicesListQuery, AvailableMulticastDnsDevicesListQueryVariables>(AvailableMulticastDnsDevicesListDocument, options);
      }
export function useAvailableMulticastDnsDevicesListLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<AvailableMulticastDnsDevicesListQuery, AvailableMulticastDnsDevicesListQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<AvailableMulticastDnsDevicesListQuery, AvailableMulticastDnsDevicesListQueryVariables>(AvailableMulticastDnsDevicesListDocument, options);
        }
export function useAvailableMulticastDnsDevicesListSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<AvailableMulticastDnsDevicesListQuery, AvailableMulticastDnsDevicesListQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<AvailableMulticastDnsDevicesListQuery, AvailableMulticastDnsDevicesListQueryVariables>(AvailableMulticastDnsDevicesListDocument, options);
        }
export type AvailableMulticastDnsDevicesListQueryHookResult = ReturnType<typeof useAvailableMulticastDnsDevicesListQuery>;
export type AvailableMulticastDnsDevicesListLazyQueryHookResult = ReturnType<typeof useAvailableMulticastDnsDevicesListLazyQuery>;
export type AvailableMulticastDnsDevicesListSuspenseQueryHookResult = ReturnType<typeof useAvailableMulticastDnsDevicesListSuspenseQuery>;
export type AvailableMulticastDnsDevicesListQueryResult = Apollo.QueryResult<AvailableMulticastDnsDevicesListQuery, AvailableMulticastDnsDevicesListQueryVariables>;
export const BuildFlashFirmwareDocument = gql`
    mutation buildFlashFirmware($input: BuildFlashFirmwareInput!, $gitRepository: GitRepositoryInput!) {
  buildFlashFirmware(input: $input, gitRepository: $gitRepository) {
    success
    errorType
    message
    firmwareBinPath
  }
}
    `;
export type BuildFlashFirmwareMutationFn = Apollo.MutationFunction<BuildFlashFirmwareMutation, BuildFlashFirmwareMutationVariables>;

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
 *      gitRepository: // value for 'gitRepository'
 *   },
 * });
 */
export function useBuildFlashFirmwareMutation(baseOptions?: Apollo.MutationHookOptions<BuildFlashFirmwareMutation, BuildFlashFirmwareMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<BuildFlashFirmwareMutation, BuildFlashFirmwareMutationVariables>(BuildFlashFirmwareDocument, options);
      }
export type BuildFlashFirmwareMutationHookResult = ReturnType<typeof useBuildFlashFirmwareMutation>;
export type BuildFlashFirmwareMutationResult = Apollo.MutationResult<BuildFlashFirmwareMutation>;
export type BuildFlashFirmwareMutationOptions = Apollo.BaseMutationOptions<BuildFlashFirmwareMutation, BuildFlashFirmwareMutationVariables>;
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
export function useBuildLogUpdatesSubscription(baseOptions?: Apollo.SubscriptionHookOptions<BuildLogUpdatesSubscription, BuildLogUpdatesSubscriptionVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useSubscription<BuildLogUpdatesSubscription, BuildLogUpdatesSubscriptionVariables>(BuildLogUpdatesDocument, options);
      }
export type BuildLogUpdatesSubscriptionHookResult = ReturnType<typeof useBuildLogUpdatesSubscription>;
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
export function useBuildProgressNotificationsSubscription(baseOptions?: Apollo.SubscriptionHookOptions<BuildProgressNotificationsSubscription, BuildProgressNotificationsSubscriptionVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useSubscription<BuildProgressNotificationsSubscription, BuildProgressNotificationsSubscriptionVariables>(BuildProgressNotificationsDocument, options);
      }
export type BuildProgressNotificationsSubscriptionHookResult = ReturnType<typeof useBuildProgressNotificationsSubscription>;
export type BuildProgressNotificationsSubscriptionResult = Apollo.SubscriptionResult<BuildProgressNotificationsSubscription>;
export const BuildUserDefinesTxtDocument = gql`
    mutation buildUserDefinesTxt($input: BuildUserDefinesTxtInput!) {
  buildUserDefinesTxt(input: $input) {
    userDefinesTxt
  }
}
    `;
export type BuildUserDefinesTxtMutationFn = Apollo.MutationFunction<BuildUserDefinesTxtMutation, BuildUserDefinesTxtMutationVariables>;

/**
 * __useBuildUserDefinesTxtMutation__
 *
 * To run a mutation, you first call `useBuildUserDefinesTxtMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useBuildUserDefinesTxtMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [buildUserDefinesTxtMutation, { data, loading, error }] = useBuildUserDefinesTxtMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useBuildUserDefinesTxtMutation(baseOptions?: Apollo.MutationHookOptions<BuildUserDefinesTxtMutation, BuildUserDefinesTxtMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<BuildUserDefinesTxtMutation, BuildUserDefinesTxtMutationVariables>(BuildUserDefinesTxtDocument, options);
      }
export type BuildUserDefinesTxtMutationHookResult = ReturnType<typeof useBuildUserDefinesTxtMutation>;
export type BuildUserDefinesTxtMutationResult = Apollo.MutationResult<BuildUserDefinesTxtMutation>;
export type BuildUserDefinesTxtMutationOptions = Apollo.BaseMutationOptions<BuildUserDefinesTxtMutation, BuildUserDefinesTxtMutationVariables>;
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
export function useCheckForUpdatesQuery(baseOptions: Apollo.QueryHookOptions<CheckForUpdatesQuery, CheckForUpdatesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<CheckForUpdatesQuery, CheckForUpdatesQueryVariables>(CheckForUpdatesDocument, options);
      }
export function useCheckForUpdatesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<CheckForUpdatesQuery, CheckForUpdatesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<CheckForUpdatesQuery, CheckForUpdatesQueryVariables>(CheckForUpdatesDocument, options);
        }
export function useCheckForUpdatesSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<CheckForUpdatesQuery, CheckForUpdatesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<CheckForUpdatesQuery, CheckForUpdatesQueryVariables>(CheckForUpdatesDocument, options);
        }
export type CheckForUpdatesQueryHookResult = ReturnType<typeof useCheckForUpdatesQuery>;
export type CheckForUpdatesLazyQueryHookResult = ReturnType<typeof useCheckForUpdatesLazyQuery>;
export type CheckForUpdatesSuspenseQueryHookResult = ReturnType<typeof useCheckForUpdatesSuspenseQuery>;
export type CheckForUpdatesQueryResult = Apollo.QueryResult<CheckForUpdatesQuery, CheckForUpdatesQueryVariables>;
export const ClearFirmwareFilesDocument = gql`
    mutation clearFirmwareFiles {
  clearFirmwareFiles {
    success
    message
  }
}
    `;
export type ClearFirmwareFilesMutationFn = Apollo.MutationFunction<ClearFirmwareFilesMutation, ClearFirmwareFilesMutationVariables>;

/**
 * __useClearFirmwareFilesMutation__
 *
 * To run a mutation, you first call `useClearFirmwareFilesMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useClearFirmwareFilesMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [clearFirmwareFilesMutation, { data, loading, error }] = useClearFirmwareFilesMutation({
 *   variables: {
 *   },
 * });
 */
export function useClearFirmwareFilesMutation(baseOptions?: Apollo.MutationHookOptions<ClearFirmwareFilesMutation, ClearFirmwareFilesMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ClearFirmwareFilesMutation, ClearFirmwareFilesMutationVariables>(ClearFirmwareFilesDocument, options);
      }
export type ClearFirmwareFilesMutationHookResult = ReturnType<typeof useClearFirmwareFilesMutation>;
export type ClearFirmwareFilesMutationResult = Apollo.MutationResult<ClearFirmwareFilesMutation>;
export type ClearFirmwareFilesMutationOptions = Apollo.BaseMutationOptions<ClearFirmwareFilesMutation, ClearFirmwareFilesMutationVariables>;
export const ClearPlatformioCoreDirDocument = gql`
    mutation clearPlatformioCoreDir {
  clearPlatformioCoreDir {
    success
    message
  }
}
    `;
export type ClearPlatformioCoreDirMutationFn = Apollo.MutationFunction<ClearPlatformioCoreDirMutation, ClearPlatformioCoreDirMutationVariables>;

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
export function useClearPlatformioCoreDirMutation(baseOptions?: Apollo.MutationHookOptions<ClearPlatformioCoreDirMutation, ClearPlatformioCoreDirMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ClearPlatformioCoreDirMutation, ClearPlatformioCoreDirMutationVariables>(ClearPlatformioCoreDirDocument, options);
      }
export type ClearPlatformioCoreDirMutationHookResult = ReturnType<typeof useClearPlatformioCoreDirMutation>;
export type ClearPlatformioCoreDirMutationResult = Apollo.MutationResult<ClearPlatformioCoreDirMutation>;
export type ClearPlatformioCoreDirMutationOptions = Apollo.BaseMutationOptions<ClearPlatformioCoreDirMutation, ClearPlatformioCoreDirMutationVariables>;
export const ConnectToSerialDeviceDocument = gql`
    mutation connectToSerialDevice($input: SerialConnectionConfigInput!) {
  connectToSerialDevice(input: $input) {
    success
    message
  }
}
    `;
export type ConnectToSerialDeviceMutationFn = Apollo.MutationFunction<ConnectToSerialDeviceMutation, ConnectToSerialDeviceMutationVariables>;

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
export function useConnectToSerialDeviceMutation(baseOptions?: Apollo.MutationHookOptions<ConnectToSerialDeviceMutation, ConnectToSerialDeviceMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ConnectToSerialDeviceMutation, ConnectToSerialDeviceMutationVariables>(ConnectToSerialDeviceDocument, options);
      }
export type ConnectToSerialDeviceMutationHookResult = ReturnType<typeof useConnectToSerialDeviceMutation>;
export type ConnectToSerialDeviceMutationResult = Apollo.MutationResult<ConnectToSerialDeviceMutation>;
export type ConnectToSerialDeviceMutationOptions = Apollo.BaseMutationOptions<ConnectToSerialDeviceMutation, ConnectToSerialDeviceMutationVariables>;
export const TargetDeviceOptionsDocument = gql`
    query targetDeviceOptions($target: String!, $source: FirmwareSource!, $gitTag: String!, $gitBranch: String!, $gitCommit: String!, $localPath: String!, $gitPullRequest: PullRequestInput, $gitRepository: GitRepositoryInput!) {
  targetDeviceOptions(
    target: $target
    source: $source
    gitTag: $gitTag
    gitBranch: $gitBranch
    gitCommit: $gitCommit
    localPath: $localPath
    gitPullRequest: $gitPullRequest
    gitRepository: $gitRepository
  ) {
    type
    key
    enabled
    enumValues
    value
    optionGroup
    sensitive
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
 *      gitPullRequest: // value for 'gitPullRequest'
 *      gitRepository: // value for 'gitRepository'
 *   },
 * });
 */
export function useTargetDeviceOptionsQuery(baseOptions: Apollo.QueryHookOptions<TargetDeviceOptionsQuery, TargetDeviceOptionsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<TargetDeviceOptionsQuery, TargetDeviceOptionsQueryVariables>(TargetDeviceOptionsDocument, options);
      }
export function useTargetDeviceOptionsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<TargetDeviceOptionsQuery, TargetDeviceOptionsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<TargetDeviceOptionsQuery, TargetDeviceOptionsQueryVariables>(TargetDeviceOptionsDocument, options);
        }
export function useTargetDeviceOptionsSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<TargetDeviceOptionsQuery, TargetDeviceOptionsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<TargetDeviceOptionsQuery, TargetDeviceOptionsQueryVariables>(TargetDeviceOptionsDocument, options);
        }
export type TargetDeviceOptionsQueryHookResult = ReturnType<typeof useTargetDeviceOptionsQuery>;
export type TargetDeviceOptionsLazyQueryHookResult = ReturnType<typeof useTargetDeviceOptionsLazyQuery>;
export type TargetDeviceOptionsSuspenseQueryHookResult = ReturnType<typeof useTargetDeviceOptionsSuspenseQuery>;
export type TargetDeviceOptionsQueryResult = Apollo.QueryResult<TargetDeviceOptionsQuery, TargetDeviceOptionsQueryVariables>;
export const DisconnectFromSerialDeviceDocument = gql`
    mutation disconnectFromSerialDevice {
  disconnectFromSerialDevice {
    success
    message
  }
}
    `;
export type DisconnectFromSerialDeviceMutationFn = Apollo.MutationFunction<DisconnectFromSerialDeviceMutation, DisconnectFromSerialDeviceMutationVariables>;

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
export function useDisconnectFromSerialDeviceMutation(baseOptions?: Apollo.MutationHookOptions<DisconnectFromSerialDeviceMutation, DisconnectFromSerialDeviceMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DisconnectFromSerialDeviceMutation, DisconnectFromSerialDeviceMutationVariables>(DisconnectFromSerialDeviceDocument, options);
      }
export type DisconnectFromSerialDeviceMutationHookResult = ReturnType<typeof useDisconnectFromSerialDeviceMutation>;
export type DisconnectFromSerialDeviceMutationResult = Apollo.MutationResult<DisconnectFromSerialDeviceMutation>;
export type DisconnectFromSerialDeviceMutationOptions = Apollo.BaseMutationOptions<DisconnectFromSerialDeviceMutation, DisconnectFromSerialDeviceMutationVariables>;
export const GetBranchesDocument = gql`
    query getBranches($owner: String!, $repository: String!) {
  gitBranches(owner: $owner, repository: $repository)
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
 *      owner: // value for 'owner'
 *      repository: // value for 'repository'
 *   },
 * });
 */
export function useGetBranchesQuery(baseOptions: Apollo.QueryHookOptions<GetBranchesQuery, GetBranchesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetBranchesQuery, GetBranchesQueryVariables>(GetBranchesDocument, options);
      }
export function useGetBranchesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetBranchesQuery, GetBranchesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetBranchesQuery, GetBranchesQueryVariables>(GetBranchesDocument, options);
        }
export function useGetBranchesSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetBranchesQuery, GetBranchesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetBranchesQuery, GetBranchesQueryVariables>(GetBranchesDocument, options);
        }
export type GetBranchesQueryHookResult = ReturnType<typeof useGetBranchesQuery>;
export type GetBranchesLazyQueryHookResult = ReturnType<typeof useGetBranchesLazyQuery>;
export type GetBranchesSuspenseQueryHookResult = ReturnType<typeof useGetBranchesSuspenseQuery>;
export type GetBranchesQueryResult = Apollo.QueryResult<GetBranchesQuery, GetBranchesQueryVariables>;
export const GetPullRequestsDocument = gql`
    query getPullRequests($owner: String!, $repository: String!) {
  pullRequests(owner: $owner, repository: $repository) {
    id
    number
    title
    headCommitHash
  }
}
    `;

/**
 * __useGetPullRequestsQuery__
 *
 * To run a query within a React component, call `useGetPullRequestsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetPullRequestsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetPullRequestsQuery({
 *   variables: {
 *      owner: // value for 'owner'
 *      repository: // value for 'repository'
 *   },
 * });
 */
export function useGetPullRequestsQuery(baseOptions: Apollo.QueryHookOptions<GetPullRequestsQuery, GetPullRequestsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetPullRequestsQuery, GetPullRequestsQueryVariables>(GetPullRequestsDocument, options);
      }
export function useGetPullRequestsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetPullRequestsQuery, GetPullRequestsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetPullRequestsQuery, GetPullRequestsQueryVariables>(GetPullRequestsDocument, options);
        }
export function useGetPullRequestsSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetPullRequestsQuery, GetPullRequestsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetPullRequestsQuery, GetPullRequestsQueryVariables>(GetPullRequestsDocument, options);
        }
export type GetPullRequestsQueryHookResult = ReturnType<typeof useGetPullRequestsQuery>;
export type GetPullRequestsLazyQueryHookResult = ReturnType<typeof useGetPullRequestsLazyQuery>;
export type GetPullRequestsSuspenseQueryHookResult = ReturnType<typeof useGetPullRequestsSuspenseQuery>;
export type GetPullRequestsQueryResult = Apollo.QueryResult<GetPullRequestsQuery, GetPullRequestsQueryVariables>;
export const GetReleasesDocument = gql`
    query getReleases($owner: String!, $repository: String!) {
  releases(owner: $owner, repository: $repository) {
    tagName
    preRelease
  }
}
    `;

/**
 * __useGetReleasesQuery__
 *
 * To run a query within a React component, call `useGetReleasesQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetReleasesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetReleasesQuery({
 *   variables: {
 *      owner: // value for 'owner'
 *      repository: // value for 'repository'
 *   },
 * });
 */
export function useGetReleasesQuery(baseOptions: Apollo.QueryHookOptions<GetReleasesQuery, GetReleasesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetReleasesQuery, GetReleasesQueryVariables>(GetReleasesDocument, options);
      }
export function useGetReleasesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetReleasesQuery, GetReleasesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetReleasesQuery, GetReleasesQueryVariables>(GetReleasesDocument, options);
        }
export function useGetReleasesSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetReleasesQuery, GetReleasesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetReleasesQuery, GetReleasesQueryVariables>(GetReleasesDocument, options);
        }
export type GetReleasesQueryHookResult = ReturnType<typeof useGetReleasesQuery>;
export type GetReleasesLazyQueryHookResult = ReturnType<typeof useGetReleasesLazyQuery>;
export type GetReleasesSuspenseQueryHookResult = ReturnType<typeof useGetReleasesSuspenseQuery>;
export type GetReleasesQueryResult = Apollo.QueryResult<GetReleasesQuery, GetReleasesQueryVariables>;
export const LogFileDocument = gql`
    query logFile($numberOfLines: Int!) {
  logFile(numberOfLines: $numberOfLines) {
    content {
      timestamp
      level
      message
      context
    }
  }
}
    `;

/**
 * __useLogFileQuery__
 *
 * To run a query within a React component, call `useLogFileQuery` and pass it any options that fit your needs.
 * When your component renders, `useLogFileQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useLogFileQuery({
 *   variables: {
 *      numberOfLines: // value for 'numberOfLines'
 *   },
 * });
 */
export function useLogFileQuery(baseOptions: Apollo.QueryHookOptions<LogFileQuery, LogFileQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<LogFileQuery, LogFileQueryVariables>(LogFileDocument, options);
      }
export function useLogFileLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<LogFileQuery, LogFileQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<LogFileQuery, LogFileQueryVariables>(LogFileDocument, options);
        }
export function useLogFileSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<LogFileQuery, LogFileQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<LogFileQuery, LogFileQueryVariables>(LogFileDocument, options);
        }
export type LogFileQueryHookResult = ReturnType<typeof useLogFileQuery>;
export type LogFileLazyQueryHookResult = ReturnType<typeof useLogFileLazyQuery>;
export type LogFileSuspenseQueryHookResult = ReturnType<typeof useLogFileSuspenseQuery>;
export type LogFileQueryResult = Apollo.QueryResult<LogFileQuery, LogFileQueryVariables>;
export const LuaScriptDocument = gql`
    query luaScript($source: FirmwareSource!, $gitTag: String!, $gitBranch: String!, $gitCommit: String!, $localPath: String!, $gitPullRequest: PullRequestInput, $gitRepository: GitRepositoryInput!) {
  luaScript(
    source: $source
    gitTag: $gitTag
    gitBranch: $gitBranch
    gitCommit: $gitCommit
    localPath: $localPath
    gitPullRequest: $gitPullRequest
    gitRepository: $gitRepository
  ) {
    fileLocation
  }
}
    `;

/**
 * __useLuaScriptQuery__
 *
 * To run a query within a React component, call `useLuaScriptQuery` and pass it any options that fit your needs.
 * When your component renders, `useLuaScriptQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useLuaScriptQuery({
 *   variables: {
 *      source: // value for 'source'
 *      gitTag: // value for 'gitTag'
 *      gitBranch: // value for 'gitBranch'
 *      gitCommit: // value for 'gitCommit'
 *      localPath: // value for 'localPath'
 *      gitPullRequest: // value for 'gitPullRequest'
 *      gitRepository: // value for 'gitRepository'
 *   },
 * });
 */
export function useLuaScriptQuery(baseOptions: Apollo.QueryHookOptions<LuaScriptQuery, LuaScriptQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<LuaScriptQuery, LuaScriptQueryVariables>(LuaScriptDocument, options);
      }
export function useLuaScriptLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<LuaScriptQuery, LuaScriptQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<LuaScriptQuery, LuaScriptQueryVariables>(LuaScriptDocument, options);
        }
export function useLuaScriptSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<LuaScriptQuery, LuaScriptQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<LuaScriptQuery, LuaScriptQueryVariables>(LuaScriptDocument, options);
        }
export type LuaScriptQueryHookResult = ReturnType<typeof useLuaScriptQuery>;
export type LuaScriptLazyQueryHookResult = ReturnType<typeof useLuaScriptLazyQuery>;
export type LuaScriptSuspenseQueryHookResult = ReturnType<typeof useLuaScriptSuspenseQuery>;
export type LuaScriptQueryResult = Apollo.QueryResult<LuaScriptQuery, LuaScriptQueryVariables>;
export const MulticastDnsMonitorUpdatesDocument = gql`
    subscription multicastDnsMonitorUpdates {
  multicastDnsMonitorUpdates {
    type
    data {
      name
      options {
        type
        key
        enabled
        enumValues
        value
        sensitive
      }
      version
      target
      type
      vendor
      ip
      dns
      port
      deviceName
    }
  }
}
    `;

/**
 * __useMulticastDnsMonitorUpdatesSubscription__
 *
 * To run a query within a React component, call `useMulticastDnsMonitorUpdatesSubscription` and pass it any options that fit your needs.
 * When your component renders, `useMulticastDnsMonitorUpdatesSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMulticastDnsMonitorUpdatesSubscription({
 *   variables: {
 *   },
 * });
 */
export function useMulticastDnsMonitorUpdatesSubscription(baseOptions?: Apollo.SubscriptionHookOptions<MulticastDnsMonitorUpdatesSubscription, MulticastDnsMonitorUpdatesSubscriptionVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useSubscription<MulticastDnsMonitorUpdatesSubscription, MulticastDnsMonitorUpdatesSubscriptionVariables>(MulticastDnsMonitorUpdatesDocument, options);
      }
export type MulticastDnsMonitorUpdatesSubscriptionHookResult = ReturnType<typeof useMulticastDnsMonitorUpdatesSubscription>;
export type MulticastDnsMonitorUpdatesSubscriptionResult = Apollo.SubscriptionResult<MulticastDnsMonitorUpdatesSubscription>;
export const GetTagsDocument = gql`
    query getTags($owner: String!, $repository: String!) {
  gitTags(owner: $owner, repository: $repository)
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
 *      owner: // value for 'owner'
 *      repository: // value for 'repository'
 *   },
 * });
 */
export function useGetTagsQuery(baseOptions: Apollo.QueryHookOptions<GetTagsQuery, GetTagsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetTagsQuery, GetTagsQueryVariables>(GetTagsDocument, options);
      }
export function useGetTagsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetTagsQuery, GetTagsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetTagsQuery, GetTagsQueryVariables>(GetTagsDocument, options);
        }
export function useGetTagsSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetTagsQuery, GetTagsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetTagsQuery, GetTagsQueryVariables>(GetTagsDocument, options);
        }
export type GetTagsQueryHookResult = ReturnType<typeof useGetTagsQuery>;
export type GetTagsLazyQueryHookResult = ReturnType<typeof useGetTagsLazyQuery>;
export type GetTagsSuspenseQueryHookResult = ReturnType<typeof useGetTagsSuspenseQuery>;
export type GetTagsQueryResult = Apollo.QueryResult<GetTagsQuery, GetTagsQueryVariables>;
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
export function useSerialMonitorEventsSubscription(baseOptions?: Apollo.SubscriptionHookOptions<SerialMonitorEventsSubscription, SerialMonitorEventsSubscriptionVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useSubscription<SerialMonitorEventsSubscription, SerialMonitorEventsSubscriptionVariables>(SerialMonitorEventsDocument, options);
      }
export type SerialMonitorEventsSubscriptionHookResult = ReturnType<typeof useSerialMonitorEventsSubscription>;
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
export function useSerialMonitorLogsSubscription(baseOptions?: Apollo.SubscriptionHookOptions<SerialMonitorLogsSubscription, SerialMonitorLogsSubscriptionVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useSubscription<SerialMonitorLogsSubscription, SerialMonitorLogsSubscriptionVariables>(SerialMonitorLogsDocument, options);
      }
export type SerialMonitorLogsSubscriptionHookResult = ReturnType<typeof useSerialMonitorLogsSubscription>;
export type SerialMonitorLogsSubscriptionResult = Apollo.SubscriptionResult<SerialMonitorLogsSubscription>;