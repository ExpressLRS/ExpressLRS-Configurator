/* eslint-disable no-await-in-loop */
import { Service } from 'typedi';
import { FlashingStrategy, IsCompatibleArgs } from './FlashingStrategy';
import { LoggerService } from '../../logger';
import GitRepository from '../../graphql/inputs/GitRepositoryInput';

@Service()
export default class FlashingStrategyLocatorService {
  constructor(
    private flashingStrategies: FlashingStrategy[],
    private logger: LoggerService
  ) {}

  async locate(
    params: IsCompatibleArgs,
    gitRepository: GitRepository
  ): Promise<FlashingStrategy> {
    for (let i = 0; i < this.flashingStrategies.length; i++) {
      const strategy = this.flashingStrategies[i];
      if (
        // eslint-disable-next-line no-await-in-loop
        await strategy.isCompatible(params, gitRepository)
      ) {
        this.logger.log('picked flashing strategy', {
          strategy: strategy.name,
        });
        return strategy;
      }
    }
    throw new Error('No compatible flashing strategy found!');
  }

  async clearFirmwareFiles(): Promise<void> {
    const jobs = this.flashingStrategies.map((strategy) =>
      strategy.clearFirmwareFiles()
    );
    await Promise.all(jobs);
  }
}
