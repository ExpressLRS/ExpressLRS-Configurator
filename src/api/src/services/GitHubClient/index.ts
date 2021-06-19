import { Octokit } from '@octokit/rest';
import { Service } from 'typedi';

export interface IGitHubClient {
  loadTags(owner: string, repository: string): Promise<string[]>;

  loadBranches(owner: string, repository: string): Promise<string[]>;
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
    return response.data
      .map((item) => item.name)
      .filter((name) => {
        /*
          These releases are not save to use. We do not want anyone using RC1-RC3 tags by accident.
         */
        const blacklist = ['1.0.0-RC1', '1.0.0-RC2', '1.0.0-RC3'];
        return !blacklist.includes(name);
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
}
