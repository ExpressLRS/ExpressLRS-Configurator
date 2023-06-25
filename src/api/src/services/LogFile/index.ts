import { Service } from 'typedi';
import readLastLines from 'read-last-lines';

import LogFileArgs from '../../graphql/args/LogFile';
import { LoggerService } from '../../logger';

export interface ILogFile {
  loadLogFile(args: LogFileArgs): Promise<string>;
}

@Service()
export default class LogFileService implements ILogFile {
  constructor(private logFilePath: string, private logger: LoggerService) {}

  async loadLogFile(args: LogFileArgs): Promise<string> {
    this.logger.log('Requested log content');
    return readLastLines.read(this.logFilePath, args.numberOfLines);
  }
}
