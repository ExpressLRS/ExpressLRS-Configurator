import {
  FirmwareVersionDataInput,
  UserDefine,
  UserDefineKey,
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

  setBindingPhrase(bindingPhrase: string): Promise<void>;

  getBindingPhrase(): Promise<string>;

  updateBindingPhraseHistory(bindingPhrase: string): Promise<void>;

  getBindingPhraseHistory(): Promise<string[]>;

  getFirmwareSource(
    gitRepository: GitRepository
  ): Promise<FirmwareVersionDataInput | null>;

  setFirmwareSource(
    input: FirmwareVersionDataInput,
    gitRepository: GitRepository
  ): Promise<void>;

  getShowPreReleases(defaultValue: boolean): Promise<boolean>;

  setShowPreReleases(value: boolean): Promise<void>;

  setWifiSSID(value: string): Promise<void>;

  getWifiSSID(): Promise<string>;

  setWifiPassword(value: string): Promise<void>;

  getWifiPassword(): Promise<string>;

  setRegulatoryDomain900(value: UserDefineKey): Promise<void>;

  getRegulatoryDomain900(): Promise<UserDefineKey | null>;

  setRegulatoryDomain2400(value: UserDefineKey): Promise<void>;

  getRegulatoryDomain2400(): Promise<UserDefineKey | null>;

  setShowSensitiveFieldData(field: string, value: boolean): Promise<void>;

  getShowSensitiveFieldData(field: string): Promise<boolean | null>;
}

const DEVICE_OPTIONS_BY_TARGET_KEYSPACE = 'device_options';
const BINDING_PHRASE_KEY = 'binding_phrase';
const BINDING_PHRASE_HISTORY_KEY = 'binding_phrase_history';
const FIRMWARE_SOURCE_KEY = 'firmware_source';
const UI_SHOW_FIRMWARE_PRE_RELEASES = 'ui_show_pre_releases';
const WIFI_SSID_KEY = 'wifi_ssid';
const WIFI_PASSWORD_KEY = 'wifi_password';
const REGULATORY_DOMAIN_900_KEY = 'regulatory_domain_900';
const REGULATORY_DOMAIN_2400_KEY = 'regulatory_domain_2400';

export default class ApplicationStorage implements IApplicationStorage {
  async saveDeviceOptions(
    device: string,
    deviceOptions: DeviceOptions
  ): Promise<void> {
    const key = `${DEVICE_OPTIONS_BY_TARGET_KEYSPACE}.${device}`;
    localStorage.setItem(key, JSON.stringify(deviceOptions));
  }

  async getDeviceOptions(device: string): Promise<DeviceOptions | null> {
    const key = `${DEVICE_OPTIONS_BY_TARGET_KEYSPACE}.${device}`;
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

  async setBindingPhrase(bindingPhrase: string): Promise<void> {
    localStorage.setItem(BINDING_PHRASE_KEY, bindingPhrase);
  }

  async getBindingPhrase(): Promise<string> {
    const value = localStorage.getItem(BINDING_PHRASE_KEY);
    if (value === null) {
      return '';
    }
    return value;
  }

  async updateBindingPhraseHistory(bindingPhrase: string): Promise<void> {
    let history = await this.getBindingPhraseHistory();
    history = history.filter((item) => item !== bindingPhrase);
    history.push(bindingPhrase);
    history.length = Math.min(history.length, 10);
    localStorage.setItem(BINDING_PHRASE_HISTORY_KEY, JSON.stringify(history));
  }

  async getBindingPhraseHistory(): Promise<string[]> {
    const history = localStorage.getItem(BINDING_PHRASE_HISTORY_KEY);
    if (history === null) {
      return [''];
    }
    try {
      return JSON.parse(history);
    } catch (error) {
      console.error(error);
      return [''];
    }
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

  async setWifiSSID(bindingPhrase: string): Promise<void> {
    localStorage.setItem(WIFI_SSID_KEY, bindingPhrase);
  }

  async getWifiSSID(): Promise<string> {
    const value = localStorage.getItem(WIFI_SSID_KEY);
    if (value === null) {
      return '';
    }
    return value;
  }

  async setWifiPassword(bindingPhrase: string): Promise<void> {
    localStorage.setItem(WIFI_PASSWORD_KEY, bindingPhrase);
  }

  async getWifiPassword(): Promise<string> {
    const value = localStorage.getItem(WIFI_PASSWORD_KEY);
    if (value === null) {
      return '';
    }
    return value;
  }

  async setRegulatoryDomain900(bindingPhrase: UserDefineKey): Promise<void> {
    localStorage.setItem(REGULATORY_DOMAIN_900_KEY, bindingPhrase);
  }

  async getRegulatoryDomain900(): Promise<UserDefineKey | null> {
    return localStorage.getItem(REGULATORY_DOMAIN_900_KEY) as UserDefineKey;
  }

  async setRegulatoryDomain2400(bindingPhrase: UserDefineKey): Promise<void> {
    localStorage.setItem(REGULATORY_DOMAIN_2400_KEY, bindingPhrase);
  }

  async getRegulatoryDomain2400(): Promise<UserDefineKey | null> {
    return localStorage.getItem(REGULATORY_DOMAIN_2400_KEY) as UserDefineKey;
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
}
