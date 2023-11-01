import { Field, InputType } from 'type-graphql';

@InputType('GitRepositoryInput')
export default class GitRepository {
  @Field(() => String)
  url: string;

  @Field(() => String)
  owner: string;

  @Field(() => String)
  repositoryName: string;

  @Field(() => String)
  rawRepoUrl: string;

  @Field(() => String)
  srcFolder: string;

  @Field(() => String, { nullable: true })
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
