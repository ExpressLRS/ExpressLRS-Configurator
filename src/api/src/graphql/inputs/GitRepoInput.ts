import { Field, InputType } from 'type-graphql';

@InputType('GitRepoInput')
export default class GitRepo {
  @Field()
  url: string;

  @Field()
  cloneUrl: string;

  @Field()
  owner: string;

  @Field()
  repositoryName: string;

  @Field()
  rawRepoUrl: string;

  @Field()
  srcFolder: string;

  constructor(
    url: string,
    cloneUrl: string,
    owner: string,
    repositoryName: string,
    rawRepoUrl: string,
    srcFolder: string
  ) {
    this.url = url;
    this.cloneUrl = cloneUrl;
    this.owner = owner;
    this.repositoryName = repositoryName;
    this.rawRepoUrl = rawRepoUrl;
    this.srcFolder = srcFolder;
  }
}
