import React, { FunctionComponent, memo } from 'react';
import { Alert } from '@mui/material';
import { SxProps, Theme } from '@mui/system';
import { useTranslation } from 'react-i18next';
import {
  BuildFirmwareStep,
  BuildProgressNotification,
  BuildProgressNotificationType,
} from '../../gql/generated/types';

const styles: Record<string, SxProps<Theme>> = {
  notification: {
    marginBottom: 1,
  },
};

interface BuildNotificationsListProps {
  notifications: BuildProgressNotification[];
}

const BuildNotificationsList: FunctionComponent<BuildNotificationsListProps> =
  memo(({ notifications }) => {
    const { t } = useTranslation();

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
    const toText = (step: BuildFirmwareStep): string => {
      switch (step) {
        case BuildFirmwareStep.VERIFYING_BUILD_SYSTEM:
          return t('BuildNotificationsList.VerifyingBuildSystem');
        case BuildFirmwareStep.DOWNLOADING_FIRMWARE:
          return t('BuildNotificationsList.DownloadingFirmware');
        case BuildFirmwareStep.BUILDING_FIRMWARE:
          return t('BuildNotificationsList.CompilingFirmware');
        case BuildFirmwareStep.FLASHING_FIRMWARE:
          return t('BuildNotificationsList.FlashingDevice');
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
  });

export default BuildNotificationsList;
