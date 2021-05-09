import { makeStyles, Tooltip } from '@material-ui/core';
import React, { FunctionComponent, useEffect, useState } from 'react';
import QuestionIcon from '@material-ui/icons/Help';
import Omnibox, { Option } from '../Omnibox';
import {
  SerialPortInformation,
  useAvailableDevicesListQuery,
} from '../../gql/generated/types';
import Loader from '../Loader';
import ShowAlerts from '../ShowAlerts';

const useStyles = makeStyles((theme) => ({
  root: {
    marginBottom: theme.spacing(2),
  },
  inner: {
    display: 'flex',
    alignItems: 'center',
  },
  tooltipRoot: {
    maxWidth: '400px',
  },
  tooltip: {
    paddingLeft: '1em',
    paddingRight: '1em',
    fontSize: '1.4em !important',
    '& a': {
      color: '#90caf9',
    },
  },
  icon: {
    verticalAlign: 'middle',
    marginLeft: theme.spacing(3),
    marginRight: theme.spacing(2),
    fontSize: '1.44em',
  },
  loader: {
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
  const styles = useStyles();

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
    <div className={styles.root}>
      <div className={styles.inner}>
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
          classes={{
            tooltip: styles.tooltipRoot,
          }}
          title={
            <div className={styles.tooltip}>
              <p>
                Use manual serial port selection if automatic selection fails to
                select a correct port. In the vast majority of cases there is no
                need to use this option.
              </p>
            </div>
          }
        >
          <QuestionIcon className={styles.icon} />
        </Tooltip>
      </div>

      <Loader className={styles.loader} loading={loading} />
      <ShowAlerts severity="error" messages={error} />
    </div>
  );
};

export default SerialDeviceSelect;
