import React, { FunctionComponent } from 'react';
import { Alert, Box } from '@mui/material';
import { SxProps, Theme } from '@mui/system';
import { useTranslation } from 'react-i18next';
import { DeviceOptionsFormData } from '../DeviceOptionsForm';
import { UserDefineKey } from '../../gql/generated/types';

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
  const { t } = useTranslation();
  const messages: string[] = [];

  const isUserDefine = (key: UserDefineKey, enabledValue: boolean): boolean => {
    const value = deviceOptionsFormData.userDefineOptions.find(
      (item) => item.key === key
    );
    if (value === undefined) {
      return false;
    }
    return value?.enabled === enabledValue;
  };

  if (isUserDefine(UserDefineKey.UART_INVERTED, false)) {
    messages.push(t('UserDefinesAdvisor.DisableUARTInvertedWarning'));
  }
  return messages.length > 0 ? (
    <Box sx={styles.container}>
      {messages.map((message, idx) => (
        <Alert key={idx} severity="warning">
          {message}
        </Alert>
      ))}
    </Box>
  ) : null;
};

export default UserDefinesAdvisor;
