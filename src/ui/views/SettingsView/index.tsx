import {
  Card,
  CardContent,
  Container,
  Divider,
  makeStyles,
  Typography,
} from '@material-ui/core';
import React, { FunctionComponent } from 'react';
import SettingsIcon from '@material-ui/icons/Settings';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
import CardTitle from '../../components/CardTitle';

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
}));

const SettingsView: FunctionComponent = () => {
  const styles = useStyles();
  return (
    <main className={styles.root}>
      <Sidebar navigationEnabled />
      <div className={styles.content}>
        <Header />
        <Container className={styles.main}>
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
    </main>
  );
};

export default SettingsView;
