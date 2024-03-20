import { Box, Button, Card, CardContent, Divider } from '@mui/material';
import React, { FunctionComponent, useState, useEffect } from 'react';
import ListIcon from '@mui/icons-material/List';
import { useTranslation } from 'react-i18next';
import Loader from '../../components/Loader';
import CardTitle from '../../components/CardTitle';
import { IpcRequest } from '../../../ipc';
import { useLogFileLazyQuery, LogEntry } from '../../gql/generated/types';
import MainLayout from '../../layouts/MainLayout';
import LogsViewEntry from './logsViewEntry';

const LogsView: FunctionComponent = () => {
  const { t } = useTranslation();
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [
    fetchLogs,
    {
      data: fetchLogsData,
      loading: fetchLogsDataLoading,
      error: fetchLogsDataError,
    },
  ] = useLogFileLazyQuery({ fetchPolicy: 'network-only' });

  const onLogs = () => {
    window.electron.ipcRenderer.sendMessage(IpcRequest.OpenLogsFolder);
  };

  useEffect(() => {
    fetchLogs({ variables: { numberOfLines: 500 } });
  }, [fetchLogs]);

  useEffect(() => {
    setLogs((fetchLogsData?.logFile?.content as LogEntry[]) || []);
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
            logs.map((log: LogEntry, idx: number) => (
              <LogsViewEntry key={idx} logEntry={log} />
            ))}
        </CardContent>
      </Card>
    </MainLayout>
  );
};

export default LogsView;
