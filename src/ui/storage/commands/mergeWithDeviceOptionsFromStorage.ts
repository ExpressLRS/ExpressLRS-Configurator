import {
  UserDefineOptionGroup,
  UserDefine,
  UserDefineKey,
} from '../../gql/generated/types';
import { DeviceOptions, IApplicationStorage } from '../index';

const mergeWithDeviceOptionsFromStorage = async (
  storage: IApplicationStorage,
  device: string | null,
  deviceOptions: DeviceOptions
): Promise<DeviceOptions> => {
  const savedBindingPhrase = await storage.getBindingPhrase();
  const savedTargetOptions = device
    ? await storage.getDeviceOptions(device)
    : null;
  const wifiSSID = await storage.getWifiSSID();
  const wifiPassword = await storage.getWifiPassword();
  const regulatoryDomain900 = await storage.getRegulatoryDomain900();

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
    if (
      deviceOption.key === UserDefineKey.HOME_WIFI_SSID &&
      wifiSSID.length > 0
    ) {
      return {
        ...deviceOption,
        value: wifiSSID,
      };
    }
    if (
      deviceOption.key === UserDefineKey.HOME_WIFI_PASSWORD &&
      wifiPassword.length > 0
    ) {
      return {
        ...deviceOption,
        value: wifiPassword,
      };
    }
    if (
      deviceOption.optionGroup === UserDefineOptionGroup.RegulatoryDomain900
    ) {
      return {
        ...deviceOption,
        enabled: deviceOption.key === regulatoryDomain900,
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
