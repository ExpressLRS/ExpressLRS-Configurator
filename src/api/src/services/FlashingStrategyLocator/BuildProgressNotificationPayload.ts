import BuildProgressNotificationType from '../../models/enum/BuildProgressNotificationType';
import BuildFirmwareStep from '../../models/enum/FirmwareBuildStep';

export interface BuildProgressNotificationPayload {
  type: BuildProgressNotificationType;
  step?: BuildFirmwareStep;
  message?: string;
}
