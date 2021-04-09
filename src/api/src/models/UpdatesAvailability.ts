import { Field, ObjectType } from 'type-graphql';

@ObjectType('UpdatesAvailability')
export default class UpdatesAvailability {
  @Field()
  updateAvailable: boolean;

  @Field()
  newestVersion: string;

  @Field()
  releaseUrl: string;

  constructor(updateAvailable: boolean, newestVersion = '', releaseUrl = '') {
    this.updateAvailable = updateAvailable;
    this.newestVersion = newestVersion;
    this.releaseUrl = releaseUrl;
  }
}
