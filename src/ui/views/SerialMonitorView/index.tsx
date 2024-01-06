import { Button, Card, CardContent, Divider } from '@mui/material';
import React, { FunctionComponent, useEffect, useRef, useState } from 'react';
import DvrIcon from '@mui/icons-material/Dvr';
import { SxProps, Theme } from '@mui/system';
import { useTranslation } from 'react-i18next';
import CardTitle from '../../components/CardTitle';
import SerialConnectionForm from '../../components/SerialConnectionForm';
import EventsBatcher from '../../library/EventsBatcher';
import {
  SerialMonitorEventType,
  useConnectToSerialDeviceMutation,
  useDisconnectFromSerialDeviceMutation,
  useSerialMonitorEventsSubscription,
  useSerialMonitorLogsSubscription,
} from '../../gql/generated/types';
import Loader from '../../components/Loader';
import ShowAlerts from '../../components/ShowAlerts';
import Logs from '../../components/Logs';
import MainLayout from '../../layouts/MainLayout';

const styles: Record<string, SxProps<Theme>> = {
  disconnectButton: {
    marginBottom: 4,
  },
};

enum ViewState {
  ConnectionConfig = 'ConnectionConfig',
  LogsStream = 'LogsStream',
}

const SerialMonitorView: FunctionComponent = () => {
  const [viewState, setViewState] = useState<ViewState>(
    ViewState.ConnectionConfig
  );

  const { t } = useTranslation();

  /*
  We batch log events in order to save React.js state updates and rendering performance.
 */
  const [logs, setLogs] = useState<string>('');
  const logsRef = useRef<string[]>([]);
  const eventsBatcherRef = useRef<EventsBatcher<string> | null>(null);
  useEffect(() => {
    eventsBatcherRef.current = new EventsBatcher<string>(200);
    eventsBatcherRef.current.onBatch((newLogs) => {
      const newLogsList = [...logsRef.current, ...newLogs];
      logsRef.current = newLogsList;
      setLogs(newLogsList.join(''));
    });
  }, []);
  useSerialMonitorLogsSubscription({
    fetchPolicy: 'network-only',
    onSubscriptionData: (options) => {
      const args = options.subscriptionData.data?.serialMonitorLogs.data;
      if (args !== undefined && eventsBatcherRef.current !== null) {
        eventsBatcherRef.current.enqueue(args);
      }
    },
  });

  useSerialMonitorEventsSubscription({
    onSubscriptionData: (options) => {
      const args = options.subscriptionData.data?.serialMonitorEvents;
      if (args !== undefined) {
        if (args.type === SerialMonitorEventType.Disconnected) {
          setViewState(ViewState.ConnectionConfig);
        }
      }
    },
  });

  const [serialDevice, setSerialDevice] = useState<string | null>(null);
  const [baudRate, setBaudRate] = useState<number>(420000);
  const [
    connectToSerialDeviceMutation,
    { loading: connectInProgress, data: response, error: connectError },
  ] = useConnectToSerialDeviceMutation();
  const onConnect = (newSerialDevice: string, newBaudRate: number) => {
    setSerialDevice(newSerialDevice);
    setBaudRate(newBaudRate);
    setLogs('');
    logsRef.current = [];
    connectToSerialDeviceMutation({
      variables: {
        input: {
          port: newSerialDevice,
          baudRate: newBaudRate.toString(),
        },
      },
    })
      .then((resp) => {
        if (resp.data?.connectToSerialDevice.success) {
          setViewState(ViewState.LogsStream);
        }
      })
      .catch(() => {
        setViewState(ViewState.ConnectionConfig);
      });
  };

  const [
    disconnectFromSerialDeviceMutation,
    { loading: disconnectInProgress, error: disconnectError },
  ] = useDisconnectFromSerialDeviceMutation();
  const onDisconnect = () => {
    disconnectFromSerialDeviceMutation()
      .then((data) => {
        if (data.data?.disconnectFromSerialDevice.success) {
          setViewState(ViewState.ConnectionConfig);
        }
      })
      .catch(() => {});
  };
  return (
    <MainLayout>
      <Card>
        <CardTitle
          icon={<DvrIcon />}
          title={t('SerialMonitorView.SerialMonitor')}
        />
        <Divider />
        <CardContent>
          {viewState === ViewState.ConnectionConfig && (
            <>
              <SerialConnectionForm
                serialDevice={serialDevice}
                baudRate={baudRate}
                onConnect={onConnect}
              />
              <Loader loading={connectInProgress} />
              {response && !response.connectToSerialDevice.success && (
                <ShowAlerts
                  severity="error"
                  messages={response.connectToSerialDevice.message}
                />
              )}
              <ShowAlerts severity="error" messages={connectError} />
            </>
          )}
          <ShowAlerts severity="error" messages={disconnectError} />
          {viewState === ViewState.LogsStream && (
            <>
              <Button
                onClick={onDisconnect}
                color="secondary"
                size="large"
                variant="contained"
                sx={styles.disconnectButton}
              >
                {t('SerialMonitorView.Disconnect')}
              </Button>
              <Loader loading={disconnectInProgress} />
              <Logs data={logs} />
            </>
          )}
        </CardContent>
      </Card>
    </MainLayout>
  );
};

export default SerialMonitorView;
