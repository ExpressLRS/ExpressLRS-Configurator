import 'reflect-metadata';
import UserDefinesTxtFactory from './UserDefinesTxtFactory';
import UserDefine from '../models/UserDefine';
import UserDefineKey from '../library/FirmwareBuilder/Enum/UserDefineKey';

describe('UserDefinesTxtFactory', () => {
  const factory = new UserDefinesTxtFactory();

  it('writes each enabled option kind as a build flag', () => {
    const result = factory.build([
      UserDefine.Boolean(UserDefineKey.UART_INVERTED, true),
      UserDefine.Text(UserDefineKey.HOME_WIFI_SSID, 'network', true),
      UserDefine.Number(UserDefineKey.AUTO_WIFI_ON_INTERVAL, '60', true, 1),
    ]);
    expect(result.split('\r\n')).toEqual([
      '-DUART_INVERTED',
      '-DHOME_WIFI_SSID="network"',
      '-DAUTO_WIFI_ON_INTERVAL="60"',
    ]);
  });

  it('skips disabled options', () => {
    const result = factory.build([
      UserDefine.Number(UserDefineKey.AUTO_WIFI_ON_INTERVAL, '60', false, 1),
    ]);
    expect(result).toEqual('');
  });
});
