import { Card, CardContent, Divider, Typography, Button } from '@mui/material';
import React, { FunctionComponent } from 'react';
import SettingsIcon from '@mui/icons-material/Settings';
import { useTranslation } from 'react-i18next';
import CardTitle from '../../components/CardTitle';
import MainLayout from '../../layouts/MainLayout';

const locales = {
  "en": "English" ,
  "zh-CN": "简体中文",
};

const SettingsView: FunctionComponent = () => {
  const { t, i18n } = useTranslation();
  
  return (
    <MainLayout>
      <Card>
        <CardTitle 
          icon={<SettingsIcon />} 
          title={t('SettingsView.Settings')} 
        />
        <Divider />
        <CardContent>
          <Typography variant="h6">{t('SettingsView.LanguageSelector')}</Typography>
          <ul>
            {Object.keys(locales).map((locale) => (
              <Button
                sx = {{ marginRight: 2}}
                size="large"
                variant="contained"
                onClick={() => i18n.changeLanguage(locale)}
              >
                {locales[locale] + (i18n.resolvedLanguage === locale ? '(✓)' : '')}
              </Button>
            ))}
          </ul>
          <Typography variant="h6">{t('SettingsView.ConfiguratorVersion')}</Typography>
          <ul>
              <li>v{process.env.EXPRESSLRS_CONFIGURATOR_VERSION}</li>
          </ul>
        </CardContent>
      </Card>
    </MainLayout>
  );
};

export default SettingsView;
