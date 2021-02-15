import {
  DeviceTarget,
  UserDefine,
  UserDefineKey,
} from '../../gql/generated/types';
import { DeviceOptions, IApplicationStorage } from '../index';

const mergeWithDeviceOptionsFromStorage = async (
  storage: IApplicationStorage,
  deviceTarget: DeviceTarget | null,
  deviceOptions: DeviceOptions
): Promise<DeviceOptions> => {
  if (deviceTarget === null) {
    return deviceOptions;
  }
  const savedBindingPhrase = await storage.GetBindingPhrase();
  const savedTargetOptions = await storage.GetDeviceOptions(deviceTarget);
  const userDefineOptions = deviceOptions.userDefineOptions.map(
    (deviceOption) => {
      if (savedTargetOptions === null) {
        return deviceOption;
      }
      const savedOption = savedTargetOptions?.userDefineOptions.find(
        ({ key }) => key === deviceOption.key
      );
      if (savedOption === undefined) {
        return deviceOption;
      }

      const { enabled } = savedOption;
      let { value } = savedOption;
      if (
        deviceOption.key === UserDefineKey.BINDING_PHRASE &&
        savedBindingPhrase.length > 0
      ) {
        value = savedBindingPhrase;
      }
      const opt: UserDefine = {
        ...deviceOption,
        enabled,
        value,
      };
      return opt;
    }
  );
  return {
    userDefinesMode:
      savedTargetOptions?.userDefinesMode ?? deviceOptions.userDefinesMode,
    userDefinesTxt:
      savedTargetOptions?.userDefinesTxt ?? deviceOptions?.userDefinesTxt,
    userDefineOptions,
  };
};

export default mergeWithDeviceOptionsFromStorage;
