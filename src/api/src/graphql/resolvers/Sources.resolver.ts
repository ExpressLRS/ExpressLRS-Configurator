import { Arg, Query, Resolver } from 'type-graphql';
import { Service } from 'typedi';
import OctopusGitHubClient from '../../services/GitHubClient';
import Release from '../../models/Release';
import PullRequest from '../../models/PullRequest';

@Service()
@Resolver()
export default class SourcesResolver {
  constructor(private gitClient: OctopusGitHubClient) {}

  @Query(() => [String])
  async gitBranches(
    @Arg('owner', () => String) owner: string,
    @Arg('repository', () => String) repository: string
  ) {
    return this.gitClient.loadBranches(owner, repository);
  }

  @Query(() => [String])
  async gitTags(
    @Arg('owner', () => String) owner: string,
    @Arg('repository', () => String) repository: string
  ) {
    return this.gitClient.loadTags(owner, repository);
  }

  @Query(() => [Release])
  async releases(
    @Arg('owner', () => String) owner: string,
    @Arg('repository', () => String) repository: string
  ) {
    return this.gitClient.loadReleases(owner, repository);
  }

  @Query(() => [PullRequest])
  async pullRequests(
    @Arg('owner', () => String) owner: string,
    @Arg('repository', () => String) repository: string
  ) {
    return this.gitClient.loadPullRequests(owner, repository);
  }
}
