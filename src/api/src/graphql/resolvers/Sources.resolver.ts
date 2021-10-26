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
    @Arg('owner') owner: string,
    @Arg('repository') repository: string
  ) {
    return this.gitClient.loadBranches(owner, repository);
  }

  @Query(() => [String])
  async gitTags(
    @Arg('owner') owner: string,
    @Arg('repository') repository: string
  ) {
    const tags = await this.gitClient.loadTags(owner, repository);
    return tags;
  }

  @Query(() => [Release])
  async releases(
    @Arg('owner') owner: string,
    @Arg('repository') repository: string
  ) {
    const releases = await this.gitClient.loadReleases(owner, repository);
    return releases;
  }

  @Query(() => [PullRequest])
  async pullRequests(
    @Arg('owner') owner: string,
    @Arg('repository') repository: string
  ) {
    return this.gitClient.loadPullRequests(owner, repository);
  }
}
