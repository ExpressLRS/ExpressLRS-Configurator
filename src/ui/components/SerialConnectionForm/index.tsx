import { Box, Button, Grid, TextField } from '@mui/material';
import React, { FunctionComponent, useEffect, useState } from 'react';
import Omnibox, { Option } from '../Omnibox';
import {
  SerialPortInformation,
  useAvailableDevicesListQuery,
} from '../../gql/generated/types';
import Loader from '../Loader';
import ShowAlerts from '../ShowAlerts';

const styles = {
  root: {
    marginY: 2,
  },
  loader: {
    marginY: 2,
  },
  button: {
    paddingY: '15px !important',
  },
};

interface SerialConnectionFormProps {
  serialDevice: string | null;
  baudRate: number;
  onConnect: (serialDevice: string | null, baudRate: number) => void;
}

const SerialConnectionForm: FunctionComponent<SerialConnectionFormProps> = (
  props
) => {
  const { onConnect, serialDevice, baudRate } = props;

  const { loading, data, error, previousData } = useAvailableDevicesListQuery({
    pollInterval: 1000,
  });
  const options: Option[] =
    data?.availableDevicesList?.map((target) => ({
      label: `${target.path} ${target.manufacturer}`,
      value: target.path,
    })) ?? [];

  const [currentBaud, setCurrentBaud] = useState<number>(baudRate);
  const [currentValue, setCurrentValue] = useState<Option | null>(
    serialDevice
      ? {
          label: serialDevice,
          value: serialDevice,
        }
      : null
  );
  const onSerialDeviceChange = (value: string | null) => {
    if (value === null) {
      setCurrentValue(null);
    } else {
      setCurrentValue({
        label: value,
        value,
      });
    }
  };
  const onBaudChange = (
    event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    if (event.target.validity.valid) {
      try {
        const value = parseInt(event.target.value, 10);
        setCurrentBaud(value);
      } catch (e) {
        console.error('failed to parse number', e);
      }
    } else {
      console.log('only numbers');
    }
  };
  useEffect(() => {
    const difference = (
      a: readonly Pick<SerialPortInformation, 'path' | 'manufacturer'>[],
      b: readonly Pick<SerialPortInformation, 'path' | 'manufacturer'>[]
    ): Pick<SerialPortInformation, 'path' | 'manufacturer'>[] => {
      return a.filter((item) => {
        return b.find((item2) => item2.path === item.path) === undefined;
      });
    };
    if (currentValue === null) {
      const added = difference(
        data?.availableDevicesList ?? [],
        previousData?.availableDevicesList ?? []
      );
      if (added.length > 0) {
        onSerialDeviceChange(added[0].path);
      }
    } else {
      const added = difference(
        data?.availableDevicesList ?? [],
        previousData?.availableDevicesList ?? []
      );
      if (added.length > 0) {
        onSerialDeviceChange(added[0].path);
        return;
      }
      const removed = difference(
        previousData?.availableDevicesList ?? [],
        data?.availableDevicesList ?? []
      );
      if (
        removed.find((item) => item.path === currentValue.value) !==
          undefined &&
        data?.availableDevicesList &&
        data?.availableDevicesList.length > 0
      ) {
        onSerialDeviceChange(data?.availableDevicesList[0].path);
      }
    }
  }, [data, previousData]);
  const onSubmit = () => {
    if (currentValue !== null) {
      onConnect(currentValue?.value, baudRate);
    }
  };
  return (
    <Box sx={styles.root}>
      <Grid container spacing={2}>
        <Grid item xs={3}>
          <Omnibox
            title="Serial device"
            currentValue={currentValue}
            onChange={onSerialDeviceChange}
            options={options}
            loading={loading}
          />
          <Loader sx={styles.loader} loading={loading} />
          <ShowAlerts severity="error" messages={error} />
        </Grid>
        <Grid item>
          <TextField
            size="medium"
            onBlur={onBaudChange}
            defaultValue={currentBaud}
            fullWidth
            inputProps={{
              min: 0,
              type: 'number',
              step: '1',
            }}
            label="Baud rate"
          />
        </Grid>
        <Grid item>
          <Button
            onClick={onSubmit}
            size="large"
            variant="contained"
            sx={styles.button}
          >
            Connect
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default SerialConnectionForm;
