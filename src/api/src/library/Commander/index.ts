import child_process from 'child_process';
import spawn from 'cross-spawn';

export type OnOutputFunc = (output: string) => void;
export const NoOpFunc = () => {};

export interface CommandResult {
  code: number;
  success: boolean;
  stdout: string;
  stderr: string;
}

export default class Commander {
  // eslint-disable-next-line class-methods-use-this
  async runCommand(
    cmd: string,
    args: string[],
    options: child_process.SpawnOptions = {},
    onOutput: OnOutputFunc = NoOpFunc
  ): Promise<CommandResult> {
    return new Promise((resolve) => {
      const outputLines: any[] = []; // eslint-disable-line @typescript-eslint/no-explicit-any
      const errorLines: any[] = []; // eslint-disable-line @typescript-eslint/no-explicit-any
      let completed = false;

      const onExit = (code: number | null) => {
        if (completed) {
          return;
        }
        completed = true;

        const stdout = outputLines.map((x) => x.toString()).join('');
        const stderr = errorLines.map((x) => x.toString()).join('');
        if (code !== 0) {
          resolve({
            code: code === null ? -1 : code,
            success: false,
            stdout,
            stderr,
          });
        } else {
          resolve({
            code,
            success: true,
            stdout,
            stderr,
          });
        }
      };

      try {
        const child = spawn(cmd, args, options);

        child.stdout?.on('data', (line) => {
          outputLines.push(line);
          onOutput(line.toString());
        });
        child.stderr?.on('data', (line) => {
          errorLines.push(line);
          onOutput(line.toString());
        });
        child.on('close', onExit);
        child.on('error', (err) => {
          errorLines.push(err.toString());
          onExit(-1);
        });
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        errorLines.push(err?.toString());
        onExit(-1);
      }
    });
  }
}
