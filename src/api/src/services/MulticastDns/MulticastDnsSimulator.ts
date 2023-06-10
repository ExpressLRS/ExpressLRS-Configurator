import { Service } from 'typedi';
import MulticastDnsInformation from '../../models/MulticastDnsInformation';
import UserDefineKey from '../../library/FirmwareBuilder/Enum/UserDefineKey';
import UserDefine from '../../models/UserDefine';
import MulticastDnsNotificationsService from '../MulticastDnsNotificationsService';

@Service()
export default class MulticastDnsSimulatorService {
  devices: { [name: string]: MulticastDnsInformation } = {};

  constructor(private notifications: MulticastDnsNotificationsService) {
    const hmTx = {
      name: 'elrs_tx_AAAAAAA',
      dns: 'elrs_tx.local',
      ip: '192.168.1.94',
      options: [
        UserDefine.Text(
          UserDefineKey.BINDING_PHRASE,
          `test-tx-binding-phrase`,
          true,
          true
        ),
        UserDefine.Boolean(UserDefineKey.UART_INVERTED, true),
      ],
      version: '2.0.0 (5c4808)',
      target: 'HAPPYMODEL_ES24TX_2400_TX',
      type: 'tx',
      vendor: 'elrs',
      port: 80,
      deviceName: 'HM ES24TX',
    };
    const hmRx = {
      name: 'elrs_rx_AAAAAAA',
      dns: 'elrs_rx.local',
      ip: '192.168.1.95',
      options: [
        UserDefine.Text(
          UserDefineKey.BINDING_PHRASE,
          `test-rx-binding-phrase`,
          true,
          true
        ),
        UserDefine.Boolean(UserDefineKey.UART_INVERTED, true),
      ],
      version: '2.0.0 (5c4808)',
      target: 'HAPPYMODEL_EP_2400_RX',
      type: 'rx',
      vendor: 'elrs',
      port: 80,
      deviceName: 'HM ES24RX',
    };
    this.devices = {
      elrs_tx_AAAAAAA: hmTx,
    };

    setInterval(() => {
      this.notifications.sendDeviceAdded(this.devices.elrs_tx_AAAAAAA);
    }, 8 * 1000);

    setInterval(() => {
      if (this.devices[hmRx.name] === undefined) {
        this.devices[hmRx.name] = hmRx;
        this.notifications.sendDeviceAdded(hmRx);
      } else {
        delete this.devices[hmRx.name];
        this.notifications.sendDeviceRemoved(hmRx);
      }
    }, 10 * 1000);
  }

  async getAvailableDevices(): Promise<MulticastDnsInformation[]> {
    return Object.values(this.devices);
  }
}
