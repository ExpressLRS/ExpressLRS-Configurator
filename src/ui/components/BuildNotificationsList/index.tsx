import React, { FunctionComponent, memo } from 'react';
import { Alert } from '@mui/material';
import {
  BuildFirmwareStep,
  BuildProgressNotification,
  BuildProgressNotificationType,
} from '../../gql/generated/types';

const styles = {
  notification: {
    marginBottom: 1,
  },
};

interface BuildNotificationsListProps {
  notifications: BuildProgressNotification[];
}

const BuildNotificationsList: FunctionComponent<BuildNotificationsListProps> = memo(
  ({ notifications }) => {
    const toSeverity = (
      item: BuildProgressNotificationType
    ): 'error' | 'info' | 'success' => {
      switch (item) {
        case BuildProgressNotificationType.Error:
          return 'error';
        case BuildProgressNotificationType.Info:
          return 'info';
        case BuildProgressNotificationType.Success:
          return 'success';
        default:
          return 'info';
      }
    };
    // TODO: this should be used for translations
    const toText = (step: BuildFirmwareStep): string => {
      switch (step) {
        case BuildFirmwareStep.VERIFYING_BUILD_SYSTEM:
          return 'Verifying build system';
        case BuildFirmwareStep.DOWNLOADING_FIRMWARE:
          return 'Downloading firmware';
        case BuildFirmwareStep.BUILDING_USER_DEFINES:
          return 'Building user_defines.txt';
        case BuildFirmwareStep.BUILDING_FIRMWARE:
          return 'Compiling firmware';
        case BuildFirmwareStep.FLASHING_FIRMWARE:
          return 'Flashing device';
        default:
          return '';
      }
    };
    return (
      <>
        {notifications.map((item, idx) => {
          return (
            <React.Fragment key={`${idx}-${item.step}`}>
              <Alert sx={styles.notification} severity={toSeverity(item.type)}>
                {item?.step !== undefined &&
                  item.step !== null &&
                  toText(item.step)}
              </Alert>
            </React.Fragment>
          );
        })}
      </>
    );
  }
);

export default BuildNotificationsList;
