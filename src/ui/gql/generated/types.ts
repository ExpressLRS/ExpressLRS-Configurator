import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  /** JSON object */
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
  DOWNLOADING_FIRMWARE = 'DOWNLOADING_FIRMWARE',
  FLASHING_FIRMWARE = 'FLASHING_FIRMWARE',
  VERIFYING_BUILD_SYSTEM = 'VERIFYING_BUILD_SYSTEM'
}

export enum BuildFirmwareSubstep {
  CompilingFirmware = 'CompilingFirmware',
  ConnectingToDevice = 'ConnectingToDevice',
  DetectingDevice = 'DetectingDevice',
  ErasingFlash = 'ErasingFlash',
  InstallingDependencies = 'InstallingDependencies',
  PackagingFirmware = 'PackagingFirmware',
  RestartingDevice = 'RestartingDevice',
  TargetMismatch = 'TargetMismatch',
  UploadingFirmware = 'UploadingFirmware',
  VerifyingFirmware = 'VerifyingFirmware',
  WritingFirmware = 'WritingFirmware'
}

export type BuildFlashFirmwareInput = {
  readonly erase?: Scalars['Boolean']['input'];
  readonly firmware?: FirmwareVersionDataInput;
  readonly flashingMethod?: FlashingMethod;
  readonly forceFlash?: Scalars['Boolean']['input'];
  readonly serialDevice?: InputMaybe<Scalars['String']['input']>;
  readonly target?: Scalars['String']['input'];
  readonly type?: BuildJobType;
  readonly userDefines?: ReadonlyArray<UserDefineInput>;
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
  readonly progress?: Maybe<Scalars['Float']['output']>;
  readonly step?: Maybe<BuildFirmwareStep>;
  readonly substep?: Maybe<BuildFirmwareSubstep>;
  readonly type: BuildProgressNotificationType;
};

export enum BuildProgressNotificationType {
  Error = 'Error',
  Info = 'Info',
  Success = 'Success'
}

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
  readonly product: Scalars['String']['output'];
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
  readonly clearFirmwareFiles: ClearFirmwareFilesResult;
  readonly clearPlatformioCoreDir: ClearPlatformioCoreDirResult;
  readonly connectToSerialDevice: SerialPortConnectResult;
  readonly disconnectFromSerialDevice: SerialPortDisconnectResult;
};


export type MutationBuildFlashFirmwareArgs = {
  gitRepository: GitRepositoryInput;
  input: BuildFlashFirmwareInput;
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


export type AvailableMulticastDnsDevicesListQuery = { readonly __typename?: 'Query', readonly availableMulticastDnsDevicesList: ReadonlyArray<{ readonly __typename?: 'MulticastDnsInformation', readonly name: string, readonly version: string, readonly target: string, readonly type: string, readonly vendor: string, readonly ip: string, readonly dns: string, readonly port: number, readonly deviceName: string, readonly product: string, readonly options: ReadonlyArray<{ readonly __typename?: 'UserDefine', readonly type: UserDefineKind, readonly key: UserDefineKey, readonly enabled: boolean, readonly enumValues?: ReadonlyArray<string> | null, readonly value?: string | null, readonly sensitive?: boolean | null }> }> };

export type BuildFlashFirmwareMutationVariables = Exact<{
  input: BuildFlashFirmwareInput;
  gitRepository: GitRepositoryInput;
}>;


export type BuildFlashFirmwareMutation = { readonly __typename?: 'Mutation', readonly buildFlashFirmware: { readonly __typename?: 'BuildFlashFirmwareResult', readonly success: boolean, readonly errorType?: BuildFirmwareErrorType | null, readonly message?: string | null, readonly firmwareBinPath?: string | null } };

export type BuildLogUpdatesSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type BuildLogUpdatesSubscription = { readonly __typename?: 'Subscription', readonly buildLogUpdates: { readonly __typename?: 'BuildLogUpdate', readonly data: string } };

export type BuildProgressNotificationsSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type BuildProgressNotificationsSubscription = { readonly __typename?: 'Subscription', readonly buildProgressNotifications: { readonly __typename?: 'BuildProgressNotification', readonly type: BuildProgressNotificationType, readonly step?: BuildFirmwareStep | null, readonly substep?: BuildFirmwareSubstep | null, readonly progress?: number | null } };

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


export type MulticastDnsMonitorUpdatesSubscription = { readonly __typename?: 'Subscription', readonly multicastDnsMonitorUpdates: { readonly __typename?: 'MulticastDnsMonitorUpdate', readonly type: MulticastDnsEventType, readonly data: { readonly __typename?: 'MulticastDnsInformation', readonly name: string, readonly version: string, readonly target: string, readonly type: string, readonly vendor: string, readonly ip: string, readonly dns: string, readonly port: number, readonly deviceName: string, readonly product: string, readonly options: ReadonlyArray<{ readonly __typename?: 'UserDefine', readonly type: UserDefineKind, readonly key: UserDefineKey, readonly enabled: boolean, readonly enumValues?: ReadonlyArray<string> | null, readonly value?: string | null, readonly sensitive?: boolean | null }> } } };

export type GetTagsQueryVariables = Exact<{
  owner: Scalars['String']['input'];
  repository: Scalars['String']['input'];
}>;


export type GetTagsQuery = { readonly __typename?: 'Query', readonly gitTags: ReadonlyArray<string> };

export type SerialMonitorEventsSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type SerialMonitorEventsSubscription = { readonly __typename?: 'Subscription', readonly serialMonitorEvents: { readonly __typename?: 'SerialMonitorEvent', readonly type: SerialMonitorEventType } };

export type SerialMonitorLogsSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type SerialMonitorLogsSubscription = { readonly __typename?: 'Subscription', readonly serialMonitorLogs: { readonly __typename?: 'SerialMonitorLogUpdate', readonly data: string } };


export const AvailableDevicesListDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"availableDevicesList"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"availableDevicesList"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"path"}},{"kind":"Field","name":{"kind":"Name","value":"manufacturer"}}]}}]}}]} as unknown as DocumentNode<AvailableDevicesListQuery, AvailableDevicesListQueryVariables>;
export const AvailableFirmwareTargetsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"availableFirmwareTargets"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"source"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"FirmwareSource"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"gitTag"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"gitBranch"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"gitCommit"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"localPath"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"gitPullRequest"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"PullRequestInput"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"gitRepository"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"GitRepositoryInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"availableFirmwareTargets"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"source"},"value":{"kind":"Variable","name":{"kind":"Name","value":"source"}}},{"kind":"Argument","name":{"kind":"Name","value":"gitTag"},"value":{"kind":"Variable","name":{"kind":"Name","value":"gitTag"}}},{"kind":"Argument","name":{"kind":"Name","value":"gitBranch"},"value":{"kind":"Variable","name":{"kind":"Name","value":"gitBranch"}}},{"kind":"Argument","name":{"kind":"Name","value":"gitCommit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"gitCommit"}}},{"kind":"Argument","name":{"kind":"Name","value":"localPath"},"value":{"kind":"Variable","name":{"kind":"Name","value":"localPath"}}},{"kind":"Argument","name":{"kind":"Name","value":"gitPullRequest"},"value":{"kind":"Variable","name":{"kind":"Name","value":"gitPullRequest"}}},{"kind":"Argument","name":{"kind":"Name","value":"gitRepository"},"value":{"kind":"Variable","name":{"kind":"Name","value":"gitRepository"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"category"}},{"kind":"Field","name":{"kind":"Name","value":"targets"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"flashingMethod"}}]}},{"kind":"Field","name":{"kind":"Name","value":"wikiUrl"}},{"kind":"Field","name":{"kind":"Name","value":"deviceType"}},{"kind":"Field","name":{"kind":"Name","value":"parent"}},{"kind":"Field","name":{"kind":"Name","value":"abbreviatedName"}},{"kind":"Field","name":{"kind":"Name","value":"verifiedHardware"}},{"kind":"Field","name":{"kind":"Name","value":"luaName"}},{"kind":"Field","name":{"kind":"Name","value":"priorTargetName"}},{"kind":"Field","name":{"kind":"Name","value":"platform"}}]}}]}}]} as unknown as DocumentNode<AvailableFirmwareTargetsQuery, AvailableFirmwareTargetsQueryVariables>;
export const AvailableMulticastDnsDevicesListDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"availableMulticastDnsDevicesList"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"availableMulticastDnsDevicesList"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"options"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"enabled"}},{"kind":"Field","name":{"kind":"Name","value":"enumValues"}},{"kind":"Field","name":{"kind":"Name","value":"value"}},{"kind":"Field","name":{"kind":"Name","value":"sensitive"}}]}},{"kind":"Field","name":{"kind":"Name","value":"version"}},{"kind":"Field","name":{"kind":"Name","value":"target"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"vendor"}},{"kind":"Field","name":{"kind":"Name","value":"ip"}},{"kind":"Field","name":{"kind":"Name","value":"dns"}},{"kind":"Field","name":{"kind":"Name","value":"port"}},{"kind":"Field","name":{"kind":"Name","value":"deviceName"}},{"kind":"Field","name":{"kind":"Name","value":"product"}}]}}]}}]} as unknown as DocumentNode<AvailableMulticastDnsDevicesListQuery, AvailableMulticastDnsDevicesListQueryVariables>;
export const BuildFlashFirmwareDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"buildFlashFirmware"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"BuildFlashFirmwareInput"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"gitRepository"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"GitRepositoryInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"buildFlashFirmware"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}},{"kind":"Argument","name":{"kind":"Name","value":"gitRepository"},"value":{"kind":"Variable","name":{"kind":"Name","value":"gitRepository"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"errorType"}},{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"firmwareBinPath"}}]}}]}}]} as unknown as DocumentNode<BuildFlashFirmwareMutation, BuildFlashFirmwareMutationVariables>;
export const BuildLogUpdatesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"subscription","name":{"kind":"Name","value":"buildLogUpdates"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"buildLogUpdates"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"}}]}}]}}]} as unknown as DocumentNode<BuildLogUpdatesSubscription, BuildLogUpdatesSubscriptionVariables>;
export const BuildProgressNotificationsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"subscription","name":{"kind":"Name","value":"buildProgressNotifications"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"buildProgressNotifications"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"step"}},{"kind":"Field","name":{"kind":"Name","value":"substep"}},{"kind":"Field","name":{"kind":"Name","value":"progress"}}]}}]}}]} as unknown as DocumentNode<BuildProgressNotificationsSubscription, BuildProgressNotificationsSubscriptionVariables>;
export const CheckForUpdatesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"checkForUpdates"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"currentVersion"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"checkForUpdates"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"currentVersion"},"value":{"kind":"Variable","name":{"kind":"Name","value":"currentVersion"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateAvailable"}},{"kind":"Field","name":{"kind":"Name","value":"newestVersion"}},{"kind":"Field","name":{"kind":"Name","value":"releaseUrl"}}]}}]}}]} as unknown as DocumentNode<CheckForUpdatesQuery, CheckForUpdatesQueryVariables>;
export const ClearFirmwareFilesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"clearFirmwareFiles"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"clearFirmwareFiles"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]} as unknown as DocumentNode<ClearFirmwareFilesMutation, ClearFirmwareFilesMutationVariables>;
export const ClearPlatformioCoreDirDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"clearPlatformioCoreDir"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"clearPlatformioCoreDir"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]} as unknown as DocumentNode<ClearPlatformioCoreDirMutation, ClearPlatformioCoreDirMutationVariables>;
export const ConnectToSerialDeviceDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"connectToSerialDevice"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"SerialConnectionConfigInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"connectToSerialDevice"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]} as unknown as DocumentNode<ConnectToSerialDeviceMutation, ConnectToSerialDeviceMutationVariables>;
export const TargetDeviceOptionsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"targetDeviceOptions"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"target"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"source"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"FirmwareSource"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"gitTag"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"gitBranch"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"gitCommit"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"localPath"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"gitPullRequest"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"PullRequestInput"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"gitRepository"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"GitRepositoryInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"targetDeviceOptions"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"target"},"value":{"kind":"Variable","name":{"kind":"Name","value":"target"}}},{"kind":"Argument","name":{"kind":"Name","value":"source"},"value":{"kind":"Variable","name":{"kind":"Name","value":"source"}}},{"kind":"Argument","name":{"kind":"Name","value":"gitTag"},"value":{"kind":"Variable","name":{"kind":"Name","value":"gitTag"}}},{"kind":"Argument","name":{"kind":"Name","value":"gitBranch"},"value":{"kind":"Variable","name":{"kind":"Name","value":"gitBranch"}}},{"kind":"Argument","name":{"kind":"Name","value":"gitCommit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"gitCommit"}}},{"kind":"Argument","name":{"kind":"Name","value":"localPath"},"value":{"kind":"Variable","name":{"kind":"Name","value":"localPath"}}},{"kind":"Argument","name":{"kind":"Name","value":"gitPullRequest"},"value":{"kind":"Variable","name":{"kind":"Name","value":"gitPullRequest"}}},{"kind":"Argument","name":{"kind":"Name","value":"gitRepository"},"value":{"kind":"Variable","name":{"kind":"Name","value":"gitRepository"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"enabled"}},{"kind":"Field","name":{"kind":"Name","value":"enumValues"}},{"kind":"Field","name":{"kind":"Name","value":"value"}},{"kind":"Field","name":{"kind":"Name","value":"optionGroup"}},{"kind":"Field","name":{"kind":"Name","value":"sensitive"}}]}}]}}]} as unknown as DocumentNode<TargetDeviceOptionsQuery, TargetDeviceOptionsQueryVariables>;
export const DisconnectFromSerialDeviceDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"disconnectFromSerialDevice"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"disconnectFromSerialDevice"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]} as unknown as DocumentNode<DisconnectFromSerialDeviceMutation, DisconnectFromSerialDeviceMutationVariables>;
export const GetBranchesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getBranches"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"owner"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"repository"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"gitBranches"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"owner"},"value":{"kind":"Variable","name":{"kind":"Name","value":"owner"}}},{"kind":"Argument","name":{"kind":"Name","value":"repository"},"value":{"kind":"Variable","name":{"kind":"Name","value":"repository"}}}]}]}}]} as unknown as DocumentNode<GetBranchesQuery, GetBranchesQueryVariables>;
export const GetPullRequestsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getPullRequests"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"owner"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"repository"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"pullRequests"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"owner"},"value":{"kind":"Variable","name":{"kind":"Name","value":"owner"}}},{"kind":"Argument","name":{"kind":"Name","value":"repository"},"value":{"kind":"Variable","name":{"kind":"Name","value":"repository"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"number"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"headCommitHash"}}]}}]}}]} as unknown as DocumentNode<GetPullRequestsQuery, GetPullRequestsQueryVariables>;
export const GetReleasesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getReleases"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"owner"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"repository"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"releases"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"owner"},"value":{"kind":"Variable","name":{"kind":"Name","value":"owner"}}},{"kind":"Argument","name":{"kind":"Name","value":"repository"},"value":{"kind":"Variable","name":{"kind":"Name","value":"repository"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"tagName"}},{"kind":"Field","name":{"kind":"Name","value":"preRelease"}}]}}]}}]} as unknown as DocumentNode<GetReleasesQuery, GetReleasesQueryVariables>;
export const LogFileDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"logFile"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"numberOfLines"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"logFile"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"numberOfLines"},"value":{"kind":"Variable","name":{"kind":"Name","value":"numberOfLines"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"content"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"timestamp"}},{"kind":"Field","name":{"kind":"Name","value":"level"}},{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"context"}}]}}]}}]}}]} as unknown as DocumentNode<LogFileQuery, LogFileQueryVariables>;
export const LuaScriptDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"luaScript"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"source"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"FirmwareSource"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"gitTag"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"gitBranch"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"gitCommit"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"localPath"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"gitPullRequest"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"PullRequestInput"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"gitRepository"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"GitRepositoryInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"luaScript"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"source"},"value":{"kind":"Variable","name":{"kind":"Name","value":"source"}}},{"kind":"Argument","name":{"kind":"Name","value":"gitTag"},"value":{"kind":"Variable","name":{"kind":"Name","value":"gitTag"}}},{"kind":"Argument","name":{"kind":"Name","value":"gitBranch"},"value":{"kind":"Variable","name":{"kind":"Name","value":"gitBranch"}}},{"kind":"Argument","name":{"kind":"Name","value":"gitCommit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"gitCommit"}}},{"kind":"Argument","name":{"kind":"Name","value":"localPath"},"value":{"kind":"Variable","name":{"kind":"Name","value":"localPath"}}},{"kind":"Argument","name":{"kind":"Name","value":"gitPullRequest"},"value":{"kind":"Variable","name":{"kind":"Name","value":"gitPullRequest"}}},{"kind":"Argument","name":{"kind":"Name","value":"gitRepository"},"value":{"kind":"Variable","name":{"kind":"Name","value":"gitRepository"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"fileLocation"}}]}}]}}]} as unknown as DocumentNode<LuaScriptQuery, LuaScriptQueryVariables>;
export const MulticastDnsMonitorUpdatesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"subscription","name":{"kind":"Name","value":"multicastDnsMonitorUpdates"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"multicastDnsMonitorUpdates"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"options"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"enabled"}},{"kind":"Field","name":{"kind":"Name","value":"enumValues"}},{"kind":"Field","name":{"kind":"Name","value":"value"}},{"kind":"Field","name":{"kind":"Name","value":"sensitive"}}]}},{"kind":"Field","name":{"kind":"Name","value":"version"}},{"kind":"Field","name":{"kind":"Name","value":"target"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"vendor"}},{"kind":"Field","name":{"kind":"Name","value":"ip"}},{"kind":"Field","name":{"kind":"Name","value":"dns"}},{"kind":"Field","name":{"kind":"Name","value":"port"}},{"kind":"Field","name":{"kind":"Name","value":"deviceName"}},{"kind":"Field","name":{"kind":"Name","value":"product"}}]}}]}}]}}]} as unknown as DocumentNode<MulticastDnsMonitorUpdatesSubscription, MulticastDnsMonitorUpdatesSubscriptionVariables>;
export const GetTagsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getTags"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"owner"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"repository"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"gitTags"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"owner"},"value":{"kind":"Variable","name":{"kind":"Name","value":"owner"}}},{"kind":"Argument","name":{"kind":"Name","value":"repository"},"value":{"kind":"Variable","name":{"kind":"Name","value":"repository"}}}]}]}}]} as unknown as DocumentNode<GetTagsQuery, GetTagsQueryVariables>;
export const SerialMonitorEventsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"subscription","name":{"kind":"Name","value":"serialMonitorEvents"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"serialMonitorEvents"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]}}]} as unknown as DocumentNode<SerialMonitorEventsSubscription, SerialMonitorEventsSubscriptionVariables>;
export const SerialMonitorLogsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"subscription","name":{"kind":"Name","value":"serialMonitorLogs"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"serialMonitorLogs"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"}}]}}]}}]} as unknown as DocumentNode<SerialMonitorLogsSubscription, SerialMonitorLogsSubscriptionVariables>;