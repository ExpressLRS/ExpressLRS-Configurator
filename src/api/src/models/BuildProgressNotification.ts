import { Field, Float, ObjectType } from 'type-graphql';
import BuildFirmwareStep from './enum/FirmwareBuildStep';
import BuildFirmwareSubstep from './enum/BuildFirmwareSubstep';
import BuildProgressNotificationType from './enum/BuildProgressNotificationType';
import { BuildProgressNotificationPayload } from '../services/FlashingStrategyLocator/BuildProgressNotificationPayload';

@ObjectType('BuildProgressNotification')
export default class BuildProgressNotification
implements BuildProgressNotificationPayload {
  @Field(() => BuildProgressNotificationType)
  type: BuildProgressNotificationType;

  @Field(() => BuildFirmwareStep, { nullable: true })
  step?: BuildFirmwareStep;

  @Field(() => BuildFirmwareSubstep, { nullable: true })
  substep?: BuildFirmwareSubstep;

  @Field(() => Float, { nullable: true })
  progress?: number;

  constructor(
    type: BuildProgressNotificationType,
    step?: BuildFirmwareStep,
    substep?: BuildFirmwareSubstep,
    progress?: number,
  ) {
    this.type = type;
    this.step = step;
    this.substep = substep;
    this.progress = progress;
  }
}
