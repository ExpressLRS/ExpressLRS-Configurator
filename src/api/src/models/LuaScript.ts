import { Field, ObjectType } from 'type-graphql';

@ObjectType('LuaScript')
export default class LuaScript {
  @Field(() => String, { nullable: true })
  fileLocation: string | null;

  constructor(fileLocation: string | null) {
    this.fileLocation = fileLocation;
  }
}
