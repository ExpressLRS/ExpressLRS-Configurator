import { Service } from 'typedi';
import { LoggerService } from '../../logger';
import LogEntry from '../../models/LogEntry';

export interface ILogFileArgs {
  numberOfLines: number;
}

export interface ILogFile {
  loadLogFile(args: ILogFileArgs): Promise<LogEntry[]>;
}

@Service()
export default class LogFileService implements ILogFile {
  constructor(private logger: LoggerService) {}

  async loadLogFile(args: ILogFileArgs) {
    this.logger.log('Requested log content');
    const logFileContent = await this.logger.query({
      rows: args.numberOfLines,
      order: 'desc',
      fields: ['timestamp', 'level', 'message', 'context'],
    });
    return logFileContent as LogEntry[];
  }
}
