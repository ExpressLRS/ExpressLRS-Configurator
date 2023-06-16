import React, { FunctionComponent, memo } from 'react';
import { AppBar, Box, Toolbar, Typography, IconButton } from '@mui/material';
import GitHubIcon from '@mui/icons-material/GitHub';
import FacebookIcon from '@mui/icons-material/Facebook';
import WebIcon from '@mui/icons-material/Web';
import { SxProps, Theme } from '@mui/system';
import { useTranslation } from 'react-i18next';
import { Config } from '../../config';
import LogotypeIcon from '../../../../assets/logotype.svg';
import DiscordIcon from '../../../../assets/DiscordIcon.svg';
import OpenCollectiveIcon from '../../../../assets/OpenCollective.svg';
import { useCheckForUpdatesQuery } from '../../gql/generated/types';

const styles: Record<string, SxProps<Theme>> = {
  title: {
    fontSize: 'theme.typography.h4.fontSize',
    lineHeight: 'theme.typography.h4.fontSize',
  },
  logotype: {
    display: 'flex',
    justifyContent: 'flex-start',
    ' & img': {
      marginRight: 1,
    },
  },
  version: {
    fontSize: '0.4em',
  },
  updateAvailable: {
    fontSize: '0.4em',
    marginLeft: '0.4em',
    color: 'rgb(52 216 52) !important',
  },
  toolbar: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  social: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
  link: {
    margin: '0 0 0 0',
  },
  facebookIcon: {
    fontSize: '1em !important',
    marginTop: '-2px',
  },
  svgIcon: {
    width: '24px',
    height: 'auto',
  },
};

const Header: FunctionComponent = memo(() => {
  const { t } = useTranslation();

  const { data: updateResponse } = useCheckForUpdatesQuery({
    variables: {
      currentVersion: process.env.EXPRESSLRS_CONFIGURATOR_VERSION || '0.0.1',
    },
  });
  return (
    <AppBar position="static" color="default">
      <Toolbar sx={styles.toolbar}>
        <Box sx={styles.logotype}>
          <img src={LogotypeIcon} alt={t('Header.ExpressLrsConfigurator')} />
          <Typography variant="h4" sx={styles.title}>
            {process.env.EXPRESSLRS_CONFIGURATOR_TITLE}{' '}
            <Box component="span" sx={styles.version}>
              v{process.env.EXPRESSLRS_CONFIGURATOR_VERSION}
            </Box>
            {updateResponse?.checkForUpdates?.updateAvailable && (
              <Box
                component="a"
                href={updateResponse?.checkForUpdates?.releaseUrl}
                target="_blank"
                title={t('Header.DownloadNewestRelease')}
                rel="noreferrer noreferrer"
                sx={styles.updateAvailable}
              >
                {t('Header.UpdateAvailable')}
              </Box>
            )}
          </Typography>
        </Box>
        <Box sx={styles.social}>
          <Box sx={styles.link}>
            <IconButton
              href={Config.documentationUrl}
              target="_blank"
              title={t('Header.Documentation')}
              rel="noreferrer noreferrer"
              size="large"
            >
              <WebIcon sx={styles.svgIcon} />
            </IconButton>
          </Box>
          <Box sx={styles.link}>
            <IconButton
              href={Config.discordUrl}
              target="_blank"
              title={t('Header.Discord')}
              rel="noreferrer noreferrer"
              size="large"
            >
              <Box
                component="img"
                src={DiscordIcon}
                sx={styles.svgIcon}
                alt=""
              />
            </IconButton>
          </Box>
          <Box sx={styles.link}>
            <IconButton
              href={Config.facebookGroupUrl}
              target="_blank"
              title={t('Header.FacebookGroup')}
              rel="noreferrer noreferrer"
              size="large"
            >
              <FacebookIcon sx={styles.facebookIcon} />
            </IconButton>
          </Box>
          <Box sx={styles.link}>
            <IconButton
              href={Config.githubRepositoryUrl}
              target="_blank"
              title={t('Header.Github')}
              rel="noreferrer noreferrer"
              size="large"
            >
              <GitHubIcon />
            </IconButton>
          </Box>
          <Box sx={styles.link}>
            <IconButton
              href={Config.openCollectiveUrl}
              target="_blank"
              title={t('Header.OpenCollective')}
              rel="noreferrer noreferrer"
              size="large"
            >
              <Box
                component="img"
                src={OpenCollectiveIcon}
                sx={styles.svgIcon}
                alt=""
              />
            </IconButton>
          </Box>
        </Box>
      </Toolbar>
    </AppBar>
  );
});

export default Header;
