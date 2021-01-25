import { Octokit } from '@octokit/rest';

export interface IGitHubClient {
  loadTags(owner: string, repository: string): Promise<string[]>;

  loadBranches(owner: string, repository: string): Promise<string[]>;
}

/*
  It is a high chance that we will transition to querying local git repository
 */
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

  async loadBranches(owner: string, repository: string): Promise<string[]> {
    const response = await this.client.repos.listBranches({
      owner,
      repo: repository,
      per_page: 100,
    });
    return response.data.map((item) => item.name);
  }
}
