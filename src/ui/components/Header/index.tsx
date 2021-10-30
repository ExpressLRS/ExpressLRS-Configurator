import React, { FunctionComponent, memo } from 'react';
import { styled } from '@mui/material/styles';
import { AppBar, Toolbar, Typography, IconButton } from '@mui/material';
import GitHubIcon from '@mui/icons-material/GitHub';
import FacebookIcon from '@mui/icons-material/Facebook';
import { Config } from '../../config';
import LogotypeIcon from '../../../../assets/logotype.svg';
import DiscordIcon from '../../../../assets/DiscordIcon.svg';
import { useCheckForUpdatesQuery } from '../../gql/generated/types';

const PREFIX = 'Header';

const classes = {
  title: `${PREFIX}-title`,
  logotype: `${PREFIX}-logotype`,
  logotypeIcon: `${PREFIX}-logotypeIcon`,
  version: `${PREFIX}-version`,
  updateAvailable: `${PREFIX}-updateAvailable`,
  toolbar: `${PREFIX}-toolbar`,
  social: `${PREFIX}-social`,
  link: `${PREFIX}-link`,
  facebookIcon: `${PREFIX}-facebookIcon`,
  discordIcon: `${PREFIX}-discordIcon`,
};

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  [`& .${classes.title}`]: {
    fontSize: theme.typography.h4.fontSize,
    lineHeight: theme.typography.h4.fontSize,
  },

  [`& .${classes.logotype}`]: {
    display: 'flex',
    justifyContent: 'flex-start',
  },

  [`& .${classes.logotypeIcon}`]: {
    marginRight: 12,
  },

  [`& .${classes.version}`]: {
    fontSize: '0.4em',
  },

  [`& .${classes.updateAvailable}`]: {
    fontSize: '0.4em',
    marginLeft: '0.4em',
    color: 'rgb(52 216 52) !important',
  },

  [`& .${classes.toolbar}`]: {
    display: 'flex',
    justifyContent: 'space-between',
  },

  [`& .${classes.social}`]: {
    display: 'flex',
    justifyContent: 'flex-end',
  },

  [`& .${classes.link}`]: {
    margin: '0 0 0 10px',
  },

  [`& .${classes.facebookIcon}`]: {
    fontSize: '1.2em !important',
    marginTop: '-2px',
  },

  [`& .${classes.discordIcon}`]: {
    width: '24px',
    height: 'auto',
  },
}));

interface HeaderProps {
  className?: string;
}

const Header: FunctionComponent<HeaderProps> = memo(({ className }) => {
  const { data: updateResponse } = useCheckForUpdatesQuery({
    variables: {
      currentVersion: process.env.EXPRESSLRS_CONFIGURATOR_VERSION || '0.0.1',
    },
  });
  return (
    <StyledAppBar position="static" color="default" className={className}>
      <Toolbar className={classes.toolbar}>
        <div className={classes.logotype}>
          <img
            src={LogotypeIcon}
            className={classes.logotypeIcon}
            alt="ExpressLrs Configurator"
          />
          <Typography variant="h4" className={classes.title}>
            ExpressLRS Configurator{' '}
            <span className={classes.version}>
              v{process.env.EXPRESSLRS_CONFIGURATOR_VERSION}
            </span>
            {updateResponse?.checkForUpdates?.updateAvailable && (
              <a
                href={updateResponse?.checkForUpdates?.releaseUrl}
                target="_blank"
                title="Click to download a newest release"
                rel="noreferrer noreferrer"
                className={classes.updateAvailable}
              >
                Update is available!
              </a>
            )}
          </Typography>
        </div>
        <div className={classes.social}>
          <div className={classes.link}>
            <IconButton
              href={Config.discordUrl}
              target="_blank"
              title="Discord"
              rel="noreferrer noreferrer"
              size="large"
            >
              <img src={DiscordIcon} className={classes.discordIcon} alt="" />
            </IconButton>
          </div>
          <div className={classes.link}>
            <IconButton
              href={Config.facebookGroupUrl}
              target="_blank"
              title="Facebook group"
              rel="noreferrer noreferrer"
              size="large"
            >
              <FacebookIcon className={classes.facebookIcon} />
            </IconButton>
          </div>
          <div className={classes.link}>
            <IconButton
              href={Config.githubRepositoryUrl}
              target="_blank"
              title="Github"
              rel="noreferrer noreferrer"
              size="large"
            >
              <GitHubIcon />
            </IconButton>
          </div>
        </div>
      </Toolbar>
    </StyledAppBar>
  );
});

export default Header;
