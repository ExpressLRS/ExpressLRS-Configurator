import { Service } from 'typedi';
import { LoggerService } from '../../logger';
import LogEntry from '../../models/LogEntry';

export interface ILogFileArgs {
  numberOfLines: number;
}

export interface ILogFile {
  loadLogFile(args: ILogFileArgs): Promise<LogEntry[] | null>;
}

@Service()
export default class LogFileService implements ILogFile {
  constructor(private logger: LoggerService) {}

  async loadLogFile(args: ILogFileArgs) {
    const contentPromise = new Promise<LogEntry[] | null>((resolve) => {
      this.logger.log('Requested log content');
      this.logger.query(
        {
          rows: args.numberOfLines,
          order: 'desc',
          fields: ['timestamp', 'level', 'message', 'context'],
        },
        (err, result) => resolve(err ? null : result.file) // Maybe pass error insttead of null?
      );
    });
    return contentPromise;
  }
}
