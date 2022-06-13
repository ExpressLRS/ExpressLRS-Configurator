import React, { FunctionComponent } from 'react';
import { Box, Tooltip } from '@mui/material';
import QuestionIcon from '@mui/icons-material/Help';
import { SxProps, Theme } from '@mui/system';
import {
  FirmwareVersionDataInput,
  FlashingMethod,
} from '../../gql/generated/types';
import DocumentationLink from '../DocumentationLink';

const styles: Record<string, SxProps<Theme>> = {
  root: {
    display: 'inline-block',
  },
  icon: {
    verticalAlign: 'middle',
    marginLeft: '5px',
    fontSize: '1.44em',
  },
};

interface FlashingMethodDescriptionProps {
  flashingMethod: FlashingMethod;
  deviceWikiUrl: string | null;
  firmwareVersionData: FirmwareVersionDataInput | null;
}

const FlashingMethodDescription: FunctionComponent<
  FlashingMethodDescriptionProps
> = ({ flashingMethod, deviceWikiUrl, firmwareVersionData }) => {
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
              <DocumentationLink
                firmwareVersion={firmwareVersionData}
                url={
                  wikiUrl ??
                  'https://www.expresslrs.org/{version}/software/updating/betaflight-passthrough/'
                }
              >
                Check our Wiki page for latest definition.
              </DocumentationLink>
            </p>
          </div>
        );
      case FlashingMethod.Radio:
        return (
          <div>
            <p>
              This method allows you to build the firmware which can then be
              copied to your radio and flashed to the transmitter using
              EdgeTX/OpenTX
            </p>
            <ol>
              <li>Run Build</li>
              <li>
                Put the firmware on your radio&apos;s SD Card (recommended
                location is inside the /FIRMWARE folder)
              </li>
              <li>
                On your radio, navigate to where the firmware file was placed
                (/FIRMWARE), select the firmware file, click-hold the Enter
                button and select &quot;Flash External ELRS&quot;
              </li>
            </ol>
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
              <DocumentationLink
                firmwareVersion={firmwareVersionData}
                url={
                  wikiUrl ??
                  'https://www.expresslrs.org/{version}/quick-start/getting-started/'
                }
              >
                Check the Wiki page for your particular device for more
                information.
              </DocumentationLink>
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
              <DocumentationLink
                firmwareVersion={firmwareVersionData}
                url={
                  wikiUrl ??
                  'https://www.expresslrs.org/{version}/quick-start/getting-started/'
                }
              >
                Check the Wiki page for your particular device for more
                information.
              </DocumentationLink>
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
              <DocumentationLink
                firmwareVersion={firmwareVersionData}
                url={
                  wikiUrl ??
                  'https://www.expresslrs.org/{version}/quick-start/getting-started/'
                }
              >
                Check the Wiki page for your particular device for more
                information.
              </DocumentationLink>
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
              <DocumentationLink
                firmwareVersion={firmwareVersionData}
                url={
                  wikiUrl ??
                  'https://www.expresslrs.org/{version}/quick-start/getting-started/'
                }
              >
                Check the Wiki page for your particular device for more
                information.
              </DocumentationLink>
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
              <DocumentationLink
                firmwareVersion={firmwareVersionData}
                url={
                  wikiUrl ??
                  'https://www.expresslrs.org/{version}/quick-start/getting-started/'
                }
              >
                Check the Wiki page for your particular device for more
                information.
              </DocumentationLink>
            </p>
          </div>
        );
      case FlashingMethod.EdgeTxPassthrough:
        return (
          <div>
            <p>
              This method allows you to flash your transmitter module while it
              is connected to your transmitter by using the passthrough feature
              of the EdgeTX firmware.
            </p>
            <p>
              <DocumentationLink
                firmwareVersion={firmwareVersionData}
                url={
                  wikiUrl ??
                  'https://www.expresslrs.org/{version}/quick-start/getting-started/'
                }
              >
                Check the Wiki page for your particular device for more
                information.
              </DocumentationLink>
            </p>
          </div>
        );
      case FlashingMethod.Passthrough:
        return (
          <div>
            <p>
              This method allows you to flash your module while it is connected
              to your transmitter by using the passthrough feature.
            </p>
            <p>
              <DocumentationLink
                firmwareVersion={firmwareVersionData}
                url={
                  wikiUrl ??
                  'https://www.expresslrs.org/{version}/quick-start/getting-started/'
                }
              >
                Check the Wiki page for your particular device for more
                information.
              </DocumentationLink>
            </p>
          </div>
        );
      default:
        return '';
    }
  };
  const desc = toText(flashingMethod);
  return (
    <Box sx={styles.root}>
      {desc !== '' && (
        <Tooltip placement="top" arrow title={<div>{desc}</div>}>
          <QuestionIcon sx={styles.icon} />
        </Tooltip>
      )}
    </Box>
  );
};

export default FlashingMethodDescription;
