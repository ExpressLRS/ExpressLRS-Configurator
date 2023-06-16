import { Button, Card, CardContent, Divider } from '@mui/material';
import React, { FunctionComponent } from 'react';
import SettingsIcon from '@mui/icons-material/Settings';
import { SxProps, Theme } from '@mui/system';
import { useTranslation } from 'react-i18next';
import CardTitle from '../../components/CardTitle';
import ClearPlatformioDependencies from './Troubleshooting/ClearPlatformioDependencies';
import ClearFirmwareFiles from './Troubleshooting/ClearFirmwareFiles';
import MainLayout from '../../layouts/MainLayout';

const styles: Record<string, SxProps<Theme>> = {
  listContainer: {
    '& .linksList': {
      paddingLeft: 0,
      marginBottom: 0,
      '& > li': {
        display: 'inline-block',
        listStyleType: 'none',
        marginBottom: 3,
        marginRight: 2,
      },
    },
  },
};

const SupportView: FunctionComponent = () => {
  const { t } = useTranslation();

  return (
    <MainLayout>
      <Card>
        <CardTitle icon={<SettingsIcon />} title={t('SupportView.Support')} />
        <Divider />
        <CardContent sx={styles.listContainer}>
          <p>{t('SupportView.JoinTheCommunity')}</p>
          <ul className="linksList">
            <li>
              <Button
                target="_blank"
                variant="contained"
                rel="noreferrer noreferrer"
                href="https://www.expresslrs.org/"
              >
                {t('SupportView.ExpressLRSDocumentation')}
              </Button>
            </li>
            <li>
              <Button
                target="_blank"
                variant="contained"
                rel="noreferrer noreferrer"
                href="https://discord.gg/dS6ReFY"
              >
                {t('SupportView.DiscordChat')}
              </Button>
            </li>
            <li>
              <Button
                target="_blank"
                variant="contained"
                rel="noreferrer noreferrer"
                href="https://www.facebook.com/groups/636441730280366"
              >
                {t('SupportView.FacebookGroup')}
              </Button>
            </li>
          </ul>
        </CardContent>
        <Divider />
        <CardTitle
          icon={<SettingsIcon />}
          title={t('SupportView.Troubleshooting')}
        />
        <Divider />
        <CardContent>
          <ClearPlatformioDependencies />
          <ClearFirmwareFiles />
        </CardContent>
        <Divider />
        <CardTitle
          icon={<SettingsIcon />}
          title={t('SupportView.LegalDisclaimer')}
        />
        <Divider />
        <CardContent>
          <p>{t('SupportView.UseAtYourOwnRisk')}</p>
        </CardContent>
      </Card>
    </MainLayout>
  );
};

export default SupportView;
