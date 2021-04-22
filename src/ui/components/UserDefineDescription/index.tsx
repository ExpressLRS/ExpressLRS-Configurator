import React, { FunctionComponent, memo } from 'react';
import { makeStyles, Tooltip } from '@material-ui/core';
import QuestionIcon from '@material-ui/icons/Help';
import { UserDefineKey } from '../../gql/generated/types';

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

interface UserDefineDescriptionProps {
  userDefine: UserDefineKey;
}

const UserDefineDescription: FunctionComponent<UserDefineDescriptionProps> = memo(
  ({ userDefine }) => {
    const styles = useStyles();
    const toText = (key: UserDefineKey) => {
      switch (key) {
        case UserDefineKey.REGULATORY_DOMAIN_AU_433:
        case UserDefineKey.REGULATORY_DOMAIN_EU_433:
        case UserDefineKey.REGULATORY_DOMAIN_AU_915:
        case UserDefineKey.REGULATORY_DOMAIN_FCC_915:
        case UserDefineKey.REGULATORY_DOMAIN_EU_868:
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
                <a
                  target="_blank"
                  rel="noreferrer noreferrer"
                  href="https://github.com/ExpressLRS/ExpressLRS/wiki/User-Defines#regulatory-domain"
                >
                  Check our Wiki page for latest definition.
                </a>
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
                <a
                  target="_blank"
                  rel="noreferrer noreferrer"
                  href="https://github.com/ExpressLRS/ExpressLRS/wiki/User-Defines#regulatory-domain"
                >
                  Check our Wiki page for latest definition.
                </a>
              </p>
            </div>
          );
        case UserDefineKey.BINDING_PHRASE:
          return (
            <div>
              <p>
                Both the TX and RX NEED to have the same binding phrase or
                ExpressLRS will not work. Set something memorable, and limit to
                alphanumeric phrases conforming to the Latin alphabet. This
                phrase gets MD5 hashed and gets built into the binary you will
                be flashing.
              </p>
              <p>
                <a
                  target="_blank"
                  rel="noreferrer noreferrer"
                  href="https://github.com/ExpressLRS/ExpressLRS/wiki/User-Defines#binding-phrase"
                >
                  Check our Wiki page for latest definition.
                </a>
              </p>
            </div>
          );
        case UserDefineKey.ARM_CHANNEL:
          return (
            <div>
              <p>ARM channels</p>
              <p>
                AUX1 - Channel 5<br />
                AUX2 - Channel 6<br />
                AUX3 - Channel 7<br />
                AUX4 - Channel 8<br />
                AUX5 - Channel 9<br />
                AUX6 - Channel 10
                <br />
                AUX7 - Channel 11
                <br />
                AUX8 - Channel 12
              </p>
              <p>
                <a
                  target="_blank"
                  rel="noreferrer noreferrer"
                  href="https://github.com/ExpressLRS/ExpressLRS/wiki/User-Defines#performance-options"
                >
                  Check our Wiki page for latest definition.
                </a>
              </p>
            </div>
          );
        case UserDefineKey.AUTO_WIFI_ON_BOOT:
          return (
            <div>
              <p>
                This will automatically turn the wifi on for any module that has
                an ESP8285 on it if no connection is found after ~10 seconds
                from boot. This enables pushing firmware updates to the RX by
                connecting to its wifi network and visiting 10.0.0.1
              </p>
              <p>
                <a
                  target="_blank"
                  rel="noreferrer noreferrer"
                  href="https://github.com/ExpressLRS/ExpressLRS/wiki/User-Defines#other-options"
                >
                  Check our Wiki page for latest definition.
                </a>
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
                Wifi internal is defined in <strong>seconds</strong>. Default is
                20 seconds.
              </p>
              <p>
                <a
                  target="_blank"
                  rel="noreferrer noreferrer"
                  href="https://github.com/ExpressLRS/ExpressLRS/wiki/User-Defines#other-options"
                >
                  Check our Wiki page for latest definition.
                </a>
              </p>
            </div>
          );
        case UserDefineKey.FAST_SYNC:
          return (
            <div>
              <p>Experimental option that adds faster initial syncing.</p>
              <p>
                <a
                  target="_blank"
                  rel="noreferrer noreferrer"
                  href="https://github.com/ExpressLRS/ExpressLRS/wiki/User-Defines#performance-options"
                >
                  Check our Wiki page for latest definition.
                </a>
              </p>
            </div>
          );
        case UserDefineKey.FEATURE_OPENTX_SYNC:
          return (
            <div>
              <p>
                This option lowers latency and{' '}
                <strong>should be kept enabled</strong>. It requires{' '}
                <a
                  target="_blank"
                  rel="noreferrer noreferrer"
                  href="https://www.open-tx.org/downloads"
                >
                  OpenTX 2.3 Nightly builds
                </a>{' '}
                starting from the N473 build or above. It also will be supported
                in OpenTX 2.4 and above. In order to install it, you will have
                to use OpenTX companion application. As an alternative, the
                ExpressLRS team has released their{' '}
                <a
                  target="_blank"
                  rel="noreferrer noreferrer"
                  href="https://github.com/ExpressLRS/ExpressLRS/tree/master/OpenTX"
                >
                  OpenTx build
                </a>{' '}
                with the required changes.
              </p>
              <p>
                <a
                  target="_blank"
                  rel="noreferrer noreferrer"
                  href="https://github.com/ExpressLRS/ExpressLRS/wiki/User-Defines#performance-options"
                >
                  Check our Wiki page for latest definition.
                </a>
              </p>
            </div>
          );
        case UserDefineKey.FEATURE_OPENTX_SYNC_AUTOTUNE:
          return (
            <div>
              <p>
                This option is more experimental and can lower the offset from
                the radio by tuning it as close as possible to 0. It requires{' '}
                <a
                  target="_blank"
                  rel="noreferrer noreferrer"
                  href="https://www.open-tx.org/downloads"
                >
                  OpenTX 2.3 Nightly builds
                </a>{' '}
                starting from the N473 build or above. It also will be supported
                in OpenTX 2.4 and above. In order to install it, you will have
                to use OpenTX companion application. As an alternative, the
                ExpressLRS team has released their{' '}
                <a
                  target="_blank"
                  rel="noreferrer noreferrer"
                  href="https://github.com/ExpressLRS/ExpressLRS/tree/master/OpenTX"
                >
                  OpenTx build
                </a>{' '}
                with the required changes.
              </p>
              <p>
                <a
                  target="_blank"
                  rel="noreferrer noreferrer"
                  href="https://github.com/ExpressLRS/ExpressLRS/wiki/User-Defines#performance-options"
                >
                  Check our Wiki page for latest definition.
                </a>
              </p>
            </div>
          );
        case UserDefineKey.HYBRID_SWITCHES_8:
          return (
            <div>
              <p>
                The switch mode MUST match on the transmitter and all receivers
                that you use with it. Do not mix switch modes. Older versions of
                the firmware (prior to November 30th 2020) dit not check to make
                sure the transmitter and receiver are using the same mode, so
                the switch positions could be misinterpreted leading to
                unexpected behaviour, possibly including unintentional arming.
                Current versions include a check that should prevent receivers
                and transmitters with different switch settings from
                establishing a link, but it is still recommended to pick one
                switch mode and use it for all your transmitters and receivers.
              </p>
              <p>There are 2 available choices here.</p>

              <ol>
                <li>
                  The default choice is to have 4 1bit switches (which
                  corresponds to 2 position switches).
                </li>
                <li>
                  The other option is DHYBRID_SWITCHES_8 where the first switch
                  is treated as a low-latency switch to be used for arm/disarm.
                  It is sent with every packet. For the remaining 7 switches the
                  first 3 bits are the switch ID, followed by 2 bits for the
                  switch value. Switches that have changed are given priority,
                  otherwise each switch value is sent in a round-robin. All
                  switches are encoded for 3 position support. All analog
                  channels are reduced to 10 bit resolution to free up space in
                  the RC packet for switches. For all use cases besides absolute
                  speed we recommend using hybrid switches over sequential or
                  1-bit switches. The only &quot;downside&quot; is the reduced
                  channel resolution, but that turns out to not be important
                  because Betaflight only interprets channels as 10bit, so no
                  resolution is actually lost.
                </li>
              </ol>
              <p>
                <a
                  target="_blank"
                  rel="noreferrer noreferrer"
                  href="https://github.com/ExpressLRS/ExpressLRS/wiki/User-Defines#switches"
                >
                  Check our Wiki page for latest definition.
                </a>
              </p>
            </div>
          );
        case UserDefineKey.ENABLE_TELEMETRY:
          return (
            <div>
              <p>
                Enable advanced telemetry support. This option must be enabled
                on both <strong>TX</strong> and <strong>RX</strong>. The
                following telemetry messages are supported:
              </p>
              <ul>
                <li>GPS</li>
                <li>BATTERY_SENSOR</li>
                <li>ATTITUDE</li>
                <li>DEVICE_INFO</li>
                <li>FLIGHT_MODE</li>
              </ul>
              <p>
                <strong>Note #1</strong>: Increase the telemetry rate with the
                ExpressLRS lua script. Increase the rate until the sensor lost
                warnings go away. It is normal to set it up to 1:16 with 200 Hz
                refresh rate.
              </p>
              <p>
                <strong>Note #2</strong>: It must be enabled together with{' '}
                <strong>HYBRID_SWITCHES_8</strong>.
              </p>
              <p>
                <a
                  target="_blank"
                  rel="noreferrer noreferrer"
                  href="https://github.com/ExpressLRS/ExpressLRS/wiki/User-Defines#telemetry"
                >
                  Check our Wiki page for latest definition.
                </a>
              </p>
            </div>
          );
        case UserDefineKey.TLM_REPORT_INTERVAL_MS:
          return (
            <div>
              <p>
                It makes the TX module send the telemetry data to the OpenTX
                every 320 ms by default. This stops the telemetry lost warnings
                when running a high telemetry ratio, or low rates like 50hz.
              </p>
              <p>
                Default value is <strong>320LU</strong>. If you want to change
                that you have to suffix your milliseconds value with{' '}
                <strong>LU</strong>. For example, in order to specify 100 ms
                telemetry update rate you have to enter it like this:{' '}
                <strong>100LU</strong>.
              </p>
              <p>
                Typically, you want to keep <strong>320LU</strong> value for
                OpenTX based radios, and <strong>100LU</strong> for ErskyTx
                ones.
              </p>
              <p>
                <a
                  target="_blank"
                  rel="noreferrer noreferrer"
                  href="https://github.com/ExpressLRS/ExpressLRS/wiki/User-Defines#telemetry"
                >
                  Check our Wiki page for latest definition.
                </a>
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
                <a
                  target="_blank"
                  rel="noreferrer noreferrer"
                  href="https://github.com/ExpressLRS/ExpressLRS/wiki/User-Defines#performance-options"
                >
                  Check our Wiki page for latest definition.
                </a>
              </p>
            </div>
          );
        case UserDefineKey.LOCK_ON_50HZ:
          return (
            <div>
              <p>
                This locks the RX at 50Hz mode from the power-up. Only
                recommended for long range, and partly redundant with
                LOCK_ON_FIRST_CONNECTION.
              </p>
              <p>
                <a
                  target="_blank"
                  rel="noreferrer noreferrer"
                  href="https://github.com/ExpressLRS/ExpressLRS/wiki/User-Defines#performance-options"
                >
                  Check our Wiki page for latest definition.
                </a>
              </p>
            </div>
          );
        case UserDefineKey.JUST_BEEP_ONCE:
          return (
            <div>
              <p>
                This sets if the TX only beeps one-time versus playing a startup
                song.
              </p>{' '}
              <p>
                <a
                  target="_blank"
                  rel="noreferrer noreferrer"
                  href="https://github.com/ExpressLRS/ExpressLRS/wiki/User-Defines#other-options"
                >
                  Check our Wiki page for latest definition.
                </a>
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
                <a
                  target="_blank"
                  rel="noreferrer noreferrer"
                  href="https://github.com/ExpressLRS/ExpressLRS/wiki/User-Defines#other-options"
                >
                  Check our Wiki page for latest definition.
                </a>
              </p>
            </div>
          );
        case UserDefineKey.NO_SYNC_ON_ARM:
          return (
            <div>
              <p>
                Do not transmit sync packets while armed. If you are using a
                different channel than the default you need to edit (or you may
                not be able to gain sync safely - default is listed in
                ARM_CHANNEL as AUX1 which is Channel 5). This is useful for
                racing as there is less time & packets wasted on sending sync
                packets. HOWEVER if you are doing serious long range, keep this
                turned off because in the case of a sustained failsafe, link can
                not be regained while armed.
              </p>
              <p>
                <strong>
                  This feature assumes that a low value of the arm switch is
                  disarmed, and a high value is armed
                </strong>
                . If you have the arm switch reversed it will not work
                correctly, and the link will not be established. For this reason
                it may be best not to enable no sync on arm when you are first
                setting up ExpressLRS as it can be a source of confusion.
              </p>
              <p>
                <a
                  target="_blank"
                  rel="noreferrer noreferrer"
                  href="https://github.com/ExpressLRS/ExpressLRS/wiki/User-Defines#performance-options"
                >
                  Check our Wiki page for latest definition.
                </a>
              </p>
            </div>
          );
        case UserDefineKey.R9M_UNLOCK_HIGHER_POWER:
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
                <a
                  target="_blank"
                  rel="noreferrer noreferrer"
                  href="https://github.com/ExpressLRS/ExpressLRS/wiki/R9M-Fan-Mod-Cover"
                >
                  R9M Fan Mod Cover
                </a>
                , a custom 3d printed backplate with room for a fan and extra
                cooling to allow for maximum power (1-2W depending on the mod).
              </p>
              <p>
                <a
                  target="_blank"
                  rel="noreferrer noreferrer"
                  href="https://github.com/ExpressLRS/ExpressLRS/wiki/User-Defines#output-power-limit-r9m-only"
                >
                  Check our Wiki page for latest definition.
                </a>
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
              </p>{' '}
              <p>
                <a
                  target="_blank"
                  rel="noreferrer noreferrer"
                  href="https://github.com/ExpressLRS/ExpressLRS/wiki/User-Defines#compatability-options"
                >
                  Check our Wiki page for latest definition.
                </a>
              </p>
            </div>
          );
        case UserDefineKey.USE_500HZ:
          return (
            <div>
              <p>
                Enables 500Hz mode. It requires{' '}
                <a
                  target="_blank"
                  rel="noreferrer noreferrer"
                  href="https://www.open-tx.org/downloads"
                >
                  OpenTX 2.3 Nightly builds
                </a>{' '}
                starting from the N473 build or above. It also will be supported
                in OpenTX 2.4 and above. In order to install it, you will have
                to use OpenTX companion application. As an alternative, the
                ExpressLRS team has released their{' '}
                <a
                  target="_blank"
                  rel="noreferrer noreferrer"
                  href="https://github.com/ExpressLRS/ExpressLRS/tree/master/OpenTX"
                >
                  OpenTx build
                </a>{' '}
                with the required changes.
              </p>{' '}
              <p>
                <a
                  target="_blank"
                  rel="noreferrer noreferrer"
                  href="https://github.com/ExpressLRS/ExpressLRS/wiki/User-Defines#other-options"
                >
                  Check our Wiki page for latest definition.
                </a>
              </p>
            </div>
          );
        case UserDefineKey.USE_ESP8266_BACKPACK:
          return (
            <div>
              <p>
                This enables communication with the ESP Backpack for
                over-the-air updates (DeviceTarget: FrSky_TX_R9M_via_WiFi) 🖥️
                and debugging via WebSocket 🔍
              </p>{' '}
              <p>
                <a
                  target="_blank"
                  rel="noreferrer noreferrer"
                  href="https://github.com/ExpressLRS/ExpressLRS/wiki/User-Defines#other-options"
                >
                  Check our Wiki page for latest definition.
                </a>
              </p>
            </div>
          );
        case UserDefineKey.USE_R9MM_R9MINI_SBUS:
          return (
            <div>
              <p>
                This is useful for F4 FCs which do not have an uninverted UART
                option. This is only one way, so you lose the telemetry downlink
                to your radio as well as passthrough flashing. This will output
                out of the default S.BUS pin on your R9MM/R9Mini. set
                serialrx_inverted = ON may also be needed within Betaflight for
                compatibility
              </p>{' '}
              <p>
                <a
                  target="_blank"
                  rel="noreferrer noreferrer"
                  href="https://github.com/ExpressLRS/ExpressLRS/wiki/User-Defines#compatability-options"
                >
                  Check our Wiki page for latest definition.
                </a>
              </p>
            </div>
          );
        case UserDefineKey.USE_UART2:
          return (
            <div>
              <p>
                This enables integration with Jye&apos;s{' '}
                <a
                  target="_blank"
                  rel="noreferrer noreferrer"
                  href="https://github.com/JyeSmith/FENIX-rx5808-pro-diversity"
                >
                  FENIX rx5805 pro-diversity module
                </a>
              </p>{' '}
              <p>
                <a
                  target="_blank"
                  rel="noreferrer noreferrer"
                  href="https://github.com/ExpressLRS/ExpressLRS/wiki/User-Defines#compatability-options"
                >
                  Check our Wiki page for latest definition.
                </a>
              </p>
            </div>
          );
        default:
          return '';
      }
    };
    const desc = toText(userDefine);
    return (
      <div className={styles.root}>
        {desc !== '' && (
          <Tooltip
            placement="top"
            arrow
            classes={{
              tooltip:
                userDefine === UserDefineKey.HYBRID_SWITCHES_8
                  ? styles.tooltipRootBig
                  : styles.tooltipRoot,
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

export default UserDefineDescription;
