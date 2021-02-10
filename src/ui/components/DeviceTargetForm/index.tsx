import { makeStyles } from '@material-ui/core';
import React, { FunctionComponent, useState } from 'react';
import Omnibox, { Option } from '../Omnibox';
import {
  DeviceTarget,
  useAvailableFirmwareTargetsQuery,
} from '../../gql/generated/types';
import Loader from '../Loader';

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  loader: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
}));

interface FirmwareVersionCardProps {
  currentTarget: DeviceTarget | null;
  onChange: (data: DeviceTarget) => void;
}

const DeviceTargetForm: FunctionComponent<FirmwareVersionCardProps> = (
  props
) => {
  const { onChange, currentTarget } = props;
  const styles = useStyles();

  const { loading, data } = useAvailableFirmwareTargetsQuery();
  const options: Option[] =
    data?.availableFirmwareTargets?.map((target) => ({
      label: target,
      value: target,
    })) ?? [];

  const [currentValue, setCurrentValue] = useState<Option | null>(
    currentTarget
      ? {
          label: currentTarget,
          value: currentTarget,
        }
      : null
  );
  const onDeviceChange = (value: string | null) => {
    if (value === null) {
      setCurrentValue(null);
    } else {
      setCurrentValue({
        label: value,
        value,
      });
    }
    onChange(value as DeviceTarget);
  };
  return (
    <div className={styles.root}>
      <Omnibox
        title="Device target"
        currentValue={currentValue}
        onChange={onDeviceChange}
        options={options}
        loading={loading}
      />
      <Loader className={styles.loader} loading={loading} />
    </div>
  );
};

export default DeviceTargetForm;
