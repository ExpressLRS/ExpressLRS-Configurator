import React, { FunctionComponent, memo } from 'react';
import { Box, Tooltip } from '@mui/material';
import QuestionIcon from '@mui/icons-material/Help';
import semver from 'semver';
import {
  FirmwareSource,
  FirmwareVersionDataInput,
  FlashingMethod,
} from '../../gql/generated/types';

const styles = {
  root: {
    display: 'inline-block',
  },
  icon: {
    verticalAlign: 'middle',
    marginLeft: '5px',
    fontSize: '1.44em',
  },
};

const urlVersioning = (
  firmwareVersionData: FirmwareVersionDataInput | null,
  url: string
): string => {
  if (
    firmwareVersionData &&
    firmwareVersionData.source === FirmwareSource.GitTag &&
    firmwareVersionData.gitTag &&
    semver.major(firmwareVersionData.gitTag) > 0
  ) {
    const majorVersion = semver.major(firmwareVersionData.gitTag);
    return url.replace('{version}', `${majorVersion}.0`);
  }
  return url.replace('{version}', 'release');
};

interface FlashingMethodDescriptionProps {
  flashingMethod: FlashingMethod;
  deviceWikiUrl: string | null;
  firmwareVersionData: FirmwareVersionDataInput | null;
}

const FlashingMethodDescription: FunctionComponent<FlashingMethodDescriptionProps> = ({
  flashingMethod,
  deviceWikiUrl,
  firmwareVersionData,
}) => {
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
                href={urlVersioning(
                  firmwareVersionData,
                  wikiUrl ??
                    'https://www.expresslrs.org/{version}/software/updating/betaflight-passthrough/'
                )}
              >
                Check our Wiki page for information.
              </a>
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
              <a
                target="_blank"
                rel="noreferrer noreferrer"
                href={urlVersioning(
                  firmwareVersionData,
                  wikiUrl ??
                    'https://www.expresslrs.org/{version}/quick-start/getting-started/'
                )}
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
                href={urlVersioning(
                  firmwareVersionData,
                  wikiUrl ??
                    'https://www.expresslrs.org/{version}/quick-start/getting-started/'
                )}
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
                href={urlVersioning(
                  firmwareVersionData,
                  wikiUrl ??
                    'https://www.expresslrs.org/{version}/quick-start/getting-started/'
                )}
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
                href={urlVersioning(
                  firmwareVersionData,
                  wikiUrl ??
                    'https://www.expresslrs.org/{version}/quick-start/getting-started/'
                )}
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
                href={urlVersioning(
                  firmwareVersionData,
                  wikiUrl ??
                    'https://www.expresslrs.org/{version}/quick-start/getting-started/'
                )}
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
