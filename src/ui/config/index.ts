import GitRepository from '../models/GitRepository';

interface IConfig {
  documentationUrl: string;
  githubRepositoryUrl: string;
  facebookGroupUrl: string;
  discordUrl: string;
  openCollectiveUrl: string;
  expressLRSGit: GitRepository;
  backpackGit: GitRepository;
}

export const Config: IConfig = {
  documentationUrl: 'https://www.expresslrs.org/',
  githubRepositoryUrl: 'https://github.com/ExpressLRS/ExpressLRS',
  facebookGroupUrl: 'https://www.facebook.com/groups/636441730280366',
  discordUrl: 'https://discord.gg/dS6ReFY',
  openCollectiveUrl: 'https://opencollective.com/expresslrs',
  expressLRSGit: {
    cloneUrl: 'https://github.com/ExpressLRS/ExpressLRS',
    url: 'https://github.com/ExpressLRS/ExpressLRS',
    owner: 'ExpressLRS',
    repositoryName: 'ExpressLRS',
    rawRepoUrl: 'https://raw.githubusercontent.com/ExpressLRS/ExpressLRS',
    srcFolder: 'src',
    tagExcludes: ['<2.5.0'],
    hardwareArtifactUrl:
      'https://artifactory.expresslrs.org/ExpressLRS/hardware.zip',
  },
  backpackGit: {
    cloneUrl: 'https://github.com/ExpressLRS/Backpack',
    url: 'https://github.com/ExpressLRS/Backpack',
    owner: 'ExpressLRS',
    repositoryName: 'Backpack',
    rawRepoUrl: 'https://raw.githubusercontent.com/ExpressLRS/Backpack',
    srcFolder: '/',
    tagExcludes: [],
    hardwareArtifactUrl: null,
  },
};

export default Config;
