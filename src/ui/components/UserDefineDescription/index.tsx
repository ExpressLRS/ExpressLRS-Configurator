import React, { FunctionComponent, memo } from 'react';
import { Box, Tooltip } from '@mui/material';
import QuestionIcon from '@mui/icons-material/Help';
import { SxProps, Theme } from '@mui/system';
import { useTranslation } from 'react-i18next';
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
                {t('UserDefineDescription.915RegulationP1')}{' '}
                <a
                  target="_blank"
                  rel="noreferrer noreferrer"
                  href="https://www.thethingsnetwork.org/docs/lorawan/frequencies-by-country.html"
                >
                  {t('UserDefineDescription.915RegulationP2')}
                </a>{' '}
                {t('UserDefineDescription.915RegulationP3')}
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
              <p>{t('UserDefineDescription.2400ISMRegulation')}</p>
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
              <p>{t('UserDefineDescription.2400EURegulation')}</p>
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
              <p>{t('UserDefineDescription.AutoWifiOnIntervalP1')}</p>
              <p>
                {t('UserDefineDescription.AutoWifiOnIntervalP2')}{' '}
                <strong>
                  {t('UserDefineDescription.AutoWifiOnIntervalP3')}
                </strong>
                {t('UserDefineDescription.AutoWifiOnIntervalP4')}
              </p>
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
              <p>{t('UserDefineDescription.TLMReportIntervalMSP1')}</p>
              <p>
                {t('UserDefineDescription.TLMReportIntervalMSP2')}{' '}
                <strong>240LU</strong>{' '}
                {t('UserDefineDescription.TLMReportIntervalMSP3')}{' '}
                <strong>LU</strong>
                {t('UserDefineDescription.TLMReportIntervalMSP4')}
                <strong> 100LU</strong>.
              </p>
              <p>
                {t('UserDefineDescription.TLMReportIntervalMSP5')}{' '}
                <strong>240LU</strong> v
                {t('UserDefineDescription.TLMReportIntervalMSP6')}{' '}
                <strong>100LU</strong>{' '}
                {t('UserDefineDescription.TLMReportIntervalMSP7')}
              </p>
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
              <p>
                {t('UserDefineDescription.MyStartupMelodyP1')}{' '}
                <a
                  target="_blank"
                  rel="noreferrer noreferrer"
                  href="https://www.youtube.com/playlist?list=PL_O0XT_1mZinetucKyuBUvkju8P7DEg-v"
                >
                  {t('UserDefineDescription.MyStartupMelodyP2')}
                </a>
                {t('UserDefineDescription.MyStartupMelodyP3')}
              </p>
              <p>
                {t('UserDefineDescription.MyStartupMelodyP4')}{' '}
                <a
                  target="_blank"
                  rel="noreferrer noreferrer"
                  href="https://github.com/nseidle/AxelF_DoorBell/wiki/How-to-convert-sheet-music-into-an-Arduino-Sketch"
                >
                  Sheet Music 101
                </a>{' '}
                {t('UserDefineDescription.MyStartupMelodyP6')}{' '}
                <a
                  target="_blank"
                  rel="noreferrer noreferrer"
                  href="https://dra6n.github.io/blhelikeyboard.github.io/"
                >
                  BLHeli Piano
                </a>{' '}
                {t('UserDefineDescription.MyStartupMelodyP8')}
              </p>
              <p>
                {t('UserDefineDescription.MyStartupMelodyP9')}{' '}
                <a
                  target="_blank"
                  rel="noreferrer noreferrer"
                  href="http://esctunes.com/tunes"
                >
                  EscTunes.com
                </a>{' '}
                {t('UserDefineDescription.915RegulationP10')}
              </p>
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
              <p>{t('UserDefineDescription.UnlockHigherPowerP1')}</p>
              <p>
                {t('UserDefineDescription.UnlockHigherPowerP2')}{' '}
                <DocumentationLink url="https://www.expresslrs.org/hardware/fan-mod/">
                  {t('UserDefineDescription.UnlockHigherPowerP3')}
                </DocumentationLink>
                {t('UserDefineDescription.UnlockHigherPowerP4')}
              </p>
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
              <p>
                <strong>
                  {t('UserDefineDescription.UseR9MMR9MINISBUSP1')}
                </strong>
              </p>
              <p>{t('UserDefineDescription.UseR9MMR9MINISBUSP2')}</p>
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
