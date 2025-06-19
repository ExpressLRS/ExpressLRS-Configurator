import {
  FirmwareVersionDataInput,
  UserDefine,
  UserDefineKey,
  UserDefineOptionGroup,
  UserDefinesMode,
} from '../gql/generated/types';
import GitRepository from '../models/GitRepository';

export interface DeviceOptions {
  userDefinesMode: UserDefinesMode;
  userDefineOptions: UserDefine[];
  userDefinesTxt: string;
}

export interface IApplicationStorage {
  saveDeviceOptions(
    device: string,
    deviceOptions: DeviceOptions
  ): Promise<void>;

  removeDeviceOptions(deviceTarget: string): Promise<void>;

  getDeviceOptions(deviceTarget: string): Promise<DeviceOptions | null>;

  getGlobalOption(key: UserDefineKey): Promise<Partial<UserDefine> | null>;
  setGlobalOption(
    key: UserDefineKey,
    value: string,
    enabled: boolean
  ): Promise<void>;

  getFirmwareSource(
    gitRepository: GitRepository
  ): Promise<FirmwareVersionDataInput | null>;

  setFirmwareSource(
    input: FirmwareVersionDataInput,
    gitRepository: GitRepository
  ): Promise<void>;

  getShowPreReleases(defaultValue: boolean): Promise<boolean>;

  setShowPreReleases(value: boolean): Promise<void>;

  setOptionsGroupValue(
    group: UserDefineOptionGroup,
    key: UserDefineKey
  ): Promise<void>;
  getOptionsGroupValue(
    group: UserDefineOptionGroup
  ): Promise<UserDefineKey | null>;

  setShowSensitiveFieldData(field: string, value: boolean): Promise<void>;

  getShowSensitiveFieldData(field: string): Promise<boolean | null>;

  setExpertModeEnabled(value: boolean): void;

  getExpertModeEnabled(): boolean | null;
}

const DEVICE_OPTIONS_BY_TARGET_KEYSPACE = 'device_options';
const FIRMWARE_SOURCE_KEY = 'firmware_source';
const UI_SHOW_FIRMWARE_PRE_RELEASES = 'ui_show_pre_releases';
const EXPERT_MODE = 'expert_mode';

export default class ApplicationStorage implements IApplicationStorage {
  async saveDeviceOptions(
    device: string,
    deviceOptions: DeviceOptions
  ): Promise<void> {
    const key = `${DEVICE_OPTIONS_BY_TARGET_KEYSPACE}.${device}`;
    localStorage.setItem(key, JSON.stringify(deviceOptions));
  }

  async getDeviceOptions(device: string): Promise<DeviceOptions | null> {
    const isExpertModeEnabled = this.getExpertModeEnabled();
    // in order to preserve backwards compatibility of device options we add a
    // keyspace modifier to separate non experd mode device options
    const expertStr = isExpertModeEnabled ? '' : '.non_expert_mode';
    const key = `${DEVICE_OPTIONS_BY_TARGET_KEYSPACE}.${device}${expertStr}`;
    const value = localStorage.getItem(key);
    if (value === null) {
      return null;
    }
    try {
      return JSON.parse(value);
    } catch (e) {
      console.error(`failed to parse ${e}`);
      return null;
    }
  }

  async removeDeviceOptions(device: string): Promise<void> {
    const key = `${DEVICE_OPTIONS_BY_TARGET_KEYSPACE}.${device}`;
    localStorage.removeItem(key);
  }

  async getFirmwareSource(
    gitRepository: GitRepository
  ): Promise<FirmwareVersionDataInput | null> {
    const value = localStorage.getItem(
      `${gitRepository.owner}-${gitRepository.repositoryName}-${FIRMWARE_SOURCE_KEY}`
    );
    if (value === null) {
      return null;
    }
    try {
      return JSON.parse(value);
    } catch (e) {
      console.error(`failed to parse ${e}`);
      return null;
    }
  }

  async setFirmwareSource(
    input: FirmwareVersionDataInput,
    gitRepository: GitRepository
  ): Promise<void> {
    localStorage.setItem(
      `${gitRepository.owner}-${gitRepository.repositoryName}-${FIRMWARE_SOURCE_KEY}`,
      JSON.stringify(input)
    );
  }

  private getGlobalOptionKey(key: UserDefineKey): string {
    // we retain backwards compatibility with previous configurator versions
    const BINDING_PHRASE_KEY = 'binding_phrase';
    const WIFI_SSID_KEY = 'wifi_ssid';
    const WIFI_PASSWORD_KEY = 'wifi_password';

    switch (key) {
      case UserDefineKey.BINDING_PHRASE:
        return BINDING_PHRASE_KEY;
      case UserDefineKey.HOME_WIFI_SSID:
        return WIFI_SSID_KEY;
      case UserDefineKey.HOME_WIFI_PASSWORD:
        return WIFI_PASSWORD_KEY;
      default:
        return key;
    }
  }

  async setGlobalOption(
    key: UserDefineKey,
    value: string,
    enabled: boolean
  ): Promise<void> {
    localStorage.setItem(this.getGlobalOptionKey(key), value);
    localStorage.setItem(
      `${this.getGlobalOptionKey(key)}.enabled`,
      String(enabled)
    );
  }

  async getGlobalOption(
    key: UserDefineKey
  ): Promise<Partial<UserDefine> | null> {
    const value = localStorage.getItem(this.getGlobalOptionKey(key));
    const enabled =
      localStorage.getItem(`${this.getGlobalOptionKey(key)}.enabled`) ===
      'true';
    if (value === null) {
      return null;
    }
    return {
      value,
      enabled,
    };
  }

  private getOptionGroupKey(group: UserDefineOptionGroup): string {
    // we retain backwards compatibility with previous configurator versions
    const REGULATORY_DOMAIN_900_KEY = 'regulatory_domain_900';
    const REGULATORY_DOMAIN_2400_KEY = 'regulatory_domain_2400';

    switch (group) {
      case UserDefineOptionGroup.RegulatoryDomain900:
        return REGULATORY_DOMAIN_900_KEY;
      case UserDefineOptionGroup.RegulatoryDomain2400:
        return REGULATORY_DOMAIN_2400_KEY;
      default:
        return group;
    }
  }

  async setOptionsGroupValue(
    group: UserDefineOptionGroup,
    key: UserDefineKey
  ): Promise<void> {
    localStorage.setItem(this.getOptionGroupKey(group), key);
  }

  async getOptionsGroupValue(
    group: UserDefineOptionGroup
  ): Promise<UserDefineKey | null> {
    return localStorage.getItem(this.getOptionGroupKey(group)) as UserDefineKey;
  }

  async getShowPreReleases(defaultValue: boolean): Promise<boolean> {
    try {
      const result = localStorage.getItem(UI_SHOW_FIRMWARE_PRE_RELEASES);
      if (result === null || result === undefined) {
        return defaultValue;
      }
      return JSON.parse(result);
    } catch (e) {
      console.error(
        'failed to load user ui preference for ui-show-prereleases'
      );
      return defaultValue;
    }
  }

  async setShowPreReleases(value: boolean): Promise<void> {
    localStorage.setItem(UI_SHOW_FIRMWARE_PRE_RELEASES, JSON.stringify(value));
  }

  async setShowSensitiveFieldData(
    field: string,
    value: boolean
  ): Promise<void> {
    localStorage.setItem(
      `ShowSensitiveFieldData-${field}`,
      JSON.stringify(value)
    );
  }

  async getShowSensitiveFieldData(field: string): Promise<boolean | null> {
    const value = localStorage.getItem(`ShowSensitiveFieldData-${field}`);
    if (value) {
      try {
        return JSON.parse(value);
      } catch (e) {
        console.error('failed to parse state for', field, e);
        return null;
      }
    }
    return null;
  }

  setExpertModeEnabled(value: boolean): void {
    localStorage.setItem(EXPERT_MODE, JSON.stringify(value));
  }

  getExpertModeEnabled(): boolean | null {
    const value = localStorage.getItem(EXPERT_MODE);

    if (value) {
      try {
        return JSON.parse(value);
      } catch (e) {
        console.error(`failed to parse state for ${EXPERT_MODE}`, e);
        return null;
      }
    }
    return null;
  }
}
