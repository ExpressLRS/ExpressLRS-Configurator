import { IpcMainEvent } from 'electron';
import Mutex from '../../../library/Mutex';
import { MainResponseType } from '../../../ipc';
import { findGitExecutable } from '../../../library/FirmwareDownloader';
import Platformio from '../../../library/Platformio';

export enum ConfiguratorDependency {
  Git = 'git',
  Python = 'python',
  // TODO: eslint bug
  // eslint-disable-next-line @typescript-eslint/no-shadow
  Platformio = 'platformio',
}

export interface CheckDependenciesResponseBody {
  success: boolean;
  message?: string;
  presentDependencies: ConfiguratorDependency[];
  missingDependencies: ConfiguratorDependency[];
}

interface CheckDependenciesHandlerProps {
  platformio: Platformio;
  PATH: string;
}

export default class CheckDependenciesHandler {
  private mutex: Mutex;

  private PATH: string;

  private platformio: Platformio;

  constructor({ platformio, PATH }: CheckDependenciesHandlerProps) {
    this.mutex = new Mutex();
    this.PATH = PATH;
    this.platformio = platformio;
  }

  async processRequest(event: IpcMainEvent) {
    if (this.mutex.isLocked()) {
      return;
    }
    this.mutex.tryLock();

    const sendResponse = (body: CheckDependenciesResponseBody) => {
      event.reply(MainResponseType.CheckDependencies, body);
      this.mutex.unlock();
    };

    try {
      const presentDependencies: ConfiguratorDependency[] = [];
      const missingDependencies: ConfiguratorDependency[] = [];
      try {
        await findGitExecutable(this.PATH);
        presentDependencies.push(ConfiguratorDependency.Git);
      } catch (e) {
        missingDependencies.push(ConfiguratorDependency.Git);
      }

      const pythonCheck = await this.platformio.checkCore();
      if (!pythonCheck.success) {
        missingDependencies.push(ConfiguratorDependency.Python);
      } else {
        presentDependencies.push(ConfiguratorDependency.Python);
      }
      const coreCheck = await this.platformio.checkCore();
      if (!coreCheck.success) {
        missingDependencies.push(ConfiguratorDependency.Platformio);
      } else {
        presentDependencies.push(ConfiguratorDependency.Platformio);
      }

      sendResponse({
        success: missingDependencies.length === 0,
        presentDependencies,
        missingDependencies,
      });
    } catch (e) {
      sendResponse({
        presentDependencies: [],
        missingDependencies: [],
        message: `Failed to check dependencies: ${e}`,
        success: false,
      });
    }
  }
}
