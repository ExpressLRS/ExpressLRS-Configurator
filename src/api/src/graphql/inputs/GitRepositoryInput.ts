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

  @Field({ nullable: true })
  hardwareArtifactUrl: string | null;

  constructor(
    url: string,
    owner: string,
    repositoryName: string,
    rawRepoUrl: string,
    srcFolder: string,
    hardwareArtifactUrl: string | null
  ) {
    this.url = url;
    this.owner = owner;
    this.repositoryName = repositoryName;
    this.rawRepoUrl = rawRepoUrl;
    this.srcFolder = srcFolder;
    this.hardwareArtifactUrl = hardwareArtifactUrl;
  }
}
