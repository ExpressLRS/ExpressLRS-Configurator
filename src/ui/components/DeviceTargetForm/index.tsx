import {
  makeStyles,
} from '@material-ui/core';
import React, {FunctionComponent, useState} from 'react';
import Omnibox, {Option} from '../Omnibox';
import {DeviceTarget} from '../../../library/FirmwareBuilder/Enum/DeviceTarget';

const useStyles = makeStyles(theme => ({
  root: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
}));

interface FirmwareVersionCardProps {
  currentTarget: DeviceTarget | null;
  onChange: (data: DeviceTarget) => void;
}

export const DeviceTargetForm: FunctionComponent<FirmwareVersionCardProps> = (props) => {
  const {
    onChange,
    currentTarget,
  } = props;
  const styles = useStyles();
  const options: Option[] = Object.keys(DeviceTarget).map((target) => ({
    label: target,
    value: target,
  }));

  const [currentValue, setCurrentValue] = useState<Option | null>(currentTarget ? {
    label: currentTarget,
    value: currentTarget,
  } : null);
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
      <Omnibox title="Device target" currentValue={currentValue} onChange={onDeviceChange} options={options}/>
    </div>
  );
};

export default DeviceTargetForm;
