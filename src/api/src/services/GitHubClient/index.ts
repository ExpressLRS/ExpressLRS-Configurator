import { Octokit } from '@octokit/rest';
import { Service } from 'typedi';
import PullRequest from '../../models/PullRequest';

export interface Release {
  tagName: string;
  preRelease: boolean;
}

export interface IGitHubClient {
  loadTags(owner: string, repository: string): Promise<string[]>;

  loadReleases(owner: string, repository: string): Promise<Release[]>;

  loadBranches(owner: string, repository: string): Promise<string[]>;

  loadPullRequests(owner: string, repository: string): Promise<PullRequest[]>;
}

@Service()
export default class OctopusGitHubClient implements IGitHubClient {
  client: Octokit;

  constructor() {
    this.client = new Octokit();
  }

  async loadTags(owner: string, repository: string): Promise<string[]> {
    const response = await this.client.repos.listTags({
      owner,
      repo: repository,
      per_page: 50,
    });
    return response.data.map((item) => item.name);
  }

  async loadReleases(owner: string, repository: string): Promise<Release[]> {
    const response = await this.client.repos.listReleases({
      owner,
      repo: repository,
      per_page: 100,
    });
    return response.data.map((item) => {
      return {
        tagName: item.tag_name,
        preRelease: item.prerelease,
      };
    });
  }

  async loadBranches(owner: string, repository: string): Promise<string[]> {
    const response = await this.client.repos.listBranches({
      owner,
      repo: repository,
      per_page: 100,
    });
    return response.data.map((item) => item.name);
  }

  async loadPullRequests(
    owner: string,
    repository: string
  ): Promise<PullRequest[]> {
    const response = await this.client.rest.pulls.list({
      owner,
      repo: repository,
      per_page: 100,
      state: 'open',
    });
    return response.data.map((item) => {
      return {
        id: item.id,
        number: item.number,
        title: item.title,
        headCommitHash: item.head.sha,
      };
    });
  }

  async getRelease(owner: string, repository: string, tag: string) {
    const response = await this.client.repos.getReleaseByTag({
      owner,
      repo: repository,
      tag,
    });
    return response.data;
  }
}
