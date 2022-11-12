import { Field, ObjectType } from 'type-graphql';
import BuildFirmwareErrorType from '../../models/enum/BuildFirmwareErrorType';

@ObjectType('BuildFlashFirmwareResult')
export default class BuildFlashFirmwareResult {
  @Field()
  success: boolean;

  @Field(() => BuildFirmwareErrorType, { nullable: true })
  errorType?: BuildFirmwareErrorType;

  @Field({ nullable: true })
  message?: string;

  @Field({ nullable: true })
  firmwareBinPath?: string;

  constructor(
    success: boolean,
    message?: string,
    errorType?: BuildFirmwareErrorType,
    firmwareBinPath?: string
  ) {
    this.success = success;
    this.errorType = errorType;
    this.message = message;
    this.firmwareBinPath = firmwareBinPath;
  }
}
