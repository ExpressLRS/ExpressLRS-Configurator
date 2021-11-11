import {
  UserDefineOptionGroup,
  UserDefineKey,
} from '../../gql/generated/types';
import { DeviceOptions, IApplicationStorage } from '../index';

const persistDeviceOptions = async (
  storage: IApplicationStorage,
  device: string,
  deviceOptions: DeviceOptions
): Promise<void> => {
  if (deviceOptions !== null) {
    await storage.saveDeviceOptions(device, deviceOptions);

    await Promise.all(
      deviceOptions.userDefineOptions.map(async (userDefine) => {
        if (userDefine.key === UserDefineKey.BINDING_PHRASE) {
          if (
            userDefine.enabled &&
            userDefine.value &&
            userDefine.value?.length > 0
          ) {
            await storage.setBindingPhrase(userDefine.value);
          }
        } else if (userDefine.key === UserDefineKey.HOME_WIFI_SSID) {
          if (
            userDefine.enabled &&
            userDefine.value &&
            userDefine.value?.length > 0
          ) {
            await storage.setWifiSSID(userDefine.value);
          }
        } else if (userDefine.key === UserDefineKey.HOME_WIFI_PASSWORD) {
          if (
            userDefine.enabled &&
            userDefine.value &&
            userDefine.value?.length > 0
          ) {
            await storage.setWifiPassword(userDefine.value);
          }
        } else if (
          userDefine.optionGroup &&
          userDefine.optionGroup ===
            UserDefineOptionGroup.RegulatoryDomain900 &&
          userDefine.enabled
        ) {
          await storage.setRegulatoryDomain900(userDefine.key);
        }
      })
    );
  }
};

export default persistDeviceOptions;
