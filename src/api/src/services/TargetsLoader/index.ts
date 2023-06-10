import TargetArgs from '../../graphql/args/Target';
import Device from '../../models/Device';

export interface GitRepository {
  url: string;
  owner: string;
  repositoryName: string;
  srcFolder: string;
}

export default abstract class TargetsLoader {
  abstract loadTargetsList(
    args: TargetArgs,
    gitRepository: GitRepository
  ): Promise<Device[]>;

  abstract clearCache(): Promise<void>;
}
