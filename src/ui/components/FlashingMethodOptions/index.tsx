import {
  makeStyles,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  Typography,
} from '@material-ui/core';
import React, { FunctionComponent, useEffect, useState } from 'react';
import { DeviceTarget } from '../../gql/generated/types';
import FlashingMethodDescription from '../FlashingMethodDescription';
import { TargetInformation } from '../DeviceTargetForm/TargetInformation';

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  flashingMethods: {
    marginTop: theme.spacing(1),
    padding: theme.spacing(0, 0, 0, 1),
  },
  radioControl: {
    marginRight: `${theme.spacing(4)} !important`,
  },
  radio: {
    marginRight: `${theme.spacing(1)} !important`,
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
    marginLeft: ' 5px',
    fontSize: '1.44em',
  },
  categoryTitle: {
    marginBottom: theme.spacing(1),
  },
}));

interface FlashingMethodsListProps {
  targetMappings: TargetInformation[];
  currentTarget: DeviceTarget | null;
  onChange: (data: DeviceTarget | null) => void;
}

export type DeviceCategoryByDeviceTarget = {
  [key in DeviceTarget]: string;
};

const FlashingMethodOptions: FunctionComponent<FlashingMethodsListProps> = (
  props
) => {
  const { onChange, targetMappings, currentTarget } = props;

  const styles = useStyles();

  const [
    currentTargetValue,
    setCurrentTargetValue,
  ] = useState<DeviceTarget | null>(currentTarget);

  const [targetMappingsSorted, setTargetMappingsSorted] = useState<
    TargetInformation[] | null
  >();

  useEffect(() => {
    const value = targetMappings
      .filter((item) => {
        return item.flashingMethod !== null;
      })
      .sort((a, b) => {
        if (a.flashingMethod && b.flashingMethod) {
          return a.flashingMethod < b.flashingMethod ? -1 : 1;
        }
        return 0;
      });
    setTargetMappingsSorted(value);
  }, [targetMappings]);

  const ChangeSelectedDeviceTarget = (value: DeviceTarget | null) => {
    setCurrentTargetValue(value);
    onChange(value);
  };

  useEffect(() => {
    // if the currentTargetValue is not found, then select the first one by default
    if (
      targetMappingsSorted &&
      !targetMappingsSorted.find(
        (item) => item.target === currentTargetValue
      ) &&
      targetMappingsSorted.length > 0
    ) {
      const { target } = targetMappingsSorted[0];
      ChangeSelectedDeviceTarget(target);
    }
  }, [targetMappingsSorted, currentTargetValue]);

  const onFlashingMethodChange = (
    _event: React.ChangeEvent<HTMLInputElement>,
    value: string
  ) => {
    ChangeSelectedDeviceTarget(value as DeviceTarget);
  };

  const flashingMethodRadioOption = (targetMapping: TargetInformation) => {
    const label = (
      <>
        {!targetMapping.flashingMethod
          ? targetMapping.target
          : targetMapping.flashingMethod}
        {targetMapping.flashingMethod !== null && (
          <FlashingMethodDescription
            flashingMethod={targetMapping.flashingMethod}
          />
        )}
      </>
    );
    return (
      <FormControlLabel
        key={targetMapping.target}
        value={targetMapping.target}
        className={styles.radioControl}
        control={<Radio className={styles.radio} color="primary" />}
        label={label}
      />
    );
  };

  return (
    <div className={styles.root}>
      <Typography variant="h6" className={styles.categoryTitle}>
        Flashing Method
      </Typography>
      <FormControl component="fieldset" className={styles.flashingMethods}>
        <RadioGroup
          row
          value={currentTargetValue}
          onChange={onFlashingMethodChange}
          defaultValue="top"
        >
          {targetMappingsSorted?.map((item) => {
            return flashingMethodRadioOption(item);
          })}
        </RadioGroup>
      </FormControl>
    </div>
  );
};

export default FlashingMethodOptions;
