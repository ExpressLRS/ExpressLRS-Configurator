import React, { FunctionComponent, memo } from 'react';
import { Box, Tooltip } from '@mui/material';
import QuestionIcon from '@mui/icons-material/Help';
import { SxProps, Theme } from '@mui/system';
import {
  FirmwareVersionDataInput,
  UserDefineKey,
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

interface UserDefineDescriptionProps {
  userDefine: UserDefineKey;
  firmwareVersionData: FirmwareVersionDataInput | null;
}

const UserDefineDescription: FunctionComponent<UserDefineDescriptionProps> =
  memo(({ userDefine, firmwareVersionData }) => {
    const toText = (key: UserDefineKey) => {
      switch (key) {
        case UserDefineKey.REGULATORY_DOMAIN_AU_433:
        case UserDefineKey.REGULATORY_DOMAIN_EU_433:
        case UserDefineKey.REGULATORY_DOMAIN_AU_915:
        case UserDefineKey.REGULATORY_DOMAIN_FCC_915:
        case UserDefineKey.REGULATORY_DOMAIN_EU_868:
        case UserDefineKey.REGULATORY_DOMAIN_IN_866:
          return (
            <div>
              <p>
                Consult{' '}
                <a
                  target="_blank"
                  rel="noreferrer noreferrer"
                  href="https://www.thethingsnetwork.org/docs/lorawan/frequencies-by-country.html"
                >
                  LoRaWAN Frequency Plans and Regulations
                </a>{' '}
                for a regulatory domain to use in your location.
              </p>
              <p>
                <DocumentationLink
                  firmwareVersion={firmwareVersionData}
                  url="https://www.expresslrs.org/{version}/software/user-defines/#regulatory-domain"
                >
                  Check our Wiki page for latest definition.
                </DocumentationLink>
              </p>
            </div>
          );
        case UserDefineKey.REGULATORY_DOMAIN_ISM_2400:
          return (
            <div>
              <p>
                The ISM radio bands are portions of the radio spectrum reserved
                internationally. You can use this regulatory domain safely in
                any country.
              </p>
              <p>
                <DocumentationLink
                  firmwareVersion={firmwareVersionData}
                  url="https://www.expresslrs.org/{version}/software/user-defines/#regulatory-domain"
                >
                  Check our Wiki page for latest definition.
                </DocumentationLink>
              </p>
            </div>
          );
        case UserDefineKey.REGULATORY_DOMAIN_EU_CE_2400:
          return (
            <div>
              <p>
                For firmware versions earlier than v3.x, the EU CE 2.4 GHz
                regulatory domain limits the maximum power to 10mW, which does
                not require LBT (Listen Before Talk). For firmware versions
                later than v3.x, the EU CE 2.4 GHz regulatory domain limits the
                maximum power to 100mW, and enables LBT (Listen Before Talk).
              </p>
              <p>
                <DocumentationLink
                  firmwareVersion={firmwareVersionData}
                  url="https://www.expresslrs.org/{version}/software/user-defines/#regulatory-domain"
                >
                  Check our Wiki page for latest definition.
                </DocumentationLink>
              </p>
            </div>
          );
        case UserDefineKey.BINDING_PHRASE:
          return (
            <div>
              <p>
                Binding phrase pairs receivers to transmitters without requiring
                you to bind manually. Receivers flashed without a binding phrase
                will require the traditional binding method. Both the TX and RX
                need to have the same binding phrase to connect. Set something
                memorable, and limit to alphanumeric phrases conforming to the
                Latin alphabet. This is not a password, and does not provide any
                security, it simply reduces RF collisions with other pilots.
              </p>
              <p>
                <DocumentationLink
                  firmwareVersion={firmwareVersionData}
                  url="https://www.expresslrs.org/{version}/software/user-defines/#binding-phrase"
                >
                  Check our Wiki page for latest definition.
                </DocumentationLink>
              </p>
            </div>
          );
        case UserDefineKey.AUTO_WIFI_ON_INTERVAL:
          return (
            <div>
              <p>
                This will automatically turn the wifi on for any module that has
                an ESP8285 on it if no connection is found after set amount of
                seconds from boot. This enables pushing firmware updates to the
                RX by connecting to its wifi network and visiting 10.0.0.1
              </p>
              <p>
                Auto on interval is defined in <strong>seconds</strong>. Default
                is 60 seconds.
              </p>
              <p>
                <DocumentationLink
                  firmwareVersion={firmwareVersionData}
                  url="https://www.expresslrs.org/{version}/software/user-defines/#other-options"
                >
                  Check our Wiki page for latest definition.
                </DocumentationLink>
              </p>
            </div>
          );
        case UserDefineKey.TLM_REPORT_INTERVAL_MS:
          return (
            <div>
              <p>
                Make the TX module send telemetry data to the handset at a fixed
                interval. This reduces the &quot;Telemetry Lost&quot; warnings
                when running at a high telemetry ratio, or low rates like 50hz.
              </p>
              <p>
                Default value is <strong>240LU</strong>. If you want to change
                that you have to suffix your milliseconds value with{' '}
                <strong>LU</strong>. For example, in order to specify 100 ms
                telemetry update rate you have to enter it like this:{' '}
                <strong>100LU</strong>.
              </p>
              <p>
                Typically, you want to keep <strong>240LU</strong> value for
                OpenTX based radios, and <strong>100LU</strong> for ErskyTx
                ones.
              </p>
              <p>
                <DocumentationLink
                  firmwareVersion={firmwareVersionData}
                  url="https://www.expresslrs.org/{version}/software/user-defines/#telemetry"
                >
                  Check our Wiki page for latest definition.
                </DocumentationLink>
              </p>
            </div>
          );
        case UserDefineKey.LOCK_ON_FIRST_CONNECTION:
          return (
            <div>
              <p>
                RF Mode Locking - Default mode is for the RX to cycle through
                the available RF modes with 5s pauses going from highest to
                lowest mode and finding which mode the Tx transmitting. This
                allows the RX to cycle, but once a connection has been
                established, the Rx will no longer cycle through the RF modes
                (until it receives a power reset).
              </p>
              <p>
                <DocumentationLink
                  firmwareVersion={firmwareVersionData}
                  url="https://www.expresslrs.org/{version}/software/user-defines/#performance-options"
                >
                  Check our Wiki page for latest definition.
                </DocumentationLink>
              </p>
            </div>
          );
        case UserDefineKey.JUST_BEEP_ONCE:
          return (
            <div>
              <p>
                This sets if the TX only beeps one-time versus playing a startup
                song.
              </p>
              <p>
                <DocumentationLink
                  firmwareVersion={firmwareVersionData}
                  url="https://www.expresslrs.org/{version}/software/user-defines/#other-options"
                >
                  Check our Wiki page for latest definition.
                </DocumentationLink>
              </p>
            </div>
          );
        case UserDefineKey.DISABLE_STARTUP_BEEP:
          return (
            <div>
              <p>This sets if the TX shall stay quiet on startup.</p>
              <p>
                <DocumentationLink
                  firmwareVersion={firmwareVersionData}
                  url="https://www.expresslrs.org/{version}/software/user-defines/#other-options"
                >
                  Check our Wiki page for latest definition.
                </DocumentationLink>
              </p>
            </div>
          );
        case UserDefineKey.DISABLE_ALL_BEEPS:
          return (
            <div>
              <p>Disable all beeps.</p>
              <p>
                <DocumentationLink
                  firmwareVersion={firmwareVersionData}
                  url="https://www.expresslrs.org/{version}/software/user-defines/#other-options"
                >
                  Check our Wiki page for latest definition.
                </DocumentationLink>
              </p>
            </div>
          );
        case UserDefineKey.MY_STARTUP_MELODY:
          return (
            <div>
              <p>
                Use this to define your own startup melody using the BlHeli32
                syntax. The parameters music string and bpm are required,
                whereas semitone offset is optional to transpose the entire
                melody up or down by the defined amount of semitones. Example
                BlHeli32 melodies are available on{' '}
                <a
                  target="_blank"
                  rel="noreferrer noreferrer"
                  href="https://www.youtube.com/playlist?list=PL_O0XT_1mZinetucKyuBUvkju8P7DEg-v"
                >
                  Rox Wolfs youtube channel
                </a>
                , some experimentation may be required though.
              </p>
              <p>
                To write your own melody,{' '}
                <a
                  target="_blank"
                  rel="noreferrer noreferrer"
                  href="https://github.com/nseidle/AxelF_DoorBell/wiki/How-to-convert-sheet-music-into-an-Arduino-Sketch"
                >
                  Sheet Music 101
                </a>{' '}
                and this{' '}
                <a
                  target="_blank"
                  rel="noreferrer noreferrer"
                  href="https://dra6n.github.io/blhelikeyboard.github.io/"
                >
                  BLHeli Piano
                </a>{' '}
                are useful resources.
              </p>
              <p>
                This option also supports melodies in RTTTL format now.{' '}
                <a
                  target="_blank"
                  rel="noreferrer noreferrer"
                  href="http://esctunes.com/tunes"
                >
                  EscTunes.com
                </a>{' '}
                is great resource for discovering new melodies.
              </p>
              <p>
                <DocumentationLink
                  firmwareVersion={firmwareVersionData}
                  url="https://www.expresslrs.org/{version}/software/user-defines/#other-options"
                >
                  Check our Wiki page for latest definition.
                </DocumentationLink>
              </p>
            </div>
          );
        case UserDefineKey.UNLOCK_HIGHER_POWER:
          return (
            <div>
              <p>
                There has been some reports of the R9M modules showing
                instability at &gt; 250mw with stock cooling. This in part
                because the ELRS uses a higher duty cycle for transmission
                compared to stock firmware. By default the power is limited to
                250mw. You can unlock up to 1000mw by enabling the following
                option. Do this at your own risk if you make no cooling
                modifications.
              </p>
              <p>
                We published{' '}
                <DocumentationLink
                  firmwareVersion={firmwareVersionData}
                  url="https://www.expresslrs.org/{version}/hardware/fan-mod/"
                >
                  R9M Fan Mod Cover
                </DocumentationLink>
                , a custom 3d printed backplate with room for a fan and extra
                cooling to allow for maximum power (1-2W depending on the mod).
              </p>
              <p>
                <DocumentationLink
                  firmwareVersion={firmwareVersionData}
                  url="https://www.expresslrs.org/{version}/software/user-defines/#output-power-limit"
                >
                  Check our Wiki page for latest definition.
                </DocumentationLink>
              </p>
            </div>
          );
        case UserDefineKey.UART_INVERTED:
          return (
            <div>
              <p>
                Enables compatibility with radios that output inverted CRSF,
                such as the FrSky QX7, TBS Tango 2, RadioMaster TX16S. You want
                to keep this enabled in most of the cases. If your radio is T8SG
                V2 or you use Deviation firmware turn this setting off.
              </p>
              <p>
                <DocumentationLink
                  firmwareVersion={firmwareVersionData}
                  url="https://www.expresslrs.org/{version}/software/user-defines/#compatability-options"
                >
                  Check our Wiki page for latest definition.
                </DocumentationLink>
              </p>
            </div>
          );
        case UserDefineKey.RCVR_UART_BAUD:
          return (
            <div>
              <p>
                Receiver UART baud rate. Defaults to 420000. Set this option to
                400000 and your receiver will work with Kiss v1 flight
                controllers.
              </p>
              <p>
                <DocumentationLink
                  firmwareVersion={firmwareVersionData}
                  url="https://www.expresslrs.org/{version}/software/user-defines/#compatability-options"
                >
                  Check our Wiki page for latest definition.
                </DocumentationLink>
              </p>
            </div>
          );
        case UserDefineKey.RCVR_INVERT_TX:
          return (
            <div>
              <p>
                If using an a flight controller that only has an RXI / SBUS (RX
                inverted) pad, turn on this option to invert the CRSF output
                from the receiver to be able to use that pad. This does not
                convert the output to SBUS, it is inverted CRSF, so CRSF should
                still be the receiver protocol selected in the flight controller
                software. ESP-based receivers only.
              </p>
              <p>
                <DocumentationLink
                  firmwareVersion={firmwareVersionData}
                  url="https://www.expresslrs.org/{version}/software/user-defines/#compatability-options"
                >
                  Check our Wiki page for latest definition.
                </DocumentationLink>
              </p>
            </div>
          );
        case UserDefineKey.USE_R9MM_R9MINI_SBUS:
          return (
            <div>
              <p>
                <strong>THIS DOES NOT ENABLE SBUS PROTOCOL.</strong>
              </p>
              <p>
                This is useful for F4 FCs which do not have an uninverted UART
                option. This is only one way, so you lose the telemetry downlink
                to your radio as well as passthrough flashing. This will output
                out of the default S.BUS pin on your R9MM/R9Mini. set
                serialrx_inverted = ON may also be needed within Betaflight for
                compatibility
              </p>
              <p>
                <DocumentationLink
                  firmwareVersion={firmwareVersionData}
                  url="https://www.expresslrs.org/{version}/software/user-defines/#compatability-options"
                >
                  Check our Wiki page for latest definition.
                </DocumentationLink>
              </p>
            </div>
          );
        case UserDefineKey.HOME_WIFI_SSID:
          return (
            <div>
              <p>
                Set home Wi-Fi network name (SSID). It will allow Wi-Fi enabled
                hardware to connect to the home network automatically.
              </p>
              <p>
                <DocumentationLink
                  firmwareVersion={firmwareVersionData}
                  url="https://www.expresslrs.org/{version}/software/user-defines/#other-options"
                >
                  Check our Wiki page for latest definition.
                </DocumentationLink>
              </p>
            </div>
          );
        case UserDefineKey.HOME_WIFI_PASSWORD:
          return (
            <div>
              <p>
                Set home Wi-Fi network password. It will allow Wi-Fi enabled
                hardware to connect to the home network automatically.
              </p>
              <p>
                <DocumentationLink
                  firmwareVersion={firmwareVersionData}
                  url="https://www.expresslrs.org/{version}/software/user-defines/#other-options"
                >
                  Check our Wiki page for latest definition.
                </DocumentationLink>
              </p>
            </div>
          );
        default:
          return '';
      }
    };
    const desc = toText(userDefine);
    return (
      <Box sx={styles.root}>
        {desc !== '' && (
          <Tooltip placement="top" arrow title={<div>{desc}</div>}>
            <QuestionIcon sx={styles.icon} />
          </Tooltip>
        )}
      </Box>
    );
  });

export default UserDefineDescription;
