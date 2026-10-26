import { Field, ObjectType } from 'type-graphql';

@ObjectType('LuaScript')
export default class LuaScript {
  @Field(() => String, { nullable: true })
  version: string | null;

  @Field(() => String, { nullable: true })
  fileLocation: string | null;

  @Field(() => String)
  legacyFileLocation: string;

  @Field(() => Boolean)
  firmwareSupported: boolean;

  constructor(
    version: string | null,
    fileLocation: string | null,
    legacyFileLocation: string,
    firmwareSupported: boolean,
  ) {
    this.version = version;
    this.fileLocation = fileLocation;
    this.legacyFileLocation = legacyFileLocation;
    this.firmwareSupported = firmwareSupported;
  }
}
