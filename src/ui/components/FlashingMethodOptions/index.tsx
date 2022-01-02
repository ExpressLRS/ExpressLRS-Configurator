import {
  Box,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  Typography,
} from '@mui/material';
import React, { FunctionComponent, useCallback, useMemo } from 'react';
import {
  Device,
  FirmwareVersionDataInput,
  Target,
} from '../../gql/generated/types';
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
  firmwareVersionData: FirmwareVersionDataInput | null;
}

export const sortDeviceTargets = (targets: readonly Target[]): Target[] => {
  return targets
    .filter((item) => {
      return item.flashingMethod !== null;
    })
    .sort((a, b) => {
      if (a.flashingMethod && b.flashingMethod) {
        return a.flashingMethod < b.flashingMethod ? -1 : 1;
      }
      return 0;
    });
};

const FlashingMethodOptions: FunctionComponent<FlashingMethodsListProps> = (
  props
) => {
  const { onChange, currentTarget, currentDevice, firmwareVersionData } = props;
  const targetMappingsSorted = useMemo(
    () => sortDeviceTargets(currentDevice?.targets ?? []),
    [currentDevice?.targets]
  );

  const onFlashingMethodChange = (
    _event: React.ChangeEvent<HTMLInputElement>,
    value: string
  ) => {
    const target = targetMappingsSorted?.find((item) => {
      return item.id === value;
    });
    onChange(target ?? null);
  };

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
              firmwareVersionData={firmwareVersionData}
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
    [currentDevice?.wikiUrl, firmwareVersionData]
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
