import { Service } from 'typedi';
import { PubSubEngine } from 'graphql-subscriptions';
import MulticastDnsInformation from '../../models/MulticastDnsInformation';
import MulticastDnsEventType from '../../models/enum/MulticastDnsEventType';
import PubSubTopic from '../../pubsub/enum/PubSubTopic';
import { LoggerService } from '../../logger';

@Service()
export default class MulticastDnsNotificationsService {
  constructor(private pubSub: PubSubEngine, private logger: LoggerService) {}

  public async sendDeviceAdded(data: MulticastDnsInformation): Promise<void> {
    const record = {
      type: MulticastDnsEventType.DeviceAdded,
      data,
    };

    this.logger?.log('multicast dns device added', record);
    return this.pubSub!.publish(PubSubTopic.MulticastDnsEvents, record);
  }

  public async sendDeviceRemoved(data: MulticastDnsInformation): Promise<void> {
    const record = {
      type: MulticastDnsEventType.DeviceRemoved,
      data,
    };

    this.logger?.log('multicast dns device removed', record);
    return this.pubSub!.publish(PubSubTopic.MulticastDnsEvents, record);
  }

  public async sendDeviceUpdated(data: MulticastDnsInformation): Promise<void> {
    const record = {
      type: MulticastDnsEventType.DeviceUpdated,
      data,
    };

    this.logger?.log('multicast dns device updated', record);
    return this.pubSub!.publish(PubSubTopic.MulticastDnsEvents, record);
  }
}
