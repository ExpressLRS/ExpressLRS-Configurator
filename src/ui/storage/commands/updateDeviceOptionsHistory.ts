import { DeviceOptions, IApplicationStorage } from '../index';

const updateDeviceOptionHistory = async (
  storage: IApplicationStorage,
  deviceOptions: DeviceOptions
): Promise<void> => {
  if (deviceOptions !== null) {
    await Promise.all(
      deviceOptions.userDefineOptions.map(async (userDefine) => {
        if (
          userDefine.historyEnabled &&
          userDefine.value &&
          userDefine.value?.length > 0
        ) {
          storage.updateHistory(userDefine.key, userDefine.value);
        }
      })
    );
  }
};

export default updateDeviceOptionHistory;
