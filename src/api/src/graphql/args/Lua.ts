import { ArgsType, Field } from 'type-graphql';
import FirmwareSource from '../../models/enum/FirmwareSource';

@ArgsType()
export default class LuaArgs {
  @Field(() => FirmwareSource)
  source: FirmwareSource;

  @Field(() => String)
  gitTag: string;

  constructor() {
    this.source = FirmwareSource.GitBranch;
    this.gitTag = '';
  }
}
