import { Tooltip } from '@mui/material';
import { styled } from '@mui/material/styles';
import React, { FunctionComponent, useEffect, useState } from 'react';
import QuestionIcon from '@mui/icons-material/Help';
import Omnibox, { Option } from '../Omnibox';
import {
  SerialPortInformation,
  useAvailableDevicesListQuery,
} from '../../gql/generated/types';
import Loader from '../Loader';
import ShowAlerts from '../ShowAlerts';

const PREFIX = 'SerialDeviceSelect';

const classes = {
  root: `${PREFIX}-root`,
  inner: `${PREFIX}-inner`,
  icon: `${PREFIX}-icon`,
  loader: `${PREFIX}-loader`,
};

const Root = styled('div')(({ theme }) => ({
  [`&.${classes.root}`]: {
    marginBottom: theme.spacing(2),
  },

  [`& .${classes.inner}`]: {
    display: 'flex',
    alignItems: 'center',
  },

  [`& .${classes.icon}`]: {
    verticalAlign: 'middle',
    marginLeft: theme.spacing(3),
    marginRight: theme.spacing(2),
    fontSize: '1.44em',
  },

  [`& .${classes.loader}`]: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
}));

interface SerialDeviceSelectProps {
  serialDevice: string | null;
  onChange: (serialDevice: string | null) => void;
}

const SerialDeviceSelect: FunctionComponent<SerialDeviceSelectProps> = (
  props
) => {
  const { serialDevice, onChange } = props;

  const { loading, data, error, previousData } = useAvailableDevicesListQuery({
    pollInterval: 1000,
  });
  const options: Option[] =
    data?.availableDevicesList?.map((target) => ({
      label: `${target.path} ${target.manufacturer}`,
      value: target.path,
    })) ?? [];
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
      onChange(value);
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
    if (currentValue !== null) {
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
  return (
    <Root className={classes.root}>
      <div className={classes.inner}>
        <Omnibox
          title="Manual serial device selection"
          currentValue={currentValue}
          onChange={onSerialDeviceChange}
          options={options}
          loading={loading}
        />
        <Tooltip
          placement="top"
          arrow
          title={
            <div>
              <p>
                Use manual serial port selection if automatic selection fails to
                select a correct port. In the vast majority of cases there is no
                need to use this option.
              </p>
            </div>
          }
        >
          <QuestionIcon className={classes.icon} />
        </Tooltip>
      </div>

      <Loader className={classes.loader} loading={loading} />
      <ShowAlerts severity="error" messages={error} />
    </Root>
  );
};

export default SerialDeviceSelect;
