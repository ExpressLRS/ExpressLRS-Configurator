import GitRepository from '../models/GitRepository';

interface IConfig {
  githubRepositoryUrl: string;
  facebookGroupUrl: string;
  discordUrl: string;
  expressLRSGit: GitRepository;
  backpackGit: GitRepository;
}

export const Config: IConfig = {
  githubRepositoryUrl: 'https://github.com/ExpressLRS/ExpressLRS',
  facebookGroupUrl: 'https://www.facebook.com/groups/636441730280366',
  discordUrl: 'https://discord.gg/dS6ReFY',
  expressLRSGit: {
    cloneUrl: 'https://github.com/ExpressLRS/ExpressLRS',
    url: 'https://github.com/ExpressLRS/ExpressLRS',
    owner: 'ExpressLRS',
    repositoryName: 'ExpressLRS',
    rawRepoUrl: 'https://raw.githubusercontent.com/ExpressLRS/ExpressLRS',
    srcFolder: '/src',
    tagExcludes: ['1.0.0-RC1', '1.0.0-RC2', '1.0.0-RC3'],
  },
  backpackGit: {
    cloneUrl: 'https://github.com/ExpressLRS/Backpack',
    url: 'https://github.com/ExpressLRS/Backpack',
    owner: 'ExpressLRS',
    repositoryName: 'Backpack',
    rawRepoUrl: 'https://raw.githubusercontent.com/ExpressLRS/Backpack',
    srcFolder: '/',
    tagExcludes: [],
  },
};

export default Config;
