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
                <Trans
                  i18nKey="UserDefineDescription.RegulatoryDomain915"
                  components={{
                    LoRaWANLink: (
                      <DocumentationLink url="https://www.thethingsnetwork.org/docs/lorawan/frequencies-by-country/" />
                    ),
                  }}
                />
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
              <Trans i18nKey="UserDefineDescription.AutoWifiOnInterval" />
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
              <Trans i18nKey="UserDefineDescription.TLMReportIntervalMs" />
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
              <Trans
                i18nKey="UserDefineDescription.MyStartupMelody"
                components={{
                  RoxWolfsYoutubeChannelLink: (
                    <DocumentationLink url="https://www.youtube.com/playlist?list=PL_O0XT_1mZinetucKyuBUvkju8P7DEg-v" />
                  ),
                  SheetMusic101lLink: (
                    <DocumentationLink url="https://github.com/nseidle/AxelF_DoorBell/wiki/How-to-convert-sheet-music-into-an-Arduino-Sketch" />
                  ),
                  BLHeliPianoLink: (
                    <DocumentationLink url="https://dra6n.github.io/blhelikeyboard.github.io/" />
                  ),
                  EscTunesLink: (
                    <DocumentationLink url="http://esctunes.com/tunes" />
                  ),
                }}
              />
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
              <Trans
                i18nKey="UserDefineDescription.UnlockHigherPower"
                components={{
                  R9MFanModCoverLink: (
                    <DocumentationLink url="https://www.expresslrs.org/hardware/fan-mod/" />
                  ),
                }}
              />
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
              <Trans i18nKey="UserDefineDescription.UseR9MMR9MiniSBUS" />
              <p>
                <DocumentationLink url="https://www.expresslrs.org/software/user-defines/#compatibility-options">
                  {t('UserDefineDescription.Wiki')}
                </DocumentationLink>
              </p>
            </div>
          );
        case UserDefineKey.RX_AS_TX:
          return (
            <div>
              <Trans i18nKey="UserDefineDescription.RxAsTx" />
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
