import {
  Card,
  CardContent,
  Container,
  Divider,
  Typography,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import React, { FunctionComponent } from 'react';
import SettingsIcon from '@mui/icons-material/Settings';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
import CardTitle from '../../components/CardTitle';

const PREFIX = 'SettingsView';

const classes = {
  root: `${PREFIX}-root`,
  main: `${PREFIX}-main`,
  content: `${PREFIX}-content`,
};

const Root = styled('main')(({ theme }) => ({
  [`&.${classes.root}`]: {
    display: 'flex',
  },

  [`& .${classes.main}`]: {
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(4),
  },

  [`& .${classes.content}`]: {
    flexGrow: 1,
  },
}));

const SettingsView: FunctionComponent = () => {
  return (
    <Root className={classes.root}>
      <Sidebar navigationEnabled />
      <div className={classes.content}>
        <Header />
        <Container className={classes.main}>
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
        </Container>
      </div>
    </Root>
  );
};

export default SettingsView;
