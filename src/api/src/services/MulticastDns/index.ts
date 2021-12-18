import { Service } from 'typedi';
import { PubSubEngine } from 'graphql-subscriptions';
import * as http from 'http';
import makeMdns, { ResponsePacket } from 'multicast-dns';
import MulticastDnsInformation from '../../models/MulticastDnsInformation';
import PubSubTopic from '../../pubsub/enum/PubSubTopic';
import { LoggerService } from '../../logger';
import MulticastDnsEventType from '../../models/enum/MulticastDnsEventType';
import UserDefine from '../../models/UserDefine';
import UserDefineKey from '../../library/FirmwareBuilder/Enum/UserDefineKey';

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

  constructor(private pubSub: PubSubEngine, private logger: LoggerService) {
    this.devices = {};
    const mdns = makeMdns();
    mdns.on('response', (response: ResponsePacket) => {
      try {
        this.handleMulticastDnsResponse(response);
      } catch (e: any) {
        this.logger?.error(
          'Error encountered while handling multicast dns response:',
          e.trace,
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

    // check if any of the answers on the response have a name that starts with
    // 'elrs_', which indicates that it is an elers device
    const isElrs = !!items.find((item: any) => item.name.startsWith('elrs_'));

    if (isElrs) {
      const txtResponse: any = items.find((answer) => answer.type === 'TXT');

      const aResponse: any = items.find((answer) => answer.type === 'A');

      const srvResponse: any = items.find((answer) => answer.type === 'SRV');

      if (txtResponse && aResponse && srvResponse) {
        const dns: string = srvResponse.data?.target;
        const port: number = srvResponse.data?.port;
        const ip: string = aResponse.data;
        const name: string = txtResponse.name?.substring(
          0,
          txtResponse.name.indexOf('.')
        );
        let options: UserDefine[] = [];
        let version = '';
        let target = '';
        let type = '';
        let vendor = '';
        let deviceName = '';

        if (Array.isArray(txtResponse.data)) {
          txtResponse.data.forEach((item: any) => {
            if (item instanceof Buffer) {
              const dataItem = item.toString('utf-8');
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
          this.sendDeviceAdded(mdnsInformation);
        } else if (
          JSON.stringify(this.devices[name]) !== JSON.stringify(mdnsInformation)
        ) {
          this.devices[name] = mdnsInformation;
          this.sendDeviceUpdated(mdnsInformation);
        }
      }
    }
  }

  private removeDevice(name: string) {
    if (this.devices[name]) {
      const device = this.devices[name];
      delete this.devices[name];
      this.sendDeviceRemoved(device);
    }
  }

  private async sendDeviceAdded(data: MulticastDnsInformation): Promise<void> {
    const record = {
      type: MulticastDnsEventType.DeviceAdded,
      data,
    };

    this.logger?.log('multicast dns device added', record);
    return this.pubSub!.publish(PubSubTopic.MulticastDnsEvents, record);
  }

  private async sendDeviceRemoved(
    data: MulticastDnsInformation
  ): Promise<void> {
    const record = {
      type: MulticastDnsEventType.DeviceRemoved,
      data,
    };

    this.logger?.log('multicast dns device removed', record);
    return this.pubSub!.publish(PubSubTopic.MulticastDnsEvents, record);
  }

  private async sendDeviceUpdated(
    data: MulticastDnsInformation
  ): Promise<void> {
    const record = {
      type: MulticastDnsEventType.DeviceUpdated,
      data,
    };

    this.logger?.log('multicast dns device updated', record);
    return this.pubSub!.publish(PubSubTopic.MulticastDnsEvents, record);
  }

  async getAvailableDevices(): Promise<MulticastDnsInformation[]> {
    return Object.values(this.devices);
  }
}
