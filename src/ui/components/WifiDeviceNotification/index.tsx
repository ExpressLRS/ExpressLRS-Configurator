import { Alert, Button, Snackbar } from '@material-ui/core';
import React, { FunctionComponent } from 'react';
import { MulticastDnsInformation } from '../../gql/generated/types';

interface WifiDeviceNotificationProps {
  newNetworkDevices: MulticastDnsInformation[];
  removeDeviceFromNewList: (deviceName: string) => void;
  onDeviceChange: (dnsDevice: MulticastDnsInformation) => void;
}

const WifiDeviceNotification: FunctionComponent<WifiDeviceNotificationProps> = (
  props
) => {
  const { newNetworkDevices, removeDeviceFromNewList, onDeviceChange } = props;

  return (
    <>
      {newNetworkDevices.map((dnsDevice) => {
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
      })}
    </>
  );
};

export default WifiDeviceNotification;
