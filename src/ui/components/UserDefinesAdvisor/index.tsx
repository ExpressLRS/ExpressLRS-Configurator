import React, { FunctionComponent } from 'react';
import { styled } from '@mui/material/styles';
import { Alert } from '@mui/material';
import { DeviceOptionsFormData } from '../DeviceOptionsForm';
import { UserDefineKey, UserDefinesMode } from '../../gql/generated/types';

const PREFIX = 'UserDefinesAdvisor';

const classes = {
  container: `${PREFIX}-container`,
};

const Root = styled('div')(({ theme }) => ({
  [`& .${classes.container}`]: {
    marginBottom: theme.spacing(2),
  },
}));

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
      if (value?.enabled === enabledValue) {
        return true;
      }
      return false;
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
  }
  return (
    <Root>
      {messages.length > 0 && (
        <div className={classes.container}>
          {messages.map((message, idx) => (
            <Alert key={idx} severity="warning">
              {message}
            </Alert>
          ))}
        </div>
      )}
    </Root>
  );
};

export default UserDefinesAdvisor;
