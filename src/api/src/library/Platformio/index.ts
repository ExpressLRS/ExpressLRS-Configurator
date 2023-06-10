import fs from 'fs';
import path from 'path';
import child_process from 'child_process';
import rimraf from 'rimraf';
import * as os from 'os';
import Commander, { CommandResult, NoOpFunc, OnOutputFunc } from '../Commander';
import { LoggerService } from '../../logger';
import UploadType from './Enum/UploadType';
import Python from '../Python';

interface PlatformioCoreState {
  core_version: string;
  python_version: string;
  core_dir: string;
  cache_dir: string;
  penv_dir: string;
  penv_bin_dir: string;
  platformio_exe: string;
  installer_version: string;
  python_exe: string;
  system: string;
  is_develop_core: boolean;
}

const prependPATH = (pth: string, item: string): string => {
  if (pth.indexOf(item) > -1) {
    return pth;
  }
  if (pth.length > 0) {
    return `${item}${path.delimiter}${pth}`;
  }
  return item;
};

const envFilter = (
  env: NodeJS.ProcessEnv,
  blacklist: string[]
): NodeJS.ProcessEnv => {
  const result: NodeJS.ProcessEnv = {};
  Object.keys(env).forEach((key) => {
    if (!blacklist.includes(key)) {
      result[key] = env[key];
    }
  });
  return result;
};

export default class Platformio {
  private env: NodeJS.ProcessEnv;

  constructor(
    private getPlatformioPath: string,
    private stateTempStoragePath: string,
    env: NodeJS.ProcessEnv,
    private logger: LoggerService,
    private python: Python
  ) {
    // Fix for https://github.com/ExpressLRS/ExpressLRS-Configurator/issues/440
    const blacklistedEnvKeys = ['PYTHONPATH', 'PYTHONHOME'];
    this.env = envFilter(env, blacklistedEnvKeys);
  }

  async install(onUpdate: OnOutputFunc = NoOpFunc): Promise<CommandResult> {
    return this.python.runPythonScript(this.getPlatformioPath, [], onUpdate);
  }

  async checkCore(): Promise<CommandResult> {
    const cmdArgs = ['check', 'core'];
    return this.python.runPythonScript(this.getPlatformioPath, cmdArgs);
  }

  async checkPython(): Promise<CommandResult> {
    const pyExec = await this.python.findPythonExecutable(this.python.PATH);
    return new Commander().runCommand(
      pyExec,
      [this.getPlatformioPath, 'check', 'python'],
      {
        env: this.env,
      }
    );
  }

  async getPlatformioState(): Promise<PlatformioCoreState> {
    const statePath = path.join(
      this.stateTempStoragePath,
      `core-dump-${Math.round(Math.random() * 1000000)}.json`
    );

    const cmdArgs = ['check', 'core', '--dump-state', statePath];

    const result = await this.python.runPythonScript(
      this.getPlatformioPath,
      cmdArgs
    );

    if (!result.success) {
      throw new Error(
        `failed to get state json: ${result.stderr} ${result.stdout}`
      );
    }

    const coreStateRaw = await fs.promises.readFile(statePath, 'utf8');
    await fs.promises.unlink(statePath);

    let coreState: PlatformioCoreState | null = null;
    try {
      coreState = JSON.parse(coreStateRaw);
    } catch (e) {
      throw new Error(`failed to parse platformio core state ${e}`);
    }

    if (coreState === null) {
      throw new Error('platformio core state is null');
    }

    return coreState;
  }

  async runPIOCommand(
    args: string[],
    options: child_process.SpawnOptions,
    onOutput: OnOutputFunc = NoOpFunc
  ) {
    this.logger.log('pio cmd', {
      args,
    });
    const state = await this.getPlatformioState();
    this.logger.log('platformio state', {
      state,
    });

    if (
      options?.env?.PATH?.length !== undefined &&
      options?.env?.PATH?.length > 0 &&
      state.penv_bin_dir.length > 0
    ) {
      options.env.PATH = prependPATH(options.env.PATH, state.penv_bin_dir);
      this.logger.log('bundle platformio venv PATH with env PATH', {
        newPath: options.env.PATH,
      });
    }

    // eslint-disable-next-line @typescript-eslint/naming-convention
    let { platformio_exe } = state;
    // if using shell, surround exe in quotes in case path has a space in it
    if (options.shell) {
      platformio_exe = `"${platformio_exe}"`;
    }

    return new Commander().runCommand(
      platformio_exe,
      [...args],
      options,
      onOutput
    );
  }

  async build(
    projectDir: string,
    environment: string,
    onUpdate: OnOutputFunc = NoOpFunc
  ) {
    return this.runPIOCommand(
      ['run', '--project-dir', `"${projectDir}"`, '--environment', environment],
      {
        env: this.env,
        shell: true,
        windowsVerbatimArguments: true,
      },
      onUpdate
    );
  }

  async flash(
    projectDir: string,
    environment: string,
    serialPort: string | undefined,
    uploadType: UploadType,
    onUpdate: OnOutputFunc = NoOpFunc
  ) {
    const params = [
      'run',
      '--project-dir',
      `"${projectDir}"`,
      '--environment',
      environment,
      '--target',
      uploadType,
    ];
    if (serialPort !== undefined && serialPort !== null) {
      params.push('--upload-port');
      params.push(serialPort);
    }
    return this.runPIOCommand(
      params,
      {
        env: this.env,
        shell: true,
        windowsVerbatimArguments: true,
      },
      onUpdate
    );
  }

  async removePlatformioDir(): Promise<void> {
    const dotPlatformio = path.join(os.homedir(), '.platformio');
    const statResult = await fs.promises.lstat(dotPlatformio);
    if (!statResult.isDirectory()) {
      return Promise.resolve();
    }
    return new Promise((resolve, reject) => {
      rimraf(dotPlatformio, (err) => {
        if (err) {
          reject();
        } else {
          resolve();
        }
      });
    });
  }

  async clearPlatformioUsingCoreState(): Promise<void> {
    const platformioStateJson = await this.getPlatformioState();
    if (
      platformioStateJson.core_dir === undefined ||
      platformioStateJson.core_dir.length === 0 ||
      platformioStateJson.core_dir.indexOf('.platformio') === -1
    ) {
      throw new Error(`core_dir is invalid: ${platformioStateJson.core_dir}`);
    }

    const statResult = await fs.promises.lstat(platformioStateJson.core_dir);
    if (!statResult.isDirectory()) {
      throw new Error(`core_dir is invalid: ${platformioStateJson.core_dir}`);
    }

    return new Promise((resolve, reject) => {
      rimraf(platformioStateJson.core_dir, (err) => {
        if (err) {
          reject();
        } else {
          resolve();
        }
      });
    });
  }

  async clearPlatformioCoreDir(): Promise<void> {
    try {
      await this.clearPlatformioUsingCoreState();
    } catch (e) {
      this.logger?.error(
        'failed to clear platformio files using platformio state',
        undefined,
        {
          err: e,
        }
      );
      return this.removePlatformioDir();
    }
    return Promise.resolve();
  }
}
