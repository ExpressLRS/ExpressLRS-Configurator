import {
  DeviceTarget,
  UserDefine,
  UserDefinesMode,
} from '../gql/generated/types';

export interface DeviceOptions {
  userDefinesMode: UserDefinesMode;
  userDefineOptions: UserDefine[];
  userDefinesTxt: string;
}

export interface IApplicationStorage {
  SaveDeviceOptions(
    deviceTarget: DeviceTarget,
    deviceOptions: DeviceOptions
  ): Promise<void>;

  GetDeviceOptions(deviceTarget: DeviceTarget): Promise<DeviceOptions | null>;

  SetBindingPhrase(bindingPhrase: string): Promise<void>;

  GetBindingPhrase(): Promise<string>;
}

const DEVICE_OPTIONS_BY_TARGET_KEYSPACE = 'device_options';
const BINDING_PHRASE_KEY = 'binding_phrase';

export default class ApplicationStorage implements IApplicationStorage {
  async SaveDeviceOptions(
    deviceTarget: DeviceTarget,
    deviceOptions: DeviceOptions
  ): Promise<void> {
    const key = `${DEVICE_OPTIONS_BY_TARGET_KEYSPACE}.${deviceTarget}`;
    localStorage.setItem(key, JSON.stringify(deviceOptions));
  }

  async GetDeviceOptions(
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

  async SetBindingPhrase(bindingPhrase: string): Promise<void> {
    localStorage.setItem(BINDING_PHRASE_KEY, bindingPhrase);
  }

  async GetBindingPhrase(): Promise<string> {
    const value = localStorage.getItem(BINDING_PHRASE_KEY);
    if (value === null) {
      return '';
    }
    return value;
  }
}
