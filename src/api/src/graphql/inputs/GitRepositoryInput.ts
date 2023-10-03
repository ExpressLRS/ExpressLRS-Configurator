import { Field, InputType } from 'type-graphql';

@InputType('GitRepositoryInput')
export default class GitRepository {
  @Field()
  url: string;

  @Field()
  owner: string;

  @Field()
  repositoryName: string;

  @Field()
  rawRepoUrl: string;

  @Field()
  srcFolder: string;

  @Field()
  targetsRepoUrl: string;

  @Field()
  targetsRepoSrcFolder: string;

  constructor(
    url: string,
    owner: string,
    repositoryName: string,
    rawRepoUrl: string,
    srcFolder: string,
    targetsRepoUrl: string,
    targetsRepoSrcFolder: string
  ) {
    this.url = url;
    this.owner = owner;
    this.repositoryName = repositoryName;
    this.rawRepoUrl = rawRepoUrl;
    this.srcFolder = srcFolder;
    this.targetsRepoUrl = targetsRepoUrl;
    this.targetsRepoSrcFolder = targetsRepoSrcFolder;
  }
}
