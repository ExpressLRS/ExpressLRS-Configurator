import { Field, ObjectType } from 'type-graphql';
import BuildFirmwareStep from './enum/FirmwareBuildStep';
import BuildProgressNotificationType from './enum/BuildProgressNotificationType';
import { BuildProgressNotificationPayload } from '../services/Firmware';

@ObjectType('BuildProgressNotification')
export default class BuildProgressNotification
  implements BuildProgressNotificationPayload {
  @Field(() => BuildProgressNotificationType)
  type: BuildProgressNotificationType;

  @Field(() => BuildFirmwareStep, { nullable: true })
  step?: BuildFirmwareStep;

  @Field({ nullable: true })
  message?: string;

  constructor(
    type: BuildProgressNotificationType,
    step?: BuildFirmwareStep,
    message?: string
  ) {
    this.type = type;
    this.step = step;
    this.message = message;
  }
}
