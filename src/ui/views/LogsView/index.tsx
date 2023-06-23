import {
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  Typography,
} from '@mui/material';
import React, { FunctionComponent, useState, useEffect } from 'react';
import ListIcon from '@mui/icons-material/List';
import { ipcRenderer } from 'electron';
import { useTranslation } from 'react-i18next';
import Loader from '../../components/Loader';
import CardTitle from '../../components/CardTitle';
import { IpcRequest } from '../../../ipc';
import MainLayout from '../../layouts/MainLayout';
import theme from '../../theme';

type Log = {
  level: string;
  message: string;
  timestamp: string;
  context?: object;
};

const LogEntryContext = (context: object) => {
  const contextContent: { key: string; value: string | object }[] = [];
  Object.entries(context).map(([key, value]) =>
    contextContent.push({ key, value })
  );
  return (
    <Box>
      {contextContent.map((c) => (
        <Box key={c.key} overflow="hidden">
          <Typography variant="body2" component="span" pr={1}>
            {c.key}:
          </Typography>
          <Typography variant="body2" component="span">
            {typeof c.value === 'object' ? JSON.stringify(c.value) : c.value}
          </Typography>
        </Box>
      ))}
    </Box>
  );
};

const LogEntry: FunctionComponent<Log> = ({
  level,
  message,
  timestamp,
  context,
}: Log) => {
  const levelLabelColor = (lvl: string): string => {
    switch (lvl) {
      case 'error':
        return theme.palette.error.main;
      default:
        return theme.palette.primary.main;
    }
  };
  return (
    <Box>
      <Box display="flex">
        <Typography mr={1} color={theme.palette.info.main}>
          [
          {Intl.DateTimeFormat('en-US', {
            dateStyle: 'short',
            timeStyle: 'medium',
          }).format(new Date(timestamp))}
          ]
        </Typography>
        <Typography mr={1} color={levelLabelColor(level)}>
          [{level.toUpperCase()}]
        </Typography>
        <Typography>{message}</Typography>
      </Box>
      {context && <LogEntryContext {...context} />}
    </Box>
  );
};

const LogsView: FunctionComponent = () => {
  const [logs, setLogs] = useState<Log[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const { t } = useTranslation();
  const onLogs = () => {
    ipcRenderer.send(IpcRequest.OpenLogsFolder);
  };

  useEffect(() => {
    ipcRenderer
      .invoke(IpcRequest.LoadLogFile, 20)
      .then((lines) => {
        const linesList = lines
          .split(/\r?\n/)
          .filter((line: string) => line !== '')
          .flatMap((line: string) => {
            let logEntry: Log;
            try {
              logEntry = JSON.parse(line) as Log;
            } catch (e) {
              return [];
            }
            return logEntry;
          });
        setLoading(false);
        setLogs(linesList);
      })
      .catch((e) => console.error('failed to read log file', e));
  }, []);

  return (
    <MainLayout>
      <Card>
        <CardTitle icon={<ListIcon />} title={t('LogsView.Logs')} />
        <Divider />
        <CardContent>
          <Box mb={1} display="flex" justifyContent="end">
            <Button
              color="primary"
              size="large"
              variant="contained"
              onClick={onLogs}
            >
              {t('LogsView.OpenLogsFolder')}
            </Button>
          </Box>
          <Loader loading={loading} />
          {logs.map((log: Log, idx: number) => (
            <LogEntry key={idx} {...log} />
          ))}
        </CardContent>
      </Card>
    </MainLayout>
  );
};

export default LogsView;
