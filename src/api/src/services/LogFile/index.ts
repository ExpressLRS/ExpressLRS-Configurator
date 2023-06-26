import { Service } from 'typedi';
import { LoggerService } from '../../logger';

export interface ILogFileArgs {
  numberOfLines: number;
}

export interface ILogFile {
  loadLogFile(args: ILogFileArgs): Promise<string>;
}

@Service()
export default class LogFileService implements ILogFile {
  constructor(private logger: LoggerService) {}

  async loadLogFile(args: ILogFileArgs): Promise<string> {
    const contentPromise = new Promise<string>((resolve) => {
      this.logger.log('Requested log content');
      this.logger.query(
        {
          rows: args.numberOfLines,
          order: 'desc',
          fields: ['timestamp', 'level', 'message', 'context'],
        },
        (err, result) => {
          if (err) {
            resolve(JSON.stringify({ error: err }));
          } else {
            resolve(JSON.stringify(result.file));
          }
        }
      );
    });
    return contentPromise;
  }
}
