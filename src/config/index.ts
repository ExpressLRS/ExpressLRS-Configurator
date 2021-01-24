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
    url: 'https://github.com/AlessandroAU/ExpressLRS',
    owner: 'AlessandroAU',
    repositoryName: 'ExpressLRS',
  }
};
