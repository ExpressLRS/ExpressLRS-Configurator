import BuildProgressNotificationType from '../../models/enum/BuildProgressNotificationType';
import BuildFirmwareStep from '../../models/enum/FirmwareBuildStep';
import BuildFirmwareSubstep from '../../models/enum/BuildFirmwareSubstep';

export interface BuildProgressNotificationPayload {
  type: BuildProgressNotificationType;
  step?: BuildFirmwareStep;
  substep?: BuildFirmwareSubstep;
  progress?: number;
}
