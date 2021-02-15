import { DeviceTarget, UserDefine } from '../gql/generated/types';

export interface IApplicationStorage {
  SaveDeviceOptions(
    deviceTarget: DeviceTarget,
    userDefines: UserDefine[]
  ): Promise<void>;

  GetDeviceOptions(deviceTarget: DeviceTarget): Promise<UserDefine[]>;

  SetBindingPhrase(bindingPhrase: string): Promise<void>;

  GetBindingPhrase(): Promise<string>;
}

const DEVICE_OPTIONS_BY_TARGET_KEYSPACE = 'device_options';
const BINDING_PHRASE_KEY = 'binding_phrase';

export default class ApplicationStorage implements IApplicationStorage {
  async SaveDeviceOptions(
    deviceTarget: DeviceTarget,
    userDefines: UserDefine[]
  ): Promise<void> {
    const key = `${DEVICE_OPTIONS_BY_TARGET_KEYSPACE}.${deviceTarget}`;
    localStorage.setItem(key, JSON.stringify(userDefines));
  }

  async GetDeviceOptions(deviceTarget: DeviceTarget): Promise<UserDefine[]> {
    const key = `${DEVICE_OPTIONS_BY_TARGET_KEYSPACE}.${deviceTarget}`;
    const value = localStorage.getItem(key);
    if (value === null) {
      return [];
    }
    try {
      return JSON.parse(value);
    } catch (e) {
      console.error(`failed to parse ${e}`);
      return [];
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
