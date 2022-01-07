import { Button, Card, CardContent, Divider } from '@mui/material';
import React, { FunctionComponent } from 'react';
import ListIcon from '@mui/icons-material/List';
import { ipcRenderer } from 'electron';
import CardTitle from '../../components/CardTitle';
import { IpcRequest } from '../../../ipc';
import MainLayout from '../../layouts/MainLayout';

const LogsView: FunctionComponent = () => {
  const onLogs = () => {
    ipcRenderer.send(IpcRequest.OpenLogsFolder);
  };
  return (
    <MainLayout>
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
    </MainLayout>
  );
};

export default LogsView;
