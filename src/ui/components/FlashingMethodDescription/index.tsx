import React, { FunctionComponent, memo } from 'react';
import { styled } from '@mui/material/styles';
import { Tooltip } from '@mui/material';
import QuestionIcon from '@mui/icons-material/Help';
import { FlashingMethod } from '../../gql/generated/types';

const PREFIX = 'FlashingMethodDescription';

const classes = {
  root: `${PREFIX}-root`,
  icon: `${PREFIX}-icon`,
};

const Root = styled('div')(() => ({
  [`&.${classes.root}`]: {
    display: 'inline-block',
  },

  [`& .${classes.icon}`]: {
    verticalAlign: 'middle',
    marginLeft: '5px',
    fontSize: '1.44em',
  },
}));

interface FlashingMethodDescriptionProps {
  flashingMethod: FlashingMethod;
  deviceWikiUrl: string | null;
}

const FlashingMethodDescription: FunctionComponent<FlashingMethodDescriptionProps> = memo(
  ({ flashingMethod, deviceWikiUrl }) => {
    const wikiUrl = (deviceWikiUrl ?? '').length > 0 ? deviceWikiUrl : null;
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
                  href={
                    wikiUrl ??
                    'https://www.expresslrs.org/release/software/updating/betaflight-passthrough/'
                  }
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
                  href={
                    wikiUrl ??
                    'https://www.expresslrs.org/release/quick-start/getting-started/'
                  }
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
                  href={
                    wikiUrl ??
                    'https://www.expresslrs.org/release/quick-start/getting-started/'
                  }
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
                  href={
                    wikiUrl ??
                    'https://www.expresslrs.org/release/quick-start/getting-started/'
                  }
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
                  href={
                    wikiUrl ??
                    'https://www.expresslrs.org/release/quick-start/getting-started/'
                  }
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
                  href={
                    wikiUrl ??
                    'https://www.expresslrs.org/release/quick-start/getting-started/'
                  }
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
      <Root className={classes.root}>
        {desc !== '' && (
          <Tooltip placement="top" arrow title={<div>{desc}</div>}>
            <QuestionIcon className={classes.icon} />
          </Tooltip>
        )}
      </Root>
    );
  }
);

export default FlashingMethodDescription;
