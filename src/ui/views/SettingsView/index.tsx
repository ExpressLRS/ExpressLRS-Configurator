import { Card, CardContent, Divider, Typography } from '@mui/material';
import React, { FunctionComponent } from 'react';
import SettingsIcon from '@mui/icons-material/Settings';
import LanguageIcon from '@mui/icons-material/Language';
import InfoIcon from '@mui/icons-material/Info';
import { useTranslation } from 'react-i18next';
import CardTitle from '../../components/CardTitle';
import MainLayout from '../../layouts/MainLayout';
import Omnibox, { Option } from '../../components/Omnibox';
import locales from '../../../i18n/locales.json';
 
const SettingsView: FunctionComponent = () => {
  const { t, i18n } = useTranslation();
  const os = require('os');
  const languages: Option[] = locales;
  const defaultLanguage = locales[0];
  const onLocaleChange = (locale: string | null) => {
    if (locale === null) {
      i18n.changeLanguage(defaultLanguage.value);
    } else {
      i18n.changeLanguage(locale);
    }
  };
  let currentLanguage: Option = defaultLanguage;
  if (i18n.resolvedLanguage !== undefined) {
    currentLanguage = {
      value: i18n.resolvedLanguage,
      label:
        languages.find((locale) => locale.value === i18n.resolvedLanguage)?.label ?? '',
    };
  }
  return (
    <MainLayout>
      <Card>
        <CardTitle icon={<SettingsIcon />} title={t('SettingsView.Settings')} />
        <Divider />
        <CardTitle icon={<LanguageIcon />} title={t('SettingsView.LanguageSelector')} />
        <CardContent style={{paddingLeft: 26, marginTop: -18}}>
          <Omnibox
            title={t('SettingsView.CurrentLanguage')}
            currentValue={currentLanguage}
            onChange={onLocaleChange}
            options={languages}
          />
        </CardContent>
        <Divider />
        <CardTitle icon={<InfoIcon />} title={t('SettingsView.SystemInfo')} />
        <CardContent style={{paddingLeft: 26, marginTop: -28}} >
          <li>{t('SettingsView.ELRSConfiguratorVersion')}: v{process.env.EXPRESSLRS_CONFIGURATOR_VERSION}</li>
          <li>{t('SettingsView.Platform')}: {process.platform} {process.getSystemVersion()} {os.arch()}</li>
          <li>{t('SettingsView.CPU')}: {os.cpus()[0].model}</li>
          <li>{t('SettingsView.RAM')}: {Math.round(os.totalmem() / 1024 / 1024)} MB</li>
        </CardContent>
      </Card>
    </MainLayout>
  );
};
 
export default SettingsView;
 