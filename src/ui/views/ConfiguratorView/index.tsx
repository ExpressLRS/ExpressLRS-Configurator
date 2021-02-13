import React, { FunctionComponent, useEffect, useRef, useState } from 'react';
import {
  Button,
  Card,
  CardContent,
  Container,
  Divider,
  makeStyles,
} from '@material-ui/core';
import SettingsIcon from '@material-ui/icons/Settings';
import { ipcRenderer } from 'electron';
import Header from '../../components/Header';
import FirmwareVersionForm from '../../components/FirmwareVersionForm';
import DeviceTargetForm from '../../components/DeviceTargetForm';
import DeviceOptionsForm, {
  DeviceOptionsFormData,
} from '../../components/DeviceOptionsForm';
import Sidebar from '../../components/Sidebar';
import ShowAlerts from '../../components/ShowAlerts';
import CardTitle from '../../components/CardTitle';
import EventsBatcher from '../../library/EventsBatcher';
import Logs from '../../components/Logs';
import BuildProgressBar from '../../components/BuildProgressBar';
import BuildNotificationsList from '../../components/BuildNotificationsList';
import {
  BuildFlashFirmwareInput,
  BuildJobType,
  BuildProgressNotification,
  DeviceTarget,
  FirmwareSource,
  FirmwareVersionDataInput,
  useBuildFlashFirmwareMutation,
  useBuildLogUpdatesSubscription,
  useBuildProgressNotificationsSubscription,
  UserDefinesMode,
  useTargetDeviceOptionsLazyQuery,
} from '../../gql/generated/types';
import Loader from '../../components/Loader';
import BuildResponse from '../../components/BuildResponse';
import { IpcRequest, OpenFileLocationRequestBody } from '../../../ipc';
import UserDefinesValidator from './UserDefinesValidator';

export const validateFirmwareVersionData = (
  data: FirmwareVersionDataInput
): Error[] => {
  const errors: Error[] = [];
  switch (data.source) {
    case FirmwareSource.Local:
      if (!(data.localPath && data.localPath.length > 0)) {
        errors.push(new Error('Local path is empty'));
      }
      break;
    case FirmwareSource.GitCommit:
      if (!(data.gitCommit && data.gitCommit.length > 0)) {
        errors.push(new Error('Git commit hash is empty'));
      }
      break;
    case FirmwareSource.GitBranch:
      if (!(data.gitBranch && data.gitBranch.length > 0)) {
        errors.push(new Error('Git branch is not selected'));
      }
      break;
    case FirmwareSource.GitTag:
      if (!(data.gitTag && data.gitTag.length > 0)) {
        errors.push(new Error('Firmware release is not selected'));
      }
      break;
    default:
      throw new Error(`unknown firmware data source: ${data.source}`);
  }
  return errors;
};

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
  button: {
    marginRight: `${theme.spacing(2)} !important`,
  },
}));

enum ViewState {
  Configuration = 'CONFIGURATION',
  Compiling = 'https://xkcd.com/303/',
}

const ConfiguratorView: FunctionComponent = () => {
  const styles = useStyles();

  const [viewState, setViewState] = useState<ViewState>(
    ViewState.Configuration
  );

  const [progressNotifications, setProgressNotifications] = useState<
    BuildProgressNotification[]
  >([]);
  const progressNotificationsRef = useRef<BuildProgressNotification[]>([]);
  const [
    lastProgressNotification,
    setLastProgressNotification,
  ] = useState<BuildProgressNotification | null>(null);

  useBuildProgressNotificationsSubscription({
    onSubscriptionData: (options) => {
      const args = options.subscriptionData.data?.buildProgressNotifications;
      if (args !== undefined) {
        const newNotificationsList = [
          ...progressNotificationsRef.current,
          args,
        ];
        progressNotificationsRef.current = newNotificationsList;
        setProgressNotifications(newNotificationsList);
        setLastProgressNotification(args);
      }
    },
  });

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
  useBuildLogUpdatesSubscription({
    fetchPolicy: 'network-only',
    onSubscriptionData: (options) => {
      const args = options.subscriptionData.data?.buildLogUpdates.data;
      if (args !== undefined && eventsBatcherRef.current !== null) {
        eventsBatcherRef.current.enqueue(args);
      }
    },
  });

  const [
    firmwareVersionData,
    setFirmwareVersionData,
  ] = useState<FirmwareVersionDataInput | null>(null);
  const [firmwareVersionErrors, setFirmwareVersionErrors] = useState<Error[]>(
    []
  );
  const onFirmwareVersionData = (data: FirmwareVersionDataInput) => {
    setFirmwareVersionErrors([]);
    setFirmwareVersionData(data);
  };

  const [deviceTarget, setDeviceTarget] = useState<DeviceTarget | null>(null);
  const [deviceTargetErrors, setDeviceTargetErrors] = useState<Error[]>([]);
  const onDeviceTarget = (data: DeviceTarget) => {
    setDeviceTargetErrors([]);
    setDeviceTarget(data);
  };

  const [
    deviceOptionsFormData,
    setDeviceOptionsFormData,
  ] = useState<DeviceOptionsFormData>({
    userDefinesTxt: '',
    userDefinesMode: UserDefinesMode.UserInterface,
    userDefineOptions: [],
  });
  const [
    fetchOptions,
    {
      loading: loadingOptions,
      data: deviceOptionsResponse,
      error: deviceOptionsResponseError,
    },
  ] = useTargetDeviceOptionsLazyQuery();

  useEffect(() => {
    if (deviceTarget === null) {
      setDeviceOptionsFormData({
        userDefinesTxt: '',
        userDefinesMode: UserDefinesMode.UserInterface,
        userDefineOptions: [],
      });
    } else {
      setDeviceOptionsFormData({
        ...deviceOptionsFormData,
        userDefineOptions: [],
      });
      fetchOptions({
        variables: {
          target: deviceTarget,
        },
      });
    }
  }, [deviceTarget]);

  useEffect(() => {
    if (
      deviceOptionsResponse?.targetDeviceOptions?.length &&
      deviceOptionsResponse?.targetDeviceOptions?.length > 0
    ) {
      setDeviceOptionsFormData({
        ...deviceOptionsFormData,
        userDefineOptions: [...deviceOptionsResponse?.targetDeviceOptions],
      });
    }
  }, [deviceOptionsResponse]);

  const onUserDefines = (data: DeviceOptionsFormData) => {
    setDeviceOptionsFormData(data);
  };

  const [
    buildFlashFirmwareMutation,
    {
      loading: buildInProgress,
      data: response,
      error: buildFlashErrorResponse,
    },
  ] = useBuildFlashFirmwareMutation();

  useEffect(() => {
    const arg = response?.buildFlashFirmware?.firmwareBinPath;
    if (arg !== undefined && arg !== null && arg?.length > 0) {
      const body: OpenFileLocationRequestBody = {
        path: arg,
      };
      ipcRenderer.send(IpcRequest.OpenFileLocation, body);
    }
  }, [response]);

  const reset = () => {
    logsRef.current = [];
    progressNotificationsRef.current = [];
    setLogs('');
    setFirmwareVersionErrors([]);
    setDeviceTargetErrors([]);

    setProgressNotifications([]);
    setLastProgressNotification(null);
  };

  const onBack = () => {
    reset();
    setViewState(ViewState.Configuration);
  };

  const [
    deviceOptionsValidationErrors,
    setDeviceOptionsValidationErrors,
  ] = useState<Error[] | null>(null);
  const [currentJobType, setCurrentJobType] = useState<BuildJobType>(
    BuildJobType.Build
  );
  const sendJob = (type: BuildJobType) => {
    reset();
    setCurrentJobType(type);

    // Validate firmware source
    if (firmwareVersionData === null) {
      setFirmwareVersionErrors([new Error('Please select firmware source')]);
      return;
    }
    const sourceErrors = validateFirmwareVersionData(firmwareVersionData);
    if (sourceErrors.length > 0) {
      setFirmwareVersionErrors(sourceErrors);
      return;
    }

    // Validate device target
    if (deviceTarget === null) {
      setDeviceTargetErrors([new Error('Please select a device target')]);
      return;
    }

    // Validate device options
    if (deviceOptionsFormData === null) {
      setDeviceTargetErrors([
        new Error('Please configure your device options'),
      ]);
      return;
    }

    switch (deviceOptionsFormData.userDefinesMode) {
      case UserDefinesMode.Manual:
        break;
      case UserDefinesMode.UserInterface:
        const errs = new UserDefinesValidator().validate(
          deviceOptionsFormData.userDefineOptions
        );
        if (errs.length > 0) {
          setDeviceOptionsValidationErrors(errs);
          return;
        }
        break;
      default:
        break;
    }

    const input: BuildFlashFirmwareInput = {
      type,
      firmware: firmwareVersionData,
      target: deviceTarget,
      userDefinesTxt: deviceOptionsFormData.userDefinesTxt,
      userDefinesMode: deviceOptionsFormData.userDefinesMode,
      userDefines: deviceOptionsFormData.userDefineOptions.map((item) => ({
        key: item.key,
        value: item.value,
        enabled: item.enabled,
        enumValues: item.enumValues,
        type: item.type,
      })),
    };
    buildFlashFirmwareMutation({
      variables: {
        input,
      },
    });
    setViewState(ViewState.Compiling);
  };

  const onBuild = () => sendJob(BuildJobType.Build);
  const onBuildAndFlash = () => sendJob(BuildJobType.BuildAndFlash);

  return (
    <main className={styles.root}>
      <Sidebar />
      <div className={styles.content}>
        <Header />
        <Container className={styles.main}>
          {viewState === ViewState.Configuration && (
            <Card>
              <CardTitle icon={<SettingsIcon />} title="Firmware version" />
              <Divider />
              <CardContent>
                <FirmwareVersionForm
                  onChange={onFirmwareVersionData}
                  data={firmwareVersionData}
                />
                <ShowAlerts severity="error" messages={firmwareVersionErrors} />
              </CardContent>
              <Divider />

              <CardTitle icon={<SettingsIcon />} title="Target" />
              <Divider />
              <CardContent>
                <DeviceTargetForm
                  currentTarget={deviceTarget}
                  onChange={onDeviceTarget}
                />
                <ShowAlerts severity="error" messages={deviceTargetErrors} />
              </CardContent>
              <Divider />

              <CardTitle icon={<SettingsIcon />} title="Device options" />
              <Divider />
              <CardContent>
                <DeviceOptionsForm
                  deviceOptions={deviceOptionsFormData}
                  target={deviceTarget}
                  onChange={onUserDefines}
                />
                <ShowAlerts
                  severity="error"
                  messages={deviceOptionsResponseError}
                />
                <ShowAlerts
                  severity="error"
                  messages={deviceOptionsValidationErrors}
                />
                <Loader loading={loadingOptions} />
              </CardContent>
              <Divider />

              <CardTitle icon={<SettingsIcon />} title="Actions" />
              <Divider />
              <CardContent>
                <Button
                  className={styles.button}
                  size="large"
                  variant="contained"
                  onClick={onBuild}
                >
                  Build
                </Button>
                <Button
                  className={styles.button}
                  size="large"
                  variant="contained"
                  onClick={onBuildAndFlash}
                >
                  Build & Flash
                </Button>
              </CardContent>
              <Divider />
            </Card>
          )}

          {viewState === ViewState.Compiling && (
            <Card>
              <CardTitle icon={<SettingsIcon />} title="Build" />
              <Divider />
              <CardContent>
                <BuildProgressBar
                  inProgress={buildInProgress}
                  jobType={currentJobType}
                  progressNotification={lastProgressNotification}
                />
                <BuildNotificationsList notifications={progressNotifications} />

                <ShowAlerts
                  severity="error"
                  messages={buildFlashErrorResponse}
                />
              </CardContent>

              {logs.length > 0 && (
                <>
                  <CardTitle icon={<SettingsIcon />} title="Logs" />
                  <Divider />
                  <CardContent>
                    <Logs data={logs} />
                  </CardContent>
                  <Divider />
                </>
              )}
              {response !== undefined && (
                <>
                  <CardTitle icon={<SettingsIcon />} title="Result" />
                  <Divider />
                  <CardContent>
                    <BuildResponse response={response?.buildFlashFirmware} />
                  </CardContent>
                  <Divider />
                </>
              )}
              {!buildInProgress && (
                <>
                  <CardTitle icon={<SettingsIcon />} title="Actions" />
                  <Divider />
                  <CardContent>
                    <Button
                      className={styles.button}
                      color="primary"
                      size="large"
                      variant="contained"
                      onClick={onBack}
                    >
                      Back
                    </Button>
                  </CardContent>
                </>
              )}
            </Card>
          )}
        </Container>
      </div>
    </main>
  );
};

export default ConfiguratorView;
