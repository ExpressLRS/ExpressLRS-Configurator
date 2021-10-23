import { Query, Resolver, Root, Subscription } from 'type-graphql';
import { Service } from 'typedi';
import MulticastDnsService, {
  MulticastDnsServicePayload,
} from '../../services/MulticastDns';
import MulticastDnsInformation from '../../models/MulticastDnsInformation';
import PubSubTopic from '../../pubsub/enum/PubSubTopic';
import MulticastDnsMonitorUpdate from '../../models/MulticastDnsMonitorUpdate';

@Service()
@Resolver()
export default class MulticastDnsMonitorResolver {
  constructor(private multicastDnsService: MulticastDnsService) {}

  @Query(() => [MulticastDnsInformation])
  async availableMulticastDnsDevicesList() {
    return this.multicastDnsService.getAvailableDevices();
  }

  @Subscription(() => MulticastDnsMonitorUpdate, {
    topics: [PubSubTopic.MulticastDnsEvents],
  })
  multicastDnsMonitorUpdates(
    @Root() n: MulticastDnsServicePayload
  ): MulticastDnsMonitorUpdate {
    return new MulticastDnsMonitorUpdate(n.type, n.data);
  }
}
