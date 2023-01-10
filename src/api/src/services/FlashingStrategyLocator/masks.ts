import cloneDeep from 'lodash/cloneDeep';
import { BuildFlashFirmwareParams } from './BuildFlashFirmwareParams';
import UserDefineKey from '../../library/FirmwareBuilder/Enum/UserDefineKey';

export const maskSensitiveData = (haystack: string): string => {
  const needles = [
    'HOME_WIFI_SSID',
    'HOME_WIFI_PASSWORD',
    'MY_BINDING_PHRASE',
    'MY_UID',
  ];
  for (let i = 0; i < needles.length; i++) {
    if (haystack.includes(needles[i])) {
      return '***';
    }
  }
  return haystack;
};

export const maskBuildFlashFirmwareParams = (
  params: BuildFlashFirmwareParams
): BuildFlashFirmwareParams => {
  const result = cloneDeep(params);
  if (result.userDefinesTxt?.length > 0) {
    result.userDefinesTxt = '******';
  }
  result.userDefines = result.userDefines.map((userDefine) => {
    const sensitiveDataKeys = [
      UserDefineKey.BINDING_PHRASE,
      UserDefineKey.HOME_WIFI_SSID,
      UserDefineKey.HOME_WIFI_PASSWORD,
    ];
    if (sensitiveDataKeys.includes(userDefine.key)) {
      return {
        ...userDefine,
        value: '***',
      };
    }
    return userDefine;
  });
  return result;
};
