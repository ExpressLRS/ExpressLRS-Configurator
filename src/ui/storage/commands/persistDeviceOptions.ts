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
        if (
          userDefine.enabled &&
          userDefine.value &&
          userDefine.value?.length > 0
        ) {
          switch (userDefine.key) {
            case UserDefineKey.BINDING_PHRASE:
              await storage.setBindingPhrase(userDefine.value);
              break;
            case UserDefineKey.HOME_WIFI_SSID:
              await storage.setWifiSSID(userDefine.value);
              break;
            case UserDefineKey.HOME_WIFI_PASSWORD:
              await storage.setWifiPassword(userDefine.value);
              break;
            default:
              break;
          }
        }
        if (userDefine.optionGroup && userDefine.enabled) {
          switch (userDefine.optionGroup) {
            case UserDefineOptionGroup.RegulatoryDomain900:
              await storage.setRegulatoryDomain900(userDefine.key);
              break;
            case UserDefineOptionGroup.RegulatoryDomain2400:
              await storage.setRegulatoryDomain2400(userDefine.key);
              break;
            default:
              break;
          }
        }
      })
    );
  }
};

export default persistDeviceOptions;
