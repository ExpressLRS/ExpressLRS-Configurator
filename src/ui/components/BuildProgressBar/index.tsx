import React, { FunctionComponent } from 'react';
import { LinearProgress, makeStyles } from '@material-ui/core';
import {
  BuildFirmWareProgressNotificationData,
  BuildFirmwareStep,
  JobType,
} from '../../../main/handlers/BuildFirmwareHandler';

const useStyles = makeStyles((theme) => ({
  root: {
    height: 12,
    marginTop: `${theme.spacing(1)} !important`,
    marginBottom: `${theme.spacing(2)} !important`,
  },
}));

interface BuildProgressBarProps {
  inProgress: boolean;
  progressNotification: BuildFirmWareProgressNotificationData | null;
}

const BuildProgressBar: FunctionComponent<BuildProgressBarProps> = ({
  inProgress,
  progressNotification,
}) => {
  const styles = useStyles();
  const toProgressValue = (
    notification: BuildFirmWareProgressNotificationData | null
  ): number => {
    if (notification === null) {
      return 0;
    }
    if (!inProgress) {
      return 100;
    }
    switch (notification.jobType) {
      case JobType.Build:
        switch (notification.step) {
          case BuildFirmwareStep.VERIFYING_BUILD_SYSTEM:
            return 10;
          case BuildFirmwareStep.DOWNLOADING_FIRMWARE:
            return 35;
          case BuildFirmwareStep.BUILDING_USER_DEFINES:
            return 37;
          case BuildFirmwareStep.BUILDING_FIRMWARE:
            return 77;
          default:
        }
        break;
      case JobType.BuildAndFlash:
        switch (notification.step) {
          case BuildFirmwareStep.VERIFYING_BUILD_SYSTEM:
            return 5;
          case BuildFirmwareStep.DOWNLOADING_FIRMWARE:
            return 15;
          case BuildFirmwareStep.BUILDING_USER_DEFINES:
            return 28;
          case BuildFirmwareStep.BUILDING_FIRMWARE:
            return 56;
          case BuildFirmwareStep.FLASHING_FIRMWARE:
            return 89;
          default:
        }
        break;
      default:
        throw new Error(`unhandled job type: ${notification.jobType}`);
    }

    return 100;
  };
  return (
    <LinearProgress
      className={styles.root}
      variant="determinate"
      value={toProgressValue(progressNotification)}
    />
  );
};

export default BuildProgressBar;
