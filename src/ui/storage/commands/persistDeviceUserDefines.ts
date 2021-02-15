import {
  DeviceTarget,
  UserDefine,
  UserDefineKey,
} from '../../gql/generated/types';
import { IApplicationStorage } from '../index';

const persistDeviceUserDefines = async (
  storage: IApplicationStorage,
  deviceTarget: DeviceTarget,
  userDefines: UserDefine[]
): Promise<void> => {
  if (deviceTarget !== null && userDefines.length > 0) {
    await storage.SaveDeviceOptions(deviceTarget, userDefines);
    const bindingPhrase = userDefines.find(
      ({ key }) => key === UserDefineKey.BINDING_PHRASE
    );
    if (
      bindingPhrase !== undefined &&
      bindingPhrase.enabled &&
      bindingPhrase.value &&
      bindingPhrase.value?.length > 0
    ) {
      await storage.SetBindingPhrase(bindingPhrase.value);
    }
  }
};

export default persistDeviceUserDefines;
