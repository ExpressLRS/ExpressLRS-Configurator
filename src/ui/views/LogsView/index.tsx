import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Divider,
} from '@mui/material';
import React, { FunctionComponent } from 'react';
import ListIcon from '@mui/icons-material/List';
import { ipcRenderer } from 'electron';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
import CardTitle from '../../components/CardTitle';
import { IpcRequest } from '../../../ipc';

const styles = {
  root: {
    display: 'flex',
  },
  main: {
    marginY: 4,
  },
  content: {
    flexGrow: 1,
  },
};

const LogsView: FunctionComponent = () => {
  const onLogs = () => {
    ipcRenderer.send(IpcRequest.OpenLogsFolder);
  };
  return (
    <Box component="main" sx={styles.root}>
      <Sidebar />
      <Box sx={styles.content}>
        <Header />
        <Container sx={styles.main}>
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
      </Box>
    </Box>
  );
};

export default LogsView;
