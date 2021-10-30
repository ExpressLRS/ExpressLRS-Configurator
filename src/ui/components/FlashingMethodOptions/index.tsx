import {
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  Typography,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import React, {
  FunctionComponent,
  useCallback,
  useEffect,
  useMemo,
} from 'react';
import { Device, Target } from '../../gql/generated/types';
import FlashingMethodDescription from '../FlashingMethodDescription';

const PREFIX = 'FlashingMethodOptions';

const classes = {
  root: `${PREFIX}-root`,
  flashingMethods: `${PREFIX}-flashingMethods`,
  radioControl: `${PREFIX}-radioControl`,
  radio: `${PREFIX}-radio`,
  categoryTitle: `${PREFIX}-categoryTitle`,
};

const Root = styled('div')(({ theme }) => ({
  [`&.${classes.root}`]: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },

  [`& .${classes.flashingMethods}`]: {
    marginTop: theme.spacing(1),
    padding: theme.spacing(0, 0, 0, 1),
  },

  [`& .${classes.radioControl}`]: {
    marginRight: `${theme.spacing(4)} !important`,
  },

  [`& .${classes.radio}`]: {
    marginRight: `${theme.spacing(1)} !important`,
  },

  [`& .${classes.categoryTitle}`]: {
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
          className={classes.radioControl}
          control={<Radio className={classes.radio} color="primary" />}
          label={label}
        />
      );
    },
    [currentDevice?.wikiUrl, classes.radio, classes.radioControl]
  );

  return (
    <Root className={classes.root}>
      <Typography variant="h6" className={classes.categoryTitle}>
        Flashing Method
      </Typography>
      <FormControl component="fieldset" className={classes.flashingMethods}>
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
    </Root>
  );
};

export default FlashingMethodOptions;
