import { Query, Resolver } from 'type-graphql';
import { Inject, Service } from 'typedi';
import OctopusGitHubClient from '../../services/GitHubClient';
import { ConfigToken, IConfig } from '../../config';

@Service()
@Resolver()
export default class SourcesResolver {
  constructor(
    private gitClient: OctopusGitHubClient,
    @Inject(ConfigToken) private config: IConfig
  ) {}

  @Query(() => [String])
  async gitBranches() {
    return this.gitClient.loadBranches(
      this.config.git.owner,
      this.config.git.repositoryName
    );
  }

  @Query(() => [String])
  async gitTags() {
    return new OctopusGitHubClient().loadTags(
      this.config.git.owner,
      this.config.git.repositoryName
    );
  }
}
