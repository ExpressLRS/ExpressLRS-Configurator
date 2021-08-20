import {
  makeStyles,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  Tooltip,
  Typography,
} from '@material-ui/core';
import React, { FunctionComponent, useState } from 'react';
import QuestionIcon from '@material-ui/icons/Help';
import { DeviceTarget } from '../../gql/generated/types';
// eslint-disable-next-line import/no-cycle
import { FlashingMethod, TargetInformation } from '../DeviceTargetForm';

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

const FlashingMethodTooltip = (flashingMethod: FlashingMethod | null) => {
  switch (flashingMethod) {
    case FlashingMethod.BetaflightPassthrough:
      return (
        <div>
          <p>
            This method allows you to flash your receiver while it is connected
            to your flight controller by using the passthrough feature of the
            flight controller.
          </p>
          <ol>
            <li>
              Plug in your FC to your computer, but do NOT connect to betaflight
              configurator.
            </li>
            <li>
              Select your desired Device Options and your flight controllers
              serial device below.
            </li>
            <li>Run Build & Flash</li>
          </ol>
          <p>
            <a
              target="_blank"
              rel="noreferrer noreferrer"
              href="https://www.expresslrs.org/software/updating/betaflight-passthrough/"
            >
              Check our Wiki page for information.
            </a>
          </p>
        </div>
      );
    case FlashingMethod.DFU:
      return (
        <div>
          <p>
            This method allows you to flash your receiver or transmitter via the
            Devices Firmware Upgrade mode.
          </p>
          <p>
            <a
              target="_blank"
              rel="noreferrer noreferrer"
              href="https://www.expresslrs.org/quick-start/getting-started/"
            >
              Check the Wiki page for your particular device for more
              information.
            </a>
          </p>
        </div>
      );
    case FlashingMethod.STLink:
      return (
        <div>
          <p>
            This method allows you to flash your receiver or transmitter using
            an STLink programmer connected to the device.
          </p>
          <p>
            <a
              target="_blank"
              rel="noreferrer noreferrer"
              href="https://www.expresslrs.org/quick-start/getting-started/"
            >
              Check the Wiki page for your particular device for more
              information.
            </a>
          </p>
        </div>
      );
    case FlashingMethod.Stock_BL:
      return (
        <div>
          <p>
            This method allows you to flash your receiver or transmitter using
            the bootloader on the device.
          </p>
          <p>
            <a
              target="_blank"
              rel="noreferrer noreferrer"
              href="https://www.expresslrs.org/quick-start/getting-started/"
            >
              Check the Wiki page for your particular device for more
              information.
            </a>
          </p>
        </div>
      );
    case FlashingMethod.UART:
      return (
        <div>
          <p>
            This method allows you to flash your receiver or transmitter via its
            USB port or wiring up an FTDI device.
          </p>
          <p>
            <a
              target="_blank"
              rel="noreferrer noreferrer"
              href="https://www.expresslrs.org/quick-start/getting-started/"
            >
              Check the Wiki page for your particular device for more
              information.
            </a>
          </p>
        </div>
      );
    case FlashingMethod.WIFI:
      return (
        <div>
          <p>
            This method creates a firmware file you can upload to your receiver
            or transmitter by connecting to its built in wifi.
          </p>
          <p>
            <a
              target="_blank"
              rel="noreferrer noreferrer"
              href="https://www.expresslrs.org/quick-start/getting-started/"
            >
              Check the Wiki page for your particular device for more
              information.
            </a>
          </p>
        </div>
      );
    default:
      return '';
  }
};

const FlashingMethodsList: FunctionComponent<FlashingMethodsListProps> = (
  props
) => {
  const { onChange, targetMappings, currentTarget } = props;

  const styles = useStyles();

  const [
    currentTargetValue,
    setCurrentTargetValue,
  ] = useState<DeviceTarget | null>(currentTarget);

  const onFlashingMethodChange = (
    _event: React.ChangeEvent<HTMLInputElement>,
    value: string
  ) => {
    setCurrentTargetValue(value as DeviceTarget);
    onChange(value as DeviceTarget);
  };

  const flashingMethodRadioOption = (targetMapping: TargetInformation) => {
    const tooltip = FlashingMethodTooltip(targetMapping.flashingMethod);
    const label = (
      <>
        {!targetMapping.flashingMethod
          ? targetMapping.target
          : targetMapping.flashingMethod}
        {tooltip && (
          <Tooltip
            placement="top"
            arrow
            classes={{
              tooltip: styles.tooltipRoot,
            }}
            title={<div className={styles.tooltip}>{tooltip}</div>}
          >
            <QuestionIcon className={styles.icon} />
          </Tooltip>
        )}
      </>
    );
    return (
      <>
        <FormControlLabel
          key={targetMapping.target}
          value={targetMapping.target}
          className={styles.radioControl}
          control={<Radio className={styles.radio} color="primary" />}
          label={label}
        />
      </>
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
          {targetMappings
            .filter((item) => {
              return item.flashingMethod !== null;
            })
            .sort((a, b) => {
              if (a.flashingMethod && b.flashingMethod) {
                return a.flashingMethod < b.flashingMethod ? -1 : 1;
              }
              return 0;
            })
            .map((item) => {
              return flashingMethodRadioOption(item);
            })}
        </RadioGroup>
      </FormControl>
    </div>
  );
};

export default FlashingMethodsList;
