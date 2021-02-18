import { DeviceTarget, UserDefineKey } from '../../gql/generated/types';
import { DeviceOptions, IApplicationStorage } from '../index';
import deviceTargetKey from '../deviceTargetKey';

const persistDeviceOptions = async (
  storage: IApplicationStorage,
  deviceTarget: DeviceTarget,
  deviceOptions: DeviceOptions
): Promise<void> => {
  if (deviceTarget !== null) {
    await storage.SaveDeviceOptions(
      deviceTargetKey(deviceTarget),
      deviceOptions
    );

    const bindingPhrase = deviceOptions.userDefineOptions.find(
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

export default persistDeviceOptions;
