import {
  Button,
  Card,
  CardContent,
  Container,
  Divider,
  makeStyles,
} from '@material-ui/core';
import React, { FunctionComponent } from 'react';
import ListIcon from '@material-ui/icons/List';
import { ipcRenderer } from 'electron';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
import CardTitle from '../../components/CardTitle';
import { IpcRequest } from '../../../ipc';

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

const LogsView: FunctionComponent = () => {
  const styles = useStyles();
  const onLogs = () => {
    ipcRenderer.send(IpcRequest.OpenLogsFolder);
  };
  return (
    <main className={styles.root}>
      <Sidebar />
      <div className={styles.content}>
        <Header />
        <Container className={styles.main}>
          <Card>
            <CardTitle icon={<ListIcon />} title="Logs" />
            <Divider />
            <CardContent>
              <Button
                color="primary"
                size="large"
                variant="contained"
                onClick={onLogs}
              >
                Open logs folder
              </Button>
            </CardContent>
          </Card>
        </Container>
      </div>
    </main>
  );
};

export default LogsView;
