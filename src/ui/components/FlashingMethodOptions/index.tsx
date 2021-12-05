import {
  Box,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  Typography,
} from '@mui/material';
import React, {
  FunctionComponent,
  useCallback,
  useEffect,
  useMemo,
} from 'react';
import { Device, Target } from '../../gql/generated/types';
import FlashingMethodDescription from '../FlashingMethodDescription';

const styles = {
  root: {
    marginTop: 2,
    marginBottom: 2,
  },
  flashingMethods: {
    marginTop: 1,
    paddingTop: 0,
    paddingRight: 0,
    paddingBottom: 0,
    paddingLeft: 1,
  },
  radioControl: {
    marginRight: 4,
  },
  radio: {
    marginRight: 1,
  },
  categoryTitle: {
    marginBottom: 1,
  },
};

interface FlashingMethodsListProps {
  currentTarget: Target | null;
  currentDevice: Device | null;
  onChange: (data: Target | null) => void;
}

const FlashingMethodOptions: FunctionComponent<FlashingMethodsListProps> = (
  props
) => {
  const { onChange, currentTarget, currentDevice } = props;

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
    (value: Target | null) => {
      onChange(value);
    },
    [onChange]
  );

  useEffect(() => {
    // if the currentTarget is not found, then select the first one by default
    if (
      targetMappingsSorted &&
      targetMappingsSorted.length > 0 &&
      !targetMappingsSorted.find((item) => item.id === currentTarget?.id)
    ) {
      const target = targetMappingsSorted[0];
      ChangeSelectedDeviceTarget(target);
    }
  }, [ChangeSelectedDeviceTarget, currentTarget, targetMappingsSorted]);

  const onFlashingMethodChange = useCallback(
    (_event: React.ChangeEvent<HTMLInputElement>, value: string) => {
      const target = targetMappingsSorted?.find((item) => {
        return item.id === value;
      });
      ChangeSelectedDeviceTarget(target ?? null);
    },
    [ChangeSelectedDeviceTarget, targetMappingsSorted]
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
          key={targetMapping.id}
          value={targetMapping.id}
          sx={styles.radioControl}
          control={<Radio sx={styles.radio} color="primary" />}
          label={label}
        />
      );
    },
    [currentDevice?.wikiUrl]
  );

  return (
    <Box sx={styles.root}>
      <Typography variant="h6" sx={styles.categoryTitle}>
        Flashing Method
      </Typography>
      <FormControl component="fieldset" sx={styles.flashingMethods}>
        <RadioGroup
          row
          value={currentTarget?.id ?? null}
          onChange={onFlashingMethodChange}
          defaultValue="top"
        >
          {targetMappingsSorted?.map((item) => {
            return flashingMethodRadioOption(item);
          })}
        </RadioGroup>
      </FormControl>
    </Box>
  );
};

export default FlashingMethodOptions;
