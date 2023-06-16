import { Card, CardContent, Divider, Typography } from '@mui/material';
import React, { FunctionComponent } from 'react';
import SettingsIcon from '@mui/icons-material/Settings';
import { useTranslation } from 'react-i18next';
import CardTitle from '../../components/CardTitle';
import MainLayout from '../../layouts/MainLayout';

const SettingsView: FunctionComponent = () => {
  const { t } = useTranslation();
  return (
    <MainLayout>
      <Card>
        <CardTitle icon={<SettingsIcon />} title="Settings" />
        <Divider />
        <CardContent>
          <Typography variant="h6">Todo:</Typography>
          <ul>
            <li>{t('SettingsView.DisplayConfiguratorVersion')}</li>
            <li>{t('SettingsView.LanguageSelector')}</li>
          </ul>
        </CardContent>
      </Card>
    </MainLayout>
  );
};

export default SettingsView;
