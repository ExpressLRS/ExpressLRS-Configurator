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
import { useLogFileLazyQuery } from '../../gql/generated/types';
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
  const { t } = useTranslation();
  const [logs, setLogs] = useState<Log[]>([]);
  const [
    fetchLogs,
    {
      data: fetchLogsData,
      loading: fetchLogsDataLoading,
      error: fetchLogsDataError,
    },
  ] = useLogFileLazyQuery({ fetchPolicy: 'network-only' });

  const onLogs = () => {
    ipcRenderer.send(IpcRequest.OpenLogsFolder);
  };

  useEffect(() => {
    fetchLogs({ variables: { numberOfLines: 20 } });
  }, [fetchLogs]);

  useEffect(() => {
    if (fetchLogsData?.logFile?.content) {
      const linesList = fetchLogsData.logFile.content
        ?.split(/\r?\n/)
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
      setLogs(linesList);
    } else {
      setLogs([]);
    }
  }, [fetchLogsData]);

  return (
    <MainLayout>
      <Card>
        <CardTitle icon={<ListIcon />} title={t('LogsView.Logs')} />
        <Divider />
        <CardContent>
          <Loader loading={fetchLogsDataLoading} />
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
          {!fetchLogsDataLoading &&
            !fetchLogsDataError &&
            logs.map((log: Log, idx: number) => (
              <LogEntry key={idx} {...log} />
            ))}
        </CardContent>
      </Card>
    </MainLayout>
  );
};

export default LogsView;
