import React, { FunctionComponent } from 'react';
import { Alert, makeStyles } from '@material-ui/core';
import { DeviceOptionsFormData } from '../DeviceOptionsForm';
import { UserDefineKey, UserDefinesMode } from '../../gql/generated/types';

interface UserDefinesAdvisorProps {
  deviceOptionsFormData: DeviceOptionsFormData;
}

const useStyles = makeStyles((theme) => ({
  container: {
    marginBottom: theme.spacing(2),
  },
}));

const UserDefinesAdvisor: FunctionComponent<UserDefinesAdvisorProps> = ({
  deviceOptionsFormData,
}) => {
  const styles = useStyles();
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
    <div>
      {messages.length > 0 && (
        <div className={styles.container}>
          {messages.map((message, idx) => (
            <Alert key={idx} severity="warning">
              {message}
            </Alert>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserDefinesAdvisor;
