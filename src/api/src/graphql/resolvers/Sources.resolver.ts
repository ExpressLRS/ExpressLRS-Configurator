import { Arg, Query, Resolver } from 'type-graphql';
import { Service } from 'typedi';
import OctopusGitHubClient from '../../services/GitHubClient';
import Release from '../../models/Release';
import PullRequest from '../../models/PullRequest';
import GitRepo from '../inputs/GitRepoInput';

@Service()
@Resolver()
export default class SourcesResolver {
  constructor(private gitClient: OctopusGitHubClient) {}

  @Query(() => [String])
  async gitBranches(@Arg('gitRepo') gitRepo: GitRepo) {
    return this.gitClient.loadBranches(gitRepo.owner, gitRepo.repositoryName);
  }

  @Query(() => [String])
  async gitTags(@Arg('gitRepo') gitRepo: GitRepo) {
    return this.gitClient.loadTags(gitRepo.owner, gitRepo.repositoryName);
  }

  @Query(() => [Release])
  async releases(@Arg('gitRepo') gitRepo: GitRepo) {
    return this.gitClient.loadReleases(gitRepo.owner, gitRepo.repositoryName);
  }

  @Query(() => [PullRequest])
  async pullRequests(@Arg('gitRepo') gitRepo: GitRepo) {
    return this.gitClient.loadPullRequests(
      gitRepo.owner,
      gitRepo.repositoryName
    );
  }
}
