import { Args, Query, Resolver } from 'type-graphql';
import { Service } from 'typedi';
import LogFileService from '../../services/LogFile';
import LogFile from '../../models/LogFile';
import LogFileArgs from '../args/LogFile';

@Service()
@Resolver()
export default class LogFileResolver {
  constructor(private logFileService: LogFileService) {}

  @Query(() => LogFile)
  async logFile(@Args() args: LogFileArgs): Promise<LogFile> {
    const content = await this.logFileService.loadLogFile(args);
    return { content };
  }
}
