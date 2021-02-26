import {
  DeviceTarget,
  UserDefine,
  UserDefineKey,
} from '../../gql/generated/types';
import { DeviceOptions, IApplicationStorage } from '../index';
import deviceTargetKey from '../deviceTargetKey';

const mergeWithDeviceOptionsFromStorage = async (
  storage: IApplicationStorage,
  deviceTarget: DeviceTarget | null,
  deviceOptions: DeviceOptions
): Promise<DeviceOptions> => {
  if (deviceTarget === null) {
    return deviceOptions;
  }
  const savedBindingPhrase = await storage.getBindingPhrase();
  const savedTargetOptions = await storage.getDeviceOptions(
    deviceTargetKey(deviceTarget)
  );
  const addOverrides = (deviceOption: UserDefine): UserDefine => {
    if (
      deviceOption.key === UserDefineKey.BINDING_PHRASE &&
      savedBindingPhrase.length > 0
    ) {
      return {
        ...deviceOption,
        value: savedBindingPhrase,
      };
    }
    return deviceOption;
  };
  const userDefineOptions = deviceOptions.userDefineOptions.map(
    (deviceOption) => {
      if (savedTargetOptions === null) {
        return addOverrides(deviceOption);
      }
      const savedOption = savedTargetOptions?.userDefineOptions.find(
        ({ key }) => key === deviceOption.key
      );
      if (savedOption === undefined) {
        return addOverrides(deviceOption);
      }
      const opt: UserDefine = {
        ...deviceOption,
        enabled: savedOption.enabled,
        value: savedOption.value,
      };
      return addOverrides(opt);
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
