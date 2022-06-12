import React, { FunctionComponent } from 'react';
import { Alert, Box } from '@mui/material';
import { SxProps, Theme } from '@mui/system';
import { DeviceOptionsFormData } from '../DeviceOptionsForm';
import { UserDefineKey, UserDefinesMode } from '../../gql/generated/types';

const styles: Record<string, SxProps<Theme>> = {
  container: {
    marginBottom: 2,
  },
};

interface UserDefinesAdvisorProps {
  deviceOptionsFormData: DeviceOptionsFormData;
}

const UserDefinesAdvisor: FunctionComponent<UserDefinesAdvisorProps> = ({
  deviceOptionsFormData,
}) => {
  const messages: string[] = [];
  if (deviceOptionsFormData.userDefinesMode === UserDefinesMode.UserInterface) {
    const isUserDefine = (
      key: UserDefineKey,
      enabledValue: boolean
    ): boolean => {
      const value = deviceOptionsFormData.userDefineOptions.find(
        (item) => item.key === key
      );
      if (value === undefined) {
        return false;
      }
      return value?.enabled === enabledValue;
    };

    if (isUserDefine(UserDefineKey.UART_INVERTED, false)) {
      messages.push(
        'Disabling UART_INVERTED is uncommon. Please make sure that your transmitter supports that.'
      );
    }

    if (isUserDefine(UserDefineKey.FEATURE_OPENTX_SYNC, false)) {
      messages.push(
        'Disabling FEATURE_OPENTX_SYNC is uncommon. Keeping it disabled will prevent the ExpressLRS LUA script from communicating with the TX module properly.'
      );
    }

    if (isUserDefine(UserDefineKey.NO_SYNC_ON_ARM, true)) {
      messages.push(
        'NO_SYNC_ON_ARM is an advanced performance option. Make sure to read the documentation on how it works.'
      );
    }

    if (isUserDefine(UserDefineKey.USE_DIVERSITY, true)) {
      messages.push(
        `USE_DIVERSITY requires hardware support. Make sure to attach both antennas to your device. Safe to leave on
        for hardware that does not have diversity except DIY builds, which did not populate the RF switch.`
      );
    }
  }
  return (
    <>
      {messages.length > 0 && (
        <Box sx={styles.container}>
          {messages.map((message, idx) => (
            <Alert key={idx} severity="warning">
              {message}
            </Alert>
          ))}
        </Box>
      )}
    </>
  );
};

export default UserDefinesAdvisor;
