import { Service } from 'typedi';
import { PubSubEngine } from 'graphql-subscriptions';
import * as http from 'http';
import * as crypto from 'crypto';
import makeMdns, { QueryPacket, ResponsePacket } from 'multicast-dns';
import MulticastDnsInformation from '../../models/MulticastDnsInformation';
import PubSubTopic from '../../pubsub/enum/PubSubTopic';
import { LoggerService } from '../../logger';
import MulticastDnsEventType from '../../models/enum/MulticastDnsEventType';
import UserDefine from '../../models/UserDefine';

export interface MulticastDnsServicePayload {
  type: MulticastDnsEventType;
  data: MulticastDnsInformation;
}

@Service()
export default class MulticastDnsService {
  devices: { [name: string]: MulticastDnsInformation } = {};

  deviceLastUpdate: { [name: string]: Date } = {};

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

    mdns.on('query', (query: QueryPacket) => {
      // this.logger?.log('got a query packet:', query);
      // console.log('got a query packet:', query);
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

        // generate a unique id so I can track this request
        const id = crypto.randomBytes(16).toString('hex');
        // console.log(options);
        const req = http
          .request(options, (res) => {
            // console.log(`id: ${id} STATUS: ${res.statusCode}`);
            res.destroy();
          })
          .on('timeout', () => {
            // console.log(`id: ${id} TIMEOUT`);
            this.removeDevice(item.name);
          })
          .on('error', (e: any) => {
            // console.error(`id: ${id} ERROR ${e}`, e.trace, e);
            this.removeDevice(item.name);
          })
          .end();
      });
    }, this.healthCheckInterval);
  }

  private handleMulticastDnsResponse(response: ResponsePacket) {
    const items = [...response.answers, ...response.additionals];
    const filteredAnswers = items.find(
      (item: any) => item.name.indexOf('elrs_') === 0
    );
    if (filteredAnswers) {
      // this.logger?.log('got a response packet:', response as any);

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
        let options = '';
        let version = '';
        let target = '';
        let type = '';
        let vendor = '';

        if (Array.isArray(txtResponse.data)) {
          txtResponse.data.forEach((item: any) => {
            if (item instanceof Buffer) {
              const dataItem = item.toString('utf-8');
              const delimPos = dataItem.indexOf('=');
              const key = dataItem.substring(0, delimPos);
              const value = dataItem.substring(delimPos + 1);

              switch (key) {
                case 'options':
                  options = value;
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
        };

        if (!this.devices[name]) {
          this.devices[name] = mdnsInformation;
          this.sendDevicesAdded(mdnsInformation);
        } else if (
          JSON.stringify(this.devices[name]) !== JSON.stringify(mdnsInformation)
        ) {
          this.devices[name] = mdnsInformation;
          this.sendDevicesUpdated(mdnsInformation);
        }

        this.deviceLastUpdate[mdnsInformation.name] = new Date();

        // this.logger?.log('mdnsInformation:', mdnsInformation as any);
      }
    }
  }

  private removeDevice(name: string) {
    if (this.devices[name]) {
      const device = this.devices[name];
      delete this.devices[name];
      this.sendDevicesRemoved(device);
    }
  }

  private async sendDevicesAdded(data: MulticastDnsInformation): Promise<void> {
    const record = {
      type: MulticastDnsEventType.DeviceAdded,
      data,
    };

    this.logger?.log('multicast dns device added', record);
    return this.pubSub!.publish(PubSubTopic.MulticastDnsEvents, record);
  }

  private async sendDevicesRemoved(
    data: MulticastDnsInformation
  ): Promise<void> {
    const record = {
      type: MulticastDnsEventType.DeviceRemoved,
      data,
    };

    this.logger?.log('multicast dns device removed', record);
    return this.pubSub!.publish(PubSubTopic.MulticastDnsEvents, record);
  }

  private async sendDevicesUpdated(
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
