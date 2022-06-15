import { Service } from 'typedi';
import { BuildFlashFirmwareParams } from './BuildFlashFirmwareParams';
import { FlashingStrategy } from './FlashingStrategy';
import { LoggerService } from '../../logger';

@Service()
export default class FlashingStrategyLocatorService {
  constructor(
    private flashingStrategies: FlashingStrategy[],
    private logger: LoggerService
  ) {}

  async locate(
    params: BuildFlashFirmwareParams,
    gitRepositoryUrl: string,
    gitRepositorySrcFolder: string
  ): Promise<FlashingStrategy> {
    for (let i = 0; i < this.flashingStrategies.length; i++) {
      const strategy = this.flashingStrategies[i];
      if (
        // eslint-disable-next-line no-await-in-loop
        await strategy.isCompatible(
          params,
          gitRepositoryUrl,
          gitRepositorySrcFolder
        )
      ) {
        return strategy;
      }
    }
    throw new Error('No compatible flashing strategy found!');
  }
}
