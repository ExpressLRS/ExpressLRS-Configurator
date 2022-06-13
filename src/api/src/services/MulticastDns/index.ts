import { Service } from 'typedi';
import * as http from 'http';
import makeMdns, { ResponsePacket } from 'multicast-dns';
import { SrvAnswer, StringAnswer, TxtAnswer } from 'dns-packet';
import MulticastDnsInformation from '../../models/MulticastDnsInformation';
import { LoggerService } from '../../logger';
import MulticastDnsEventType from '../../models/enum/MulticastDnsEventType';
import UserDefine from '../../models/UserDefine';
import UserDefineKey from '../../library/FirmwareBuilder/Enum/UserDefineKey';
import MulticastDnsNotificationsService from '../MulticastDnsNotificationsService';

export interface MulticastDnsServicePayload {
  type: MulticastDnsEventType;
  data: MulticastDnsInformation;
}

@Service()
export default class MulticastDnsService {
  devices: { [name: string]: MulticastDnsInformation } = {};

  mdnsQueryInterval = 10000;

  healthCheckInterval = 4000;

  healthCheckTimeout = 3000;

  constructor(
    private notifications: MulticastDnsNotificationsService,
    private logger: LoggerService
  ) {
    this.devices = {};
    const mdns = makeMdns();
    mdns.on('response', (response: ResponsePacket) => {
      try {
        this.handleMulticastDnsResponse(response);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (e: any) {
        this.logger?.error(
          'Error encountered while handling multicast dns response:',
          e?.trace,
          { err: e }
        );
      }
    });

    setInterval(() => {
      mdns.query({
        questions: [{ name: '_http._tcp.local', type: 'PTR', class: 'IN' }],
      });
    }, this.mdnsQueryInterval);

    setInterval(() => {
      Object.values(this.devices).forEach((item) => {
        const options = {
          host: item.ip,
          port: item.port,
          method: 'GET',
          timeout: this.healthCheckTimeout,
        };

        http
          .request(options, (res) => {
            // console.log(`id: ${id} STATUS: ${res.statusCode}`);
            res.destroy();
          })
          .on('timeout', () => {
            // console.log(`id: ${id} TIMEOUT`);
            this.removeDevice(item.name);
          })
          .on('error', () => {
            // console.error(`id: ${id} ERROR ${e}`, e.trace, e);
            this.removeDevice(item.name);
          })
          .end();
      });
    }, this.healthCheckInterval);
  }

  private parseOptions(optionsString: string): UserDefine[] {
    // regex pattern for identifying userdefines
    // eslint-disable-next-line no-useless-escape
    const userDefinesRegexp = /#*?-(D[A-z0-9-_]*?)(?==\"(.*?)\"|\s|$)/g;
    const parsedResults = [...optionsString.matchAll(userDefinesRegexp)];

    const userDefines: UserDefine[] = [];

    parsedResults?.forEach((match) => {
      const key = match[1];
      const userDefineKey = Object.values(UserDefineKey).find(
        (item) => item.toUpperCase() === key
      );

      if (userDefineKey) {
        if (match.length === 3) {
          if (match[2]) {
            const sensitiveKeys = [
              UserDefineKey.BINDING_PHRASE,
              UserDefineKey.HOME_WIFI_SSID,
              UserDefineKey.HOME_WIFI_PASSWORD,
            ];
            const sensitive = sensitiveKeys.includes(userDefineKey);
            userDefines.push(
              UserDefine.Text(userDefineKey, match[2], true, sensitive)
            );
          } else {
            userDefines.push(UserDefine.Boolean(userDefineKey, true));
          }
        }
      } else {
        this.logger.error(
          `error while parsing user defines, user define key ${key} not found`,
          Error().stack
        );
      }
    });

    return userDefines;
  }

  private handleMulticastDnsResponse(response: ResponsePacket) {
    const items = [...response.answers, ...response.additionals];

    const txtResponse: TxtAnswer = items.find(
      (answer) => answer.type === 'TXT'
    ) as TxtAnswer;

    if (txtResponse) {
      let options: UserDefine[] = [];
      let version = '';
      let target = '';
      let type = '';
      let vendor = '';
      let deviceName = '';

      if (Array.isArray(txtResponse.data)) {
        txtResponse.data.forEach((i) => {
          if (i instanceof Buffer) {
            const dataItem = i.toString('utf-8');
            const delimPos = dataItem.indexOf('=');
            const key = dataItem.substring(0, delimPos);
            const value = dataItem.substring(delimPos + 1);

            switch (key) {
              case 'options':
                options = this.parseOptions(value);
                break;
              case 'version':
                version = value;
                break;
              case 'target':
                target = value;
                break;
              case 'type':
                type = value;
                break;
              case 'vendor':
                vendor = value;
                break;
              case 'device':
                deviceName = value;
                break;
              default:
                break;
            }
          }
        });
      }

      if (vendor === 'elrs') {
        const name = txtResponse.name?.substring(
          0,
          txtResponse.name.indexOf('.')
        );

        const srvResponse: SrvAnswer = items.find(
          (answer) => answer.type === 'SRV'
        ) as SrvAnswer;

        if (srvResponse) {
          const dns: string = srvResponse.data?.target;
          const port: number = srvResponse.data?.port;

          const aResponse: StringAnswer = items.find(
            (answer) =>
              answer.type === 'A' && answer.name === srvResponse.data.target
          ) as StringAnswer;

          if (aResponse) {
            const ip: string = aResponse.data;

            const mdnsInformation: MulticastDnsInformation = {
              name,
              dns,
              ip,
              options,
              version,
              target,
              type,
              vendor,
              port,
              deviceName,
            };

            if (!this.devices[name]) {
              this.devices[name] = mdnsInformation;
              this.notifications.sendDeviceAdded(mdnsInformation);
            } else if (
              JSON.stringify(this.devices[name]) !==
              JSON.stringify(mdnsInformation)
            ) {
              this.devices[name] = mdnsInformation;
              this.notifications.sendDeviceUpdated(mdnsInformation);
            }
          }
        }
      }
    }
  }

  private removeDevice(name: string) {
    if (this.devices[name]) {
      const device = this.devices[name];
      delete this.devices[name];
      this.notifications.sendDeviceRemoved(device);
    }
  }

  async getAvailableDevices(): Promise<MulticastDnsInformation[]> {
    return Object.values(this.devices);
  }
}
