import { Octokit } from '@octokit/rest';
import { Service } from 'typedi';
import semver from 'semver/preload';
import UpdatesAvailability from '../../models/UpdatesAvailability';

@Service()
export default class UpdatesService {
  client: Octokit;

  constructor(private repositoryOwner: string, private repositoryName: string) {
    this.client = new Octokit();
  }

  async checkForNewerReleases(
    currentVersion: string
  ): Promise<UpdatesAvailability> {
    const response = await this.client.repos.listReleases({
      owner: this.repositoryOwner,
      repo: this.repositoryName,
      per_page: 100,
    });

    if (response.status !== 200 || response.data.length === 0) {
      return new UpdatesAvailability(false);
    }

    const newestVersion = semver.coerce(response.data[0].tag_name);
    if (newestVersion === null) {
      return new UpdatesAvailability(false);
    }

    if (semver.gt(newestVersion, currentVersion)) {
      return new UpdatesAvailability(
        true,
        newestVersion.format(),
        response.data[0].html_url
      );
    }
    return new UpdatesAvailability(false);
  }
}
