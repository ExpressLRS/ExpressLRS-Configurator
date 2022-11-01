import {
  Arg,
  Mutation,
  Query,
  Resolver,
  Root,
  Subscription,
} from 'type-graphql';
import { Service } from 'typedi';
import SerialMonitorService, {
  SerialMonitorEventPayload,
  SerialMonitorLogUpdatePayload,
} from '../../services/SerialMonitor';
import SerialPortInformation from '../../models/SerialPortInformation';
import SerialPortConnectResult from '../objects/SerialPortConnectResult';
import SerialConnectionConfigInput from '../inputs/SerialConnectionConfigInput';
import SerialPortDisconnectResult from '../objects/SerialPortDisconnectResult';
import PubSubTopic from '../../pubsub/enum/PubSubTopic';
import SerialMonitorLogUpdate from '../../models/SerialMonitorLogUpdate';
import SerialMonitorEvent from '../../models/SerialMonitorEvent';

@Service()
@Resolver()
export default class SerialMonitorResolver {
  constructor(private serialMonitorService: SerialMonitorService) {}

  @Query(() => [SerialPortInformation])
  async availableDevicesList() {
    return this.serialMonitorService.getAvailableDevices();
  }

  @Mutation(() => SerialPortConnectResult)
  async connectToSerialDevice(
    @Arg('input') input: SerialConnectionConfigInput
  ): Promise<SerialPortConnectResult> {
    try {
      await this.serialMonitorService.connect(input.port, input.baudRate);
      return new SerialPortConnectResult(true);
    } catch (e) {
      return new SerialPortConnectResult(false, `Error occurred: ${e}`);
    }
  }

  @Mutation(() => SerialPortDisconnectResult)
  async disconnectFromSerialDevice(): Promise<SerialPortDisconnectResult> {
    try {
      await this.serialMonitorService.disconnect();
      return new SerialPortDisconnectResult(true);
    } catch (e) {
      return new SerialPortDisconnectResult(false, `Error occurred: ${e}`);
    }
  }

  @Subscription(() => SerialMonitorLogUpdate, {
    topics: [PubSubTopic.SerialMonitorStream],
  })
  serialMonitorLogs(
    @Root() n: SerialMonitorLogUpdatePayload
  ): SerialMonitorLogUpdate {
    return new SerialMonitorLogUpdate(n.data);
  }

  @Subscription(() => SerialMonitorEvent, {
    topics: [PubSubTopic.SerialMonitorEvents],
  })
  serialMonitorEvents(
    @Root() n: SerialMonitorEventPayload
  ): SerialMonitorEvent {
    return new SerialMonitorEvent(n.type);
  }
}
