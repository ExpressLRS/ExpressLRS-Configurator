import {
  makeStyles,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  Typography,
} from '@material-ui/core';
import React, { FunctionComponent, useEffect, useState } from 'react';
import { Target } from '../../gql/generated/types';
import FlashingMethodDescription from '../FlashingMethodDescription';

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
  targetMappings: Target[];
  currentTarget: string | null;
  onChange: (data: string | null) => void;
}

const FlashingMethodOptions: FunctionComponent<FlashingMethodsListProps> = (
  props
) => {
  const { onChange, targetMappings, currentTarget } = props;

  const styles = useStyles();

  const [currentTargetValue, setCurrentTargetValue] = useState<string | null>(
    currentTarget
  );

  const [targetMappingsSorted, setTargetMappingsSorted] = useState<
    Target[] | null
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

  const ChangeSelectedDeviceTarget = (value: string | null) => {
    setCurrentTargetValue(value);
    onChange(value);
  };

  useEffect(() => {
    // if the currentTargetValue is not found, then select the first one by default
    if (
      targetMappingsSorted &&
      !targetMappingsSorted.find((item) => item.name === currentTargetValue) &&
      targetMappingsSorted.length > 0
    ) {
      const { name } = targetMappingsSorted[0];
      ChangeSelectedDeviceTarget(name);
    }
  }, [targetMappingsSorted, currentTargetValue]);

  const onFlashingMethodChange = (
    _event: React.ChangeEvent<HTMLInputElement>,
    value: string
  ) => {
    ChangeSelectedDeviceTarget(value);
  };

  const flashingMethodRadioOption = (targetMapping: Target) => {
    const label = (
      <>
        {!targetMapping.flashingMethod
          ? targetMapping.name
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
        key={targetMapping.name}
        value={targetMapping.name}
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
