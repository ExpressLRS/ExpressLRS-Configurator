import { Query, Resolver } from 'type-graphql';
import { Service } from 'typedi';
import SerialMonitorService from '../../services/SerialMonitor';
import SerialPortInformation from '../../models/SerialPortInformation';

@Service()
@Resolver()
export default class SerialMonitorResolver {
  constructor(private serialMonitorService: SerialMonitorService) {}

  @Query(() => [SerialPortInformation])
  async availableDevicesList() {
    return this.serialMonitorService.getAvailableDevices();
  }
}
