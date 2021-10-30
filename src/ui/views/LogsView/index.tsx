import { Button, Card, CardContent, Container, Divider } from '@mui/material';
import { styled } from '@mui/material/styles';
import React, { FunctionComponent } from 'react';
import ListIcon from '@mui/icons-material/List';
import { ipcRenderer } from 'electron';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
import CardTitle from '../../components/CardTitle';
import { IpcRequest } from '../../../ipc';

const PREFIX = 'LogsView';

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

const LogsView: FunctionComponent = () => {
  const onLogs = () => {
    ipcRenderer.send(IpcRequest.OpenLogsFolder);
  };
  return (
    <Root className={classes.root}>
      <Sidebar navigationEnabled />
      <div className={classes.content}>
        <Header />
        <Container className={classes.main}>
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
    </Root>
  );
};

export default LogsView;
