import { UserDefineKey } from '../../gql/generated/types';
import { DeviceOptions, IApplicationStorage } from '../index';

const persistDeviceOptions = async (
  storage: IApplicationStorage,
  device: string,
  deviceOptions: DeviceOptions
): Promise<void> => {
  if (deviceOptions !== null) {
    await storage.saveDeviceOptions(device, deviceOptions);

    const bindingPhrase = deviceOptions.userDefineOptions.find(
      ({ key }) => key === UserDefineKey.BINDING_PHRASE
    );
    if (
      bindingPhrase !== undefined &&
      bindingPhrase.enabled &&
      bindingPhrase.value &&
      bindingPhrase.value?.length > 0
    ) {
      await storage.setBindingPhrase(bindingPhrase.value);
    }
  }
};

export default persistDeviceOptions;
