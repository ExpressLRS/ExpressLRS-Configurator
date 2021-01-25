import { IpcMainEvent } from 'electron';
import Mutex from '../../../library/Mutex';
import { MainResponseType, PushMessageType } from '../../../ipc';
import Platformio from '../../../library/Platformio';

interface InstallDependenciesHandlerProps {
  platformio: Platformio;
}

export interface InstallDependenciesResponseBody {
  success: boolean;
  message?: string;
}

export default class InstallDependenciesHandler {
  private mutex: Mutex;

  private platformio: Platformio;

  constructor({ platformio }: InstallDependenciesHandlerProps) {
    this.mutex = new Mutex();
    this.platformio = platformio;
  }

  async processRequest(event: IpcMainEvent) {
    if (this.mutex.isLocked()) {
      console.error('there is another build/flash request in progress...');
      return;
    }
    this.mutex.tryLock();

    const sendResponse = (body: InstallDependenciesResponseBody) => {
      event.reply(MainResponseType.InstallDependencies, body);
      this.mutex.unlock();
    };
    const sendLogs = (data: string) => {
      event.reply(PushMessageType.InstallDependenciesLogEntry, data);
    };
    const result = await this.platformio.install(sendLogs);

    if (result.success) {
      sendResponse({
        success: true,
      });
    } else {
      sendResponse({
        success: false,
      });
    }
  }
}
