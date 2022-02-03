/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
/* eslint-disable no-await-in-loop */
import fs from 'fs';
import path from 'path';
import child_process from 'child_process';
import Commander, { CommandResult, NoOpFunc, OnOutputFunc } from '../Commander';
import { LoggerService } from '../../logger';
import BuildJobType from '../../models/enum/BuildJobType';

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

export default class Platformio {
  constructor(
    private getPlatformioPath: string,
    private stateTempStoragePath: string,
    private PATH: string,
    private env: NodeJS.ProcessEnv,
    private logger: LoggerService
  ) {}

  async install(onUpdate: OnOutputFunc = NoOpFunc): Promise<CommandResult> {
    const pyExec = await this.findPythonExecutable(this.PATH);
    if (pyExec === null) {
      throw new Error('python executable not found');
    }
    return new Commander().runCommand(
      pyExec,
      [this.getPlatformioPath],
      {
        env: this.env,
      },
      onUpdate
    );
  }

  async checkCore(): Promise<CommandResult> {
    const pyExec = await this.findPythonExecutable(this.PATH);
    return new Commander().runCommand(
      pyExec,
      [this.getPlatformioPath, 'check', 'core'],
      {
        env: this.env,
      }
    );
  }

  async checkPython(): Promise<CommandResult> {
    const pyExec = await this.findPythonExecutable(this.PATH);
    return new Commander().runCommand(
      pyExec,
      [this.getPlatformioPath, 'check', 'python'],
      {
        env: this.env,
      }
    );
  }

  async verifyDependencies(): Promise<boolean> {
    const pio = await this.checkCore();
    const py = await this.checkPython();
    return pio.success && py.success;
  }

  async findPythonExecutable(envPath: string): Promise<string> {
    const IS_WINDOWS = process.platform.startsWith('win');
    const exenames = IS_WINDOWS
      ? ['python3.exe', 'python.exe']
      : ['python3', 'python', 'python2'];
    const pythonAssertCode = [
      'import sys',
      'assert sys.version_info >= (3, 6)',
      'print(sys.executable)',
    ];
    // eslint-disable-next-line no-restricted-syntax
    for (const location of envPath.split(path.delimiter)) {
      // eslint-disable-next-line no-restricted-syntax
      for (const exename of exenames) {
        const executable = path
          .normalize(path.join(location, exename))
          .replace(/"/g, '');
        try {
          let res: CommandResult | null = null;
          if (
            fs.existsSync(executable) &&
            // eslint-disable-next-line no-cond-assign
            (res = await new Commander().runCommand(executable, [
              '-c',
              pythonAssertCode.join(';'),
            ]))
          ) {
            this.logger.log('testing python exec', {
              executable,
              stdout: res.stdout,
              stderr: res.stderr,
              success: res.success,
            });
            if (res.success) {
              return executable;
            }
          }
        } catch (err) {
          this.logger.warn('got an exception in python search', {
            executable,
            err,
          });
        }
      }
    }

    throw new Error('python not found');
  }

  async getPlatformioState(): Promise<PlatformioCoreState> {
    const statePath = path.join(
      this.stateTempStoragePath,
      `core-dump-${Math.round(Math.random() * 1000000)}.json`
    );
    const pyExec = await this.findPythonExecutable(this.PATH!);
    const cmdArgs = [
      this.getPlatformioPath,
      'check',
      'core',
      '--dump-state',
      statePath,
    ];
    const result = await new Commander().runCommand(pyExec, cmdArgs, {
      env: this.env,
    });
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
    onUpdate: OnOutputFunc = NoOpFunc,
    buildJobType: BuildJobType
  ) {
    let pioTarget = 'upload';
    if (buildJobType === BuildJobType.ForceFlash) {
      pioTarget = 'uploadforce';
    } else if (buildJobType === BuildJobType.CheckTarget) {
      pioTarget = 'uploadconfirm';
    }

    const params = [
      'run',
      '--project-dir',
      `"${projectDir}"`,
      '--environment',
      environment,
      '--target',
      pioTarget,
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
}
