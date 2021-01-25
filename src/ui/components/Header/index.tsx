import React, { FunctionComponent, memo } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  makeStyles,
  IconButton,
} from '@material-ui/core';
import GitHubIcon from '@material-ui/icons/GitHub';
import LogotypeIcon from '../../../../assets/logotype.svg';
import { Config } from '../../../config';

const useStyles = makeStyles((theme) => ({
  title: {
    fontSize: theme.typography.h4.fontSize,
    lineHeight: theme.typography.h4.fontSize,
  },
  logotype: {
    display: 'flex',
    justifyContent: 'flex-start',
  },
  logotypeIcon: {
    marginRight: 12,
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
    margin: '0 0 0 10px',
  },
}));

interface HeaderProps {
  className?: string;
}

const Header: FunctionComponent<HeaderProps> = memo(({ className }) => {
  const classes = useStyles();
  return (
    <AppBar position="static" color="default" className={className}>
      <Toolbar className={classes.toolbar}>
        <div className={classes.logotype}>
          <img
            src={LogotypeIcon}
            className={classes.logotypeIcon}
            alt="ExpressLrs Configurator"
          />
          <Typography variant="h4" className={classes.title}>
            ExpressLRS Configurator
          </Typography>
        </div>
        <div className={classes.social}>
          <div className={classes.link}>
            <IconButton href={Config.git.url} target="_blank" rel="noreferrer">
              <GitHubIcon />
            </IconButton>
          </div>
        </div>
      </Toolbar>
    </AppBar>
  );
});

export default Header;
