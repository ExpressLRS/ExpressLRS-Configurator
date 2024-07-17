import { Service } from 'typedi';
import { SerialPort } from 'serialport';
import { PubSubEngine } from 'graphql-subscriptions';
import SerialPortInformation from '../../models/SerialPortInformation';
import PubSubTopic from '../../pubsub/enum/PubSubTopic';
import { LoggerService } from '../../logger';
import SerialMonitorEventType from '../../models/enum/SerialMonitorEventType';
import { insideFlatpak, listPorts } from './flatpak';

export interface SerialMonitorLogUpdatePayload {
  data: string;
}

export interface SerialMonitorEventPayload {
  type: SerialMonitorEventType;
}

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

  private async sendEvent(type: SerialMonitorEventType): Promise<void> {
    this.logger?.log('serial monitor event', {
      type,
    });
    return this.pubSub!.publish(PubSubTopic.SerialMonitorEvents, {
      type,
    });
  }

  async getAvailableDevices(): Promise<SerialPortInformation[]> {
    let list;
    if (insideFlatpak()) {
      list = await listPorts();
    } else {
      list = await SerialPort.list();
    }
    return list.map(
      (item) => new SerialPortInformation(item.path, item.manufacturer || '')
    );
  }

  async connect(device: string, baudRate: number): Promise<void> {
    if (this.port !== null) {
      this.logger.log(
        'we are already connected to serial device, resetting connection'
      );
      await this.disconnect();
    }

    this.port = new SerialPort({
      path: device,
      baudRate,
      autoOpen: false,
    });

    this.port.on('error', (err) => {
      this.sendLogs(`Serial port error: ${err.message}`);
      this.sendEvent(SerialMonitorEventType.Error);
      this.port = null;
    });

    this.port.on('data', (data) => {
      this.sendLogs(data.toString());
    });

    this.port.on('close', () => {
      this.sendLogs('Serial port closed');
      this.sendEvent(SerialMonitorEventType.Disconnected);
    });

    await this.sendEvent(SerialMonitorEventType.Connecting);
    return new Promise((resolve, reject) => {
      this.port?.open((err) => {
        if (err) {
          reject(err);
        } else {
          this.sendEvent(SerialMonitorEventType.Connected);
          resolve();
        }
      });
    });
  }

  async disconnect(): Promise<void> {
    if (this.port === null) {
      return Promise.resolve();
    }
    return new Promise((resolve) => {
      this.port?.close(() => {
        this.port = null;
        resolve();
      });
    });
  }
}
