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
        switch (userDefine.key) {
          case UserDefineKey.BINDING_PHRASE:
          case UserDefineKey.HOME_WIFI_SSID:
          case UserDefineKey.HOME_WIFI_PASSWORD:
            await storage.setGlobalOption(
              userDefine.key,
              userDefine.value || '',
              userDefine.enabled
            );
            break;
          default:
            break;
        }
        if (userDefine.optionGroup && userDefine.enabled) {
          switch (userDefine.optionGroup) {
            case UserDefineOptionGroup.RegulatoryDomain900:
            case UserDefineOptionGroup.RegulatoryDomain2400:
              await storage.setOptionsGroupValue(
                userDefine.optionGroup,
                userDefine.key
              );
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
