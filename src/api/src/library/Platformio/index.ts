/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
/* eslint-disable no-await-in-loop */
import fs from 'fs';
import path from 'path';
import child_process from 'child_process';
import Commander, { CommandResult, NoOpFunc, OnOutputFunc } from '../Commander';

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

export default class Platformio {
  constructor(
    private getPlatformioPath: string,
    private stateTempStoragePath: string,
    private PATH: string,
    private env: NodeJS.ProcessEnv
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
      ? ['python.exe']
      : ['python3', 'python', 'python2'];
    const pythonAssertCode = [
      'import sys',
      'assert sys.version_info >= (2, 7)',
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
          if (
            fs.existsSync(executable) &&
            (await new Commander().runCommand(executable, [
              '-c',
              pythonAssertCode.join(';'),
            ]))
          ) {
            return executable;
          }
        } catch (err) {
          console.warn(executable, err);
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
    const pyExec = await this.findPythonExecutable(this.env?.PATH!);
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

  async getCorePythonExe(): Promise<string> {
    const state = await this.getPlatformioState();
    return state.python_exe;
  }

  async runPIOCommand(
    args: string[],
    options: child_process.SpawnOptions,
    onOutput: OnOutputFunc = NoOpFunc
  ) {
    console.log('pio cmd', args);
    const pyExec = await this.getCorePythonExe();
    console.log('py exec path', pyExec);
    const baseArgs = ['-m', 'platformio'];
    return new Commander().runCommand(
      pyExec,
      [...baseArgs, ...args],
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
      ['run', '--project-dir', projectDir, '--environment', environment],
      {
        env: this.env,
      },
      onUpdate
    );
  }

  async flash(
    projectDir: string,
    environment: string,
    onUpdate: OnOutputFunc = NoOpFunc
  ) {
    return this.runPIOCommand(
      [
        'run',
        '--project-dir',
        projectDir,
        '--environment',
        environment,
        '--target',
        'upload',
      ],
      {
        env: this.env,
      },
      onUpdate
    );
  }
}
