import { Button, Card, CardContent, Container, Divider } from '@mui/material';
import { styled } from '@mui/material/styles';
import React, { FunctionComponent } from 'react';
import SettingsIcon from '@mui/icons-material/Settings';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
import CardTitle from '../../components/CardTitle';
import ClearPlatformioDependencies from './Troubleshooting/ClearPlatformioDependencies';
import ClearFirmwareFiles from './Troubleshooting/ClearFirmwareFiles';

const PREFIX = 'SupportView';

const classes = {
  root: `${PREFIX}-root`,
  main: `${PREFIX}-main`,
  content: `${PREFIX}-content`,
  linksList: `${PREFIX}-linksList`,
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

  [`& .${classes.linksList}`]: {
    paddingLeft: 0,
    marginBottom: 0,
    '& > li': {
      display: 'inline-block',
      listStyleType: 'none',
      marginBottom: theme.spacing(3),
      marginRight: theme.spacing(2),
    },
  },
}));

const SupportView: FunctionComponent = () => {
  return (
    <Root className={classes.root}>
      <Sidebar navigationEnabled />
      <div className={classes.content}>
        <Header />
        <Container className={classes.main}>
          <Card>
            <CardTitle icon={<SettingsIcon />} title="Support" />
            <Divider />
            <CardContent>
              <p>Need help? Confused? Join the Community!</p>
              <ul className={classes.linksList}>
                <li>
                  <Button
                    target="_blank"
                    variant="contained"
                    rel="noreferrer noreferrer"
                    href="https://github.com/ExpressLRS/ExpressLRS/wiki"
                  >
                    ExpressLRS Wiki
                  </Button>
                </li>
                <li>
                  <Button
                    target="_blank"
                    variant="contained"
                    rel="noreferrer noreferrer"
                    href="https://discord.gg/dS6ReFY"
                  >
                    Discord Chat
                  </Button>
                </li>
                <li>
                  <Button
                    target="_blank"
                    variant="contained"
                    rel="noreferrer noreferrer"
                    href="https://www.facebook.com/groups/636441730280366"
                  >
                    Facebook Group
                  </Button>
                </li>
              </ul>
            </CardContent>
            <Divider />
            <CardTitle icon={<SettingsIcon />} title="Troubleshooting" />
            <Divider />
            <CardContent>
              <ClearPlatformioDependencies />
              <ClearFirmwareFiles />
            </CardContent>
            <Divider />
            <CardTitle icon={<SettingsIcon />} title="Legal disclaimer" />
            <Divider />
            <CardContent>
              <p>
                The use and operation of this type of device may require a
                license, and some countries may forbid its use. It is entirely
                up to the end user to ensure compliance with local regulations.
                This is experimental software / hardware and there is no
                guarantee of stability or reliability. USE AT YOUR OWN RISK.
              </p>
            </CardContent>
          </Card>
        </Container>
      </div>
    </Root>
  );
};

export default SupportView;
