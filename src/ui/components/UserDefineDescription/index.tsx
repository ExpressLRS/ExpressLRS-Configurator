import React, { FunctionComponent, memo } from 'react';
import { Box, Tooltip } from '@mui/material';
import QuestionIcon from '@mui/icons-material/Help';
import { SxProps, Theme } from '@mui/system';
import { useTranslation, Trans } from 'react-i18next';
import { UserDefineKey } from '../../gql/generated/types';
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
}

const UserDefineDescription: FunctionComponent<UserDefineDescriptionProps> =
  memo(({ userDefine }) => {
    const { t } = useTranslation();
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
                {/* How to guess the translation indexes correctly: https://react.i18next.com/latest/trans-component#how-to-get-the-correct-translation-string */}
                <Trans i18nKey="UserDefineDescription.RegulatoryDomain915">
                  Consult{' '}
                  <DocumentationLink url="https://www.thethingsnetwork.org/docs/lorawan/frequencies-by-country.html">
                    LoRaWAN Frequency Plans and Regulations
                  </DocumentationLink>{' '}
                  for a regulatory domain to use in your location.
                </Trans>
              </p>
              <p>
                <DocumentationLink url="https://www.expresslrs.org/software/user-defines/#regulatory-domain">
                  {t('UserDefineDescription.Wiki')}
                </DocumentationLink>
              </p>
            </div>
          );
        case UserDefineKey.REGULATORY_DOMAIN_ISM_2400:
          return (
            <div>
              <p>{t('UserDefineDescription.RegulatoryDomainISM2400')}</p>
              <p>
                <DocumentationLink url="https://www.expresslrs.org/software/user-defines/#regulatory-domain">
                  {t('UserDefineDescription.Wiki')}
                </DocumentationLink>
              </p>
            </div>
          );
        case UserDefineKey.REGULATORY_DOMAIN_EU_CE_2400:
          return (
            <div>
              <p>{t('UserDefineDescription.RegulatoryDomainEUCE2400')}</p>
              <p>
                <DocumentationLink url="https://www.expresslrs.org/software/user-defines/#regulatory-domain">
                  {t('UserDefineDescription.Wiki')}
                </DocumentationLink>
              </p>
            </div>
          );
        case UserDefineKey.BINDING_PHRASE:
          return (
            <div>
              <p>{t('UserDefineDescription.BindingPhrase')}</p>
              <p>
                <DocumentationLink url="https://www.expresslrs.org/software/user-defines/#binding-phrase">
                  {t('UserDefineDescription.Wiki')}
                </DocumentationLink>
              </p>
            </div>
          );
        case UserDefineKey.AUTO_WIFI_ON_INTERVAL:
          return (
            <div>
              <Trans i18nKey="UserDefineDescription.AutoWifiOnInterval">
                <p>
                  This will automatically turn the wifi on for any module that
                  has an ESP8285 on it if no connection is found after set
                  amount of seconds from boot. This enables pushing firmware
                  updates to the RX by connecting to its wifi network and
                  visiting 10.0.0.1
                </p>
                <p>
                  Auto on interval is defined in <strong>seconds</strong>.
                  Default is 60 seconds.
                </p>
              </Trans>
              <p>
                <DocumentationLink url="https://www.expresslrs.org/software/user-defines/#network-options">
                  {t('UserDefineDescription.Wiki')}
                </DocumentationLink>
              </p>
            </div>
          );
        case UserDefineKey.TLM_REPORT_INTERVAL_MS:
          return (
            <div>
              <Trans i18nKey="UserDefineDescription.TLMReportIntervalMs">
                <p>
                  Make the TX module send telemetry data to the handset at a
                  fixed interval. This reduces the 「Telemetry Lost」warnings
                  when running at a high telemetry ratio, or low rates like
                  50hz.
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
                  EdgeTX/OpenTX based radios, and <strong>100LU</strong> for
                  ErskyTx ones.
                </p>
              </Trans>
              <p>
                <DocumentationLink url="https://www.expresslrs.org/software/user-defines/">
                  {t('UserDefineDescription.Wiki')}
                </DocumentationLink>
              </p>
            </div>
          );
        case UserDefineKey.LOCK_ON_FIRST_CONNECTION:
          return (
            <div>
              <p>{t('UserDefineDescription.LockOnFirstConnection')}</p>
              <p>
                <DocumentationLink url="https://www.expresslrs.org/software/user-defines/#performance-options">
                  {t('UserDefineDescription.Wiki')}
                </DocumentationLink>
              </p>
            </div>
          );
        case UserDefineKey.JUST_BEEP_ONCE:
          return (
            <div>
              <p>{t('UserDefineDescription.JustBeepOnce')}</p>
              <p>
                <DocumentationLink url="https://www.expresslrs.org/software/user-defines/#other-options">
                  {t('UserDefineDescription.Wiki')}
                </DocumentationLink>
              </p>
            </div>
          );
        case UserDefineKey.DISABLE_STARTUP_BEEP:
          return (
            <div>
              <p>{t('UserDefineDescription.DisableStartupBeep')}</p>
              <p>
                <DocumentationLink url="https://www.expresslrs.org/software/user-defines/#other-options">
                  {t('UserDefineDescription.Wiki')}
                </DocumentationLink>
              </p>
            </div>
          );
        case UserDefineKey.DISABLE_ALL_BEEPS:
          return (
            <div>
              <p>{t('UserDefineDescription.DisableAllBeeps')}</p>
              <p>
                <DocumentationLink url="https://www.expresslrs.org/software/user-defines/#other-options">
                  {t('UserDefineDescription.Wiki')}
                </DocumentationLink>
              </p>
            </div>
          );
        case UserDefineKey.MY_STARTUP_MELODY:
          return (
            <div>
              {/* How to guess the translation indexes correctly: https://react.i18next.com/latest/trans-component#how-to-get-the-correct-translation-string */}
              <Trans i18nKey="UserDefineDescription.MyStartupMelody">
                <p>
                  Use this to define your own startup melody using the BlHeli32
                  syntax. The parameters music string and bpm are required,
                  whereas semitone offset is optional to transpose the entire
                  melody up or down by the defined amount of semitones. Example
                  BlHeli32 melodies are available on{' '}
                  <DocumentationLink url="https://www.youtube.com/playlist?list=PL_O0XT_1mZinetucKyuBUvkju8P7DEg-v">
                    Rox Wolfs youtube channel
                  </DocumentationLink>
                  , some experimentation may be required though.
                </p>
                <p>
                  To write your own melody,{' '}
                  <DocumentationLink url="https://github.com/nseidle/AxelF_DoorBell/wiki/How-to-convert-sheet-music-into-an-Arduino-Sketch">
                    Sheet Music 101
                  </DocumentationLink>{' '}
                  and this{' '}
                  <DocumentationLink url="https://dra6n.github.io/blhelikeyboard.github.io/">
                    BLHeli Piano
                  </DocumentationLink>{' '}
                  are useful resources.
                </p>
                <p>
                  This option also supports melodies in RTTTL format now.{' '}
                  <DocumentationLink url="http://esctunes.com/tunes">
                    EscTunes.com
                  </DocumentationLink>{' '}
                  is great resource for discovering new melodies.
                </p>
              </Trans>
              <p>
                <DocumentationLink url="https://www.expresslrs.org/software/user-defines/#other-options">
                  {t('UserDefineDescription.Wiki')}
                </DocumentationLink>
              </p>
            </div>
          );
        case UserDefineKey.UNLOCK_HIGHER_POWER:
          return (
            <div>
              {/* How to guess the translation indexes correctly: https://react.i18next.com/latest/trans-component#how-to-get-the-correct-translation-string */}
              <Trans i18nKey="UserDefineDescription.UnlockHigherPower">
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
                  <DocumentationLink url="https://www.expresslrs.org/hardware/fan-mod/">
                    R9M Fan Mod Cover
                  </DocumentationLink>
                  , a custom 3d printed backplate with room for a fan and extra
                  cooling to allow for maximum power (1-2W depending on the
                  mod).
                </p>
              </Trans>
              <p>
                <DocumentationLink url="https://www.expresslrs.org/software/user-defines/#output-power-limit">
                  {t('UserDefineDescription.Wiki')}
                </DocumentationLink>
              </p>
            </div>
          );
        case UserDefineKey.UART_INVERTED:
          return (
            <div>
              <p>{t('UserDefineDescription.UARTInverted')}</p>
              <p>
                <DocumentationLink url="https://www.expresslrs.org/quick-start/firmware-options/#other-options">
                  {t('UserDefineDescription.Wiki')}
                </DocumentationLink>
              </p>
            </div>
          );
        case UserDefineKey.RCVR_UART_BAUD:
          return (
            <div>
              <p>{t('UserDefineDescription.RCVRUARTBaud')}</p>
              <p>
                <DocumentationLink url="https://www.expresslrs.org/software/user-defines/#compatibility-options">
                  {t('UserDefineDescription.Wiki')}
                </DocumentationLink>
              </p>
            </div>
          );
        case UserDefineKey.RCVR_INVERT_TX:
          return (
            <div>
              <p>{t('UserDefineDescription.RCVRInvertTX')}</p>
              <p>
                <DocumentationLink url="https://www.expresslrs.org/quick-start/firmware-options/#output-inverting">
                  {t('UserDefineDescription.Wiki')}
                </DocumentationLink>
              </p>
            </div>
          );
        case UserDefineKey.USE_R9MM_R9MINI_SBUS:
          return (
            <div>
              <Trans i18nKey="UserDefineDescription.UseR9MMR9MiniSBUS">
                <p>
                  <strong>THIS DOES NOT ENABLE SBUS PROTOCOL.</strong>
                </p>
                <p>
                  This is useful for F4 FCs which do not have an uninverted UART
                  option. This is only one way, so you lose the telemetry
                  downlink to your radio as well as passthrough flashing. This
                  will output out of the default S.BUS pin on your R9MM/R9Mini.
                  Set serialrx_inverted = ON may also be needed within
                  Betaflight for compatibility
                </p>
              </Trans>
              <p>
                <DocumentationLink url="https://www.expresslrs.org/software/user-defines/#compatibility-options">
                  {t('UserDefineDescription.Wiki')}
                </DocumentationLink>
              </p>
            </div>
          );
        case UserDefineKey.HOME_WIFI_SSID:
          return (
            <div>
              <p>{t('UserDefineDescription.HomeWifiSSID')}</p>
              <p>
                <DocumentationLink url="https://www.expresslrs.org/software/user-defines/#network-options">
                  {t('UserDefineDescription.Wiki')}
                </DocumentationLink>
              </p>
            </div>
          );
        case UserDefineKey.HOME_WIFI_PASSWORD:
          return (
            <div>
              <p>{t('UserDefineDescription.HomeWifiPassword')}</p>
              <p>
                <DocumentationLink url="https://www.expresslrs.org/software/user-defines/#network-options">
                  {t('UserDefineDescription.Wiki')}
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
