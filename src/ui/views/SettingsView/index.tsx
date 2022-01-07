import { Card, CardContent, Divider, Typography } from '@mui/material';
import React, { FunctionComponent } from 'react';
import SettingsIcon from '@mui/icons-material/Settings';
import CardTitle from '../../components/CardTitle';
import MainLayout from '../../layouts/MainLayout';

const SettingsView: FunctionComponent = () => {
  return (
    <MainLayout>
      <Card>
        <CardTitle icon={<SettingsIcon />} title="Settings" />
        <Divider />
        <CardContent>
          <Typography variant="h6">Todo:</Typography>
          <ul>
            <li>Display configurator version</li>
            <li>Language selector</li>
          </ul>
        </CardContent>
      </Card>
    </MainLayout>
  );
};

export default SettingsView;
