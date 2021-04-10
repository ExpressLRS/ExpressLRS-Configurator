import { Service } from 'typedi';
import SerialPort from 'serialport';
import { PubSubEngine } from 'graphql-subscriptions';
import SerialPortInformation from '../../models/SerialPortInformation';
import PubSubTopic from '../../pubsub/enum/PubSubTopic';
import { LoggerService } from '../../logger';

@Service()
export default class SerialMonitorService {
  port: SerialPort | null;

  constructor(private pubSub: PubSubEngine, private logger: LoggerService) {
    this.port = null;
  }

  private async sendLogs(data: string): Promise<void> {
    this.logger?.log('serial monitor stream message', {
      data,
    });
    return this.pubSub!.publish(PubSubTopic.SerialMonitorStream, {
      data,
    });
  }

  async getAvailableDevices(): Promise<SerialPortInformation[]> {
    const list = await SerialPort.list();
    return list.map(
      (item) => new SerialPortInformation(item.path, item.manufacturer || '')
    );
  }

  async connect(device: string, baudRate: number): Promise<void> {
    if (this.port !== null) {
      throw new Error('serial port is already being used');
    }

    this.port = new SerialPort(device, {
      baudRate,
    });

    // Open errors will be emitted as an error event
    this.port.on('error', (err) => {
      this.sendLogs(`Serial port error: ${err.message}`);
      this.port = null;
    });

    // this.port.on('');
  }

  async disconnect(): Promise<void> {
    if (this.port === null) {
      throw new Error('not connected');
    }
    return new Promise((resolve, reject) => {
      this.port?.close((err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }
}
