export default interface GitRepository {
  url: string;

  cloneUrl: string;

  owner: string;

  repositoryName: string;

  rawRepoUrl: string;

  srcFolder: string;

  tagExcludes: string[];

  hardwareArtifactUrl: string | null;
}
