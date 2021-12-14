import React, { FunctionComponent, memo } from 'react';
import { AppBar, Box, Toolbar, Typography, IconButton } from '@mui/material';
import GitHubIcon from '@mui/icons-material/GitHub';
import FacebookIcon from '@mui/icons-material/Facebook';
import { Config } from '../../config';
import LogotypeIcon from '../../../../assets/logotype.svg';
import DiscordIcon from '../../../../assets/DiscordIcon.svg';
import { useCheckForUpdatesQuery } from '../../gql/generated/types';

const styles = {
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
  discordIcon: {
    width: '24px',
    height: 'auto',
  },
};

const Header: FunctionComponent = memo(() => {
  const { data: updateResponse } = useCheckForUpdatesQuery({
    variables: {
      currentVersion: process.env.EXPRESSLRS_CONFIGURATOR_VERSION || '0.0.1',
    },
  });
  return (
    <AppBar position="static" color="default">
      <Toolbar sx={styles.toolbar}>
        <Box sx={styles.logotype}>
          <img src={LogotypeIcon} alt="ExpressLrs Configurator" />
          <Typography variant="h4" sx={styles.title}>
            ExpressLRS Configurator{' '}
            <Box component="span" sx={styles.version}>
              v{process.env.EXPRESSLRS_CONFIGURATOR_VERSION}
            </Box>
            {updateResponse?.checkForUpdates?.updateAvailable && (
              <Box
                component="a"
                href={updateResponse?.checkForUpdates?.releaseUrl}
                target="_blank"
                title="Click to download a newest release"
                rel="noreferrer noreferrer"
                sx={styles.updateAvailable}
              >
                Update is available!
              </Box>
            )}
          </Typography>
        </Box>
        <Box sx={styles.social}>
          <Box sx={styles.link}>
            <IconButton
              href={Config.discordUrl}
              target="_blank"
              title="Discord"
              rel="noreferrer noreferrer"
              size="large"
            >
              <Box
                component="img"
                src={DiscordIcon}
                sx={styles.discordIcon}
                alt=""
              />
            </IconButton>
          </Box>
          <Box sx={styles.link}>
            <IconButton
              href={Config.facebookGroupUrl}
              target="_blank"
              title="Facebook group"
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
              title="Github"
              rel="noreferrer noreferrer"
              size="large"
            >
              <GitHubIcon />
            </IconButton>
          </Box>
        </Box>
      </Toolbar>
    </AppBar>
  );
});

export default Header;
