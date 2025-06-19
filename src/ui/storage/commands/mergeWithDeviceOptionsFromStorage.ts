import {
  UserDefine,
  UserDefineKey,
  UserDefineOptionGroup,
} from '../../gql/generated/types';
import { DeviceOptions, IApplicationStorage } from '../index';

const mergeWithDeviceOptionsFromStorage = async (
  storage: IApplicationStorage,
  device: string | null,
  deviceOptions: DeviceOptions
): Promise<DeviceOptions> => {
  const savedBindingPhrase = await storage.getGlobalOption(
    UserDefineKey.BINDING_PHRASE
  );
  const savedTargetOptions = device
    ? await storage.getDeviceOptions(device)
    : null;
  const wifiSSID = await storage.getGlobalOption(UserDefineKey.HOME_WIFI_SSID);
  const wifiPassword = await storage.getGlobalOption(
    UserDefineKey.HOME_WIFI_PASSWORD
  );
  const regulatoryDomain900 = await storage.getOptionsGroupValue(
    UserDefineOptionGroup.RegulatoryDomain900
  );
  const regulatoryDomain2400 = await storage.getOptionsGroupValue(
    UserDefineOptionGroup.RegulatoryDomain2400
  );

  const addOverrides = (deviceOption: UserDefine): UserDefine => {
    if (
      deviceOption.key === UserDefineKey.BINDING_PHRASE &&
      savedBindingPhrase !== null
    ) {
      return {
        ...deviceOption,
        enabled: savedBindingPhrase.enabled || false,
        value: savedBindingPhrase.value,
      };
    }
    if (
      deviceOption.key === UserDefineKey.HOME_WIFI_SSID &&
      wifiSSID !== null
    ) {
      return {
        ...deviceOption,
        enabled: wifiSSID.enabled || false,
        value: wifiSSID.value,
      };
    }
    if (
      deviceOption.key === UserDefineKey.HOME_WIFI_PASSWORD &&
      wifiPassword !== null
    ) {
      return {
        ...deviceOption,
        enabled: wifiPassword.enabled || false,
        value: wifiPassword.value,
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
    if (
      deviceOption.optionGroup === UserDefineOptionGroup.RegulatoryDomain2400
    ) {
      return {
        ...deviceOption,
        enabled: deviceOption.key === regulatoryDomain2400,
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
