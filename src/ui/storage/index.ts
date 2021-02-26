import {
  DeviceTarget,
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
    deviceTarget: DeviceTarget,
    deviceOptions: DeviceOptions
  ): Promise<void>;

  getDeviceOptions(deviceTarget: DeviceTarget): Promise<DeviceOptions | null>;

  setBindingPhrase(bindingPhrase: string): Promise<void>;

  getBindingPhrase(): Promise<string>;

  getFirmwareSource(): Promise<FirmwareVersionDataInput | null>;

  setFirmwareSource(input: FirmwareVersionDataInput): Promise<void>;
}

const DEVICE_OPTIONS_BY_TARGET_KEYSPACE = 'device_options';
const BINDING_PHRASE_KEY = 'binding_phrase';
const FIRMWARE_SOURCE_KEY = 'firmware_source';

export default class ApplicationStorage implements IApplicationStorage {
  async saveDeviceOptions(
    deviceTarget: DeviceTarget,
    deviceOptions: DeviceOptions
  ): Promise<void> {
    const key = `${DEVICE_OPTIONS_BY_TARGET_KEYSPACE}.${deviceTarget}`;
    localStorage.setItem(key, JSON.stringify(deviceOptions));
  }

  async getDeviceOptions(
    deviceTarget: DeviceTarget
  ): Promise<DeviceOptions | null> {
    const key = `${DEVICE_OPTIONS_BY_TARGET_KEYSPACE}.${deviceTarget}`;
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
}
