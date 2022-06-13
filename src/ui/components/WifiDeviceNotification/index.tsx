import { Alert, Button, Snackbar } from '@mui/material';
import React, { FunctionComponent } from 'react';
import { MulticastDnsInformation } from '../../gql/generated/types';
import useAppState from '../../hooks/useAppState';
import AppStatus from '../../models/enum/AppStatus';

interface WifiDeviceNotificationProps {
  newNetworkDevices: MulticastDnsInformation[];
  removeDeviceFromNewList: (deviceName: string) => void;
  onDeviceChange: (dnsDevice: MulticastDnsInformation) => void;
}

const WifiDeviceNotification: FunctionComponent<WifiDeviceNotificationProps> = (
  props
) => {
  const { newNetworkDevices, removeDeviceFromNewList, onDeviceChange } = props;
  const { appStatus } = useAppState();

  return appStatus === AppStatus.Interactive
    ? newNetworkDevices.map((dnsDevice) => {
        const handleClose = () => {
          removeDeviceFromNewList(dnsDevice.name);
        };

        return (
          <Snackbar
            key={dnsDevice.name}
            open
            autoHideDuration={6000}
            onClose={handleClose}
          >
            <Alert onClose={handleClose} severity="info">
              New Device {dnsDevice.name} ({dnsDevice.ip})
              <Button
                size="small"
                onClick={() => {
                  onDeviceChange(dnsDevice);
                  removeDeviceFromNewList(dnsDevice.name);
                }}
              >
                Select
              </Button>
            </Alert>
          </Snackbar>
        );
      })
    : null;
};

export default WifiDeviceNotification;
