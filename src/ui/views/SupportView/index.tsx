import {
  Button,
  Card,
  CardContent,
  Container,
  Divider,
  makeStyles,
} from '@material-ui/core';
import React, { FunctionComponent } from 'react';
import SettingsIcon from '@material-ui/icons/Settings';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
import CardTitle from '../../components/CardTitle';
import ClearPlatformioDependencies from './Troubleshooting/ClearPlatformioDependencies';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  main: {
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(4),
  },
  content: {
    flexGrow: 1,
  },
  linksList: {
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
  const styles = useStyles();
  return (
    <main className={styles.root}>
      <Sidebar navigationEnabled />
      <div className={styles.content}>
        <Header />
        <Container className={styles.main}>
          <Card>
            <CardTitle icon={<SettingsIcon />} title="Support" />
            <Divider />
            <CardContent>
              <p>Need help? Confused? Join the Community!</p>
              <ul className={styles.linksList}>
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
    </main>
  );
};

export default SupportView;
