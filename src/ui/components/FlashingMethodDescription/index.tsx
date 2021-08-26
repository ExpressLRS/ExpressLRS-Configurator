import React, { FunctionComponent, memo } from 'react';
import { makeStyles, Tooltip } from '@material-ui/core';
import QuestionIcon from '@material-ui/icons/Help';
import { FlashingMethod } from '../DeviceTargetForm/FlashingMethod';

const useStyles = makeStyles(() => ({
  root: {
    display: 'inline-block',
  },
  tooltipRoot: {
    maxWidth: '400px',
  },
  tooltipRootBig: {
    maxWidth: '700px',
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
    marginLeft: '5px',
    fontSize: '1.44em',
  },
}));

interface FlashingMethodDescriptionProps {
  flashingMethod: FlashingMethod;
}

const FlashingMethodDescription: FunctionComponent<FlashingMethodDescriptionProps> = memo(
  ({ flashingMethod }) => {
    const styles = useStyles();
    const toText = (key: FlashingMethod) => {
      switch (key) {
        case FlashingMethod.BetaflightPassthrough:
          return (
            <div>
              <p>
                This method allows you to flash your receiver while it is
                connected to your flight controller by using the passthrough
                feature of the flight controller.
              </p>
              <ol>
                <li>
                  Plug in your FC to your computer, but do NOT connect to
                  betaflight configurator.
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
                  href="https://www.expresslrs.org/release/software/updating/betaflight-passthrough/"
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
                This method allows you to flash your receiver or transmitter via
                the Devices Firmware Upgrade mode.
              </p>
              <p>
                <a
                  target="_blank"
                  rel="noreferrer noreferrer"
                  href="https://www.expresslrs.org/release/quick-start/getting-started/"
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
                This method allows you to flash your receiver or transmitter
                using an STLink programmer connected to the device.
              </p>
              <p>
                <a
                  target="_blank"
                  rel="noreferrer noreferrer"
                  href="https://www.expresslrs.org/release/quick-start/getting-started/"
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
                This method allows you to flash your receiver or transmitter
                using the bootloader on the device.
              </p>
              <p>
                <a
                  target="_blank"
                  rel="noreferrer noreferrer"
                  href="https://www.expresslrs.org/release/quick-start/getting-started/"
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
                This method allows you to flash your receiver or transmitter via
                its USB port or wiring up an FTDI device.
              </p>
              <p>
                <a
                  target="_blank"
                  rel="noreferrer noreferrer"
                  href="https://www.expresslrs.org/release/quick-start/getting-started/"
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
                This method creates a firmware file you can upload to your
                receiver or transmitter by connecting to its built in wifi.
              </p>
              <p>
                <a
                  target="_blank"
                  rel="noreferrer noreferrer"
                  href="https://www.expresslrs.org/release/quick-start/getting-started/"
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
    const desc = toText(flashingMethod);
    return (
      <div className={styles.root}>
        {desc !== '' && (
          <Tooltip
            placement="top"
            arrow
            classes={{
              tooltip: styles.tooltipRoot,
            }}
            title={<div className={styles.tooltip}>{desc}</div>}
          >
            <QuestionIcon className={styles.icon} />
          </Tooltip>
        )}
      </div>
    );
  }
);

export default FlashingMethodDescription;
