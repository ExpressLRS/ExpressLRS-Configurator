import { Box, Tooltip } from '@mui/material';
import React, { FunctionComponent, useEffect, useState } from 'react';
import QuestionIcon from '@mui/icons-material/Help';
import { SxProps, Theme } from '@mui/system';
import { useTranslation } from 'react-i18next';
import Omnibox, { Option } from '../Omnibox';
import {
  SerialPortInformation,
  useAvailableDevicesListQuery,
} from '../../gql/generated/types';
import Loader from '../Loader';
import ShowAlerts from '../ShowAlerts';

const styles: Record<string, SxProps<Theme>> = {
  root: {
    marginBottom: 2,
  },
  inner: {
    display: 'flex',
    alignItems: 'center',
  },

  icon: {
    verticalAlign: 'middle',
    marginLeft: 3,
    marginRight: 2,
    fontSize: '1.44em',
  },

  loader: {
    marginTop: 2,
    marginBottom: 2,
  },
};

interface SerialDeviceSelectProps {
  serialDevice: string | null;
  onChange: (serialDevice: string | null) => void;
}

const SerialDeviceSelect: FunctionComponent<SerialDeviceSelectProps> = (
  props
) => {
  const { serialDevice, onChange } = props;
  const { t } = useTranslation();

  const { loading, data, error, previousData, startPolling, stopPolling } =
    useAvailableDevicesListQuery();

  useEffect(() => {
    startPolling(1000);
    return () => {
      stopPolling();
    };
  }, [startPolling, stopPolling]);

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
    <Box sx={styles.root}>
      <Box sx={styles.inner}>
        <Omnibox
          title={t('SerialDeviceSelect.ManualSelection')}
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
              <p>{t('SerialDeviceSelect.ManualSelectionTitleTooltip')}</p>
            </div>
          }
        >
          <QuestionIcon sx={styles.icon} />
        </Tooltip>
      </Box>

      <Loader sx={styles.loader} loading={loading} />
      <ShowAlerts severity="error" messages={error} />
    </Box>
  );
};

export default SerialDeviceSelect;
