import {
  FirmwareVersionDataInput,
  UserDefine,
  UserDefinesMode,
} from '../gql/generated/types';

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

  getFirmwareSource(): Promise<FirmwareVersionDataInput | null>;

  setFirmwareSource(input: FirmwareVersionDataInput): Promise<void>;

  getShowPreReleases(defaultValue: boolean): Promise<boolean>;

  setShowPreReleases(value: boolean): Promise<void>;
}

const DEVICE_OPTIONS_BY_TARGET_KEYSPACE = 'device_options';
const BINDING_PHRASE_KEY = 'binding_phrase';
const FIRMWARE_SOURCE_KEY = 'firmware_source';
const UI_SHOW_FIRMWARE_PRE_RELEASES = 'ui_show_pre_releases';

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

  async getFirmwareSource(): Promise<FirmwareVersionDataInput | null> {
    const value = localStorage.getItem(FIRMWARE_SOURCE_KEY);
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

  async setFirmwareSource(input: FirmwareVersionDataInput): Promise<void> {
    localStorage.setItem(FIRMWARE_SOURCE_KEY, JSON.stringify(input));
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
}
