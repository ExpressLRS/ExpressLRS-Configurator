import { Field, ObjectType } from 'type-graphql';

@ObjectType('UpdatesAvailability')
export default class UpdatesAvailability {
  @Field(() => Boolean)
  updateAvailable: boolean;

  @Field(() => String)
  newestVersion: string;

  @Field(() => String)
  releaseUrl: string;

  constructor(updateAvailable: boolean, newestVersion = '', releaseUrl = '') {
    this.updateAvailable = updateAvailable;
    this.newestVersion = newestVersion;
    this.releaseUrl = releaseUrl;
  }
}
