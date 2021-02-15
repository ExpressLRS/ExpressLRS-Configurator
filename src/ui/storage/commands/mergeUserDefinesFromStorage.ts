import { DeviceTarget, UserDefine } from '../../gql/generated/types';
import { IApplicationStorage } from '../index';

const mergeUserDefinesFromStorage = async (
  storage: IApplicationStorage,
  deviceTarget: DeviceTarget | null,
  userDefines: UserDefine[]
): Promise<UserDefine[]> => {
  if (deviceTarget === null) {
    return userDefines;
  }
  const savedBindingPhrase = await storage.GetBindingPhrase();
  const savedTargetOptions = await storage.GetDeviceOptions(deviceTarget);
  return userDefines.map((deviceOption) => {
    const savedOption = savedTargetOptions.find(
      ({ key }) => key === deviceOption.key
    );
    let enabled = false;
    let value: string | null | undefined;
    if (savedOption !== undefined) {
      enabled = savedOption.enabled;
      value = savedOption.value;
    }
    if (savedBindingPhrase.length > 0) {
      value = savedBindingPhrase;
    }
    const opt: UserDefine = {
      ...deviceOption,
      enabled,
      value,
    };
    return opt;
  });
};

export default mergeUserDefinesFromStorage;
