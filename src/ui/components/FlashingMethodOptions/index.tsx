import {
  makeStyles,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  Typography,
} from '@material-ui/core';
import React, {
  FunctionComponent,
  useCallback,
  useEffect,
  useMemo,
} from 'react';
import { Device, Target } from '../../gql/generated/types';
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
  categoryTitle: {
    marginBottom: theme.spacing(1),
  },
}));

interface FlashingMethodsListProps {
  currentTarget: string | null;
  currentDevice: Device | null;
  onChange: (data: string | null) => void;
}

const FlashingMethodOptions: FunctionComponent<FlashingMethodsListProps> = (
  props
) => {
  const { onChange, currentTarget, currentDevice } = props;

  const styles = useStyles();

  const targetMappingsSorted = useMemo(
    () =>
      currentDevice?.targets
        ?.filter((item) => {
          return item.flashingMethod !== null;
        })
        .sort((a, b) => {
          if (a.flashingMethod && b.flashingMethod) {
            return a.flashingMethod < b.flashingMethod ? -1 : 1;
          }
          return 0;
        }),
    [currentDevice?.targets]
  );

  const ChangeSelectedDeviceTarget = useCallback(
    (value: string | null) => {
      onChange(value);
    },
    [onChange]
  );

  useEffect(() => {
    // if the currentTarget is not found, then select the first one by default
    if (
      targetMappingsSorted &&
      !targetMappingsSorted.find((item) => item.name === currentTarget) &&
      targetMappingsSorted.length > 0
    ) {
      const { name } = targetMappingsSorted[0];
      ChangeSelectedDeviceTarget(name);
    }
  }, [ChangeSelectedDeviceTarget, currentTarget, targetMappingsSorted]);

  const onFlashingMethodChange = useCallback(
    (_event: React.ChangeEvent<HTMLInputElement>, value: string) => {
      ChangeSelectedDeviceTarget(value);
    },
    [ChangeSelectedDeviceTarget]
  );

  const flashingMethodRadioOption = useCallback(
    (targetMapping: Target) => {
      const label = (
        <>
          {!targetMapping.flashingMethod
            ? targetMapping.name
            : targetMapping.flashingMethod}
          {targetMapping.flashingMethod !== null && (
            <FlashingMethodDescription
              flashingMethod={targetMapping.flashingMethod}
              deviceWikiUrl={currentDevice?.wikiUrl ?? null}
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
    },
    [currentDevice?.wikiUrl, styles.radio, styles.radioControl]
  );

  return (
    <div className={styles.root}>
      <Typography variant="h6" className={styles.categoryTitle}>
        Flashing Method
      </Typography>
      <FormControl component="fieldset" className={styles.flashingMethods}>
        <RadioGroup
          row
          value={currentTarget}
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
