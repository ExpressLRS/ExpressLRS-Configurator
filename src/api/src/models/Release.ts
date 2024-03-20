import { Field, ObjectType } from 'type-graphql';

@ObjectType('Release')
export default class Release {
  @Field(() => String)
  tagName: string;

  @Field(() => Boolean)
  preRelease: boolean;

  constructor(tagName: string, preRelease = false) {
    this.tagName = tagName;
    this.preRelease = preRelease;
  }
}
