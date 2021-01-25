interface GitRepo {
  url: string;
  cloneUrl: string;
  owner: string;
  repositoryName: string;
}

interface IConfig {
  git: GitRepo;
}

export const Config: IConfig = {
  git: {
    cloneUrl: 'https://github.com/AlessandroAU/ExpressLRS',
    url: 'https://github.com/AlessandroAU/ExpressLRS',
    owner: 'AlessandroAU',
    repositoryName: 'ExpressLRS',
  },
};

export default Config;
