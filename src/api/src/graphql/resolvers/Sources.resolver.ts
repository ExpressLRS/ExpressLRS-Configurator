import { Query, Resolver } from 'type-graphql';
import { Inject, Service } from 'typedi';
import OctopusGitHubClient from '../../services/GitHubClient';
import { ConfigToken, IConfig } from '../../config';
import Release from '../../models/Release';
import PullRequest from '../../models/PullRequest';

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
    return this.gitClient.loadTags(
      this.config.git.owner,
      this.config.git.repositoryName
    );
  }

  @Query(() => [Release])
  async releases() {
    return this.gitClient.loadReleases(
      this.config.git.owner,
      this.config.git.repositoryName
    );
  }

  @Query(() => [PullRequest])
  async pullRequests() {
    return this.gitClient.loadPullRequests(
      this.config.git.owner,
      this.config.git.repositoryName
    );
  }
}
