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
import { ipcRenderer, IpcRendererEvent } from 'electron';
import Header from '../../components/Header';
import FirmwareVersionForm from '../../components/FirmwareVersionForm';
import { Config } from '../../../config';
import DeviceTargetForm from '../../components/DeviceTargetForm';
import { DeviceTarget } from '../../../library/FirmwareBuilder/Enum/DeviceTarget';
import DeviceOptionsForm, {
  DeviceOptionsFormData,
} from '../../components/DeviceOptionsForm';
import Sidebar from '../../components/Sidebar';
import {
  MainRequestType,
  MainResponseType,
  PushMessageType,
} from '../../../ipc';
import ShowAlerts from '../../components/ShowAlerts';
import UserDefinesValidator from '../../../library/FirmwareBuilder/Validator/UserDefinesValidator';
import CardTitle from '../../components/CardTitle';
import EventsBatcher from '../../library/EventsBatcher';
import Logs from '../../components/Logs';
import {
  BuildFirmWareProgressNotificationData,
  BuildFlashFirmwareRequestBody,
  BuildFlashFirmwareResponseBody,
  FirmwareSource,
  FirmwareVersionData,
  JobType,
  UserDefinesMode,
} from '../../../main/handlers/BuildFirmwareHandler';
import BuildProgressBar from '../../components/BuildProgressBar';
import BuildNotificationsList from '../../components/BuildNotificationsList';
import BuildResponse from '../../components/BuildResponse';
import UserDefineConstraints, {
  UserDefinesByCategory,
} from '../../../library/FirmwareBuilder/UserDefineConstraints';
import { UserDefine } from '../../../library/FirmwareBuilder/Model/UserDefine';

export const validFirmwareVersionData = (
  data: FirmwareVersionData
): Error[] => {
  const errors: Error[] = [];
  switch (data.source) {
    case FirmwareSource.Local:
      if (!(data.localPath.length > 0)) {
        errors.push(new Error('Local path is empty'));
      }
      break;
    case FirmwareSource.GitCommit:
      if (!(data.gitCommit.length > 0)) {
        errors.push(new Error('Git commit hash is empty'));
      }
      break;
    case FirmwareSource.GitBranch:
      if (!(data.gitBranch.length > 0)) {
        errors.push(new Error('Git branch is not selected'));
      }
      break;
    case FirmwareSource.GitTag:
      if (!(data.gitTag.length > 0)) {
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

const userDefineConstrains = new UserDefineConstraints();

const ConfiguratorView: FunctionComponent = () => {
  const styles = useStyles();

  const [viewState, setViewState] = useState<ViewState>(
    ViewState.Configuration
  );

  const [progressNotifications, setProgressNotifications] = useState<
    BuildFirmWareProgressNotificationData[]
  >([]);
  const progressNotificationsRef = useRef<
    BuildFirmWareProgressNotificationData[]
  >([]);
  const [
    lastProgressNotification,
    setLastProgressNotification,
  ] = useState<BuildFirmWareProgressNotificationData | null>(null);
  useEffect(() => {
    const listener = (
      _event: IpcRendererEvent,
      args: BuildFirmWareProgressNotificationData
    ) => {
      console.log('receives progress notification', args);
      const newNotificationsList = [...progressNotificationsRef.current, args];
      progressNotificationsRef.current = newNotificationsList;
      setProgressNotifications(newNotificationsList);
      setLastProgressNotification(args);
    };
    ipcRenderer.on(PushMessageType.FlashFirmWareProgressNotification, listener);
    return () => {
      progressNotificationsRef.current = [];
      ipcRenderer.removeListener(
        PushMessageType.FlashFirmWareProgressNotification,
        listener
      );
    };
  }, []);

  /*
    We batch log events in order to save React.js state updates and rendering performance.
   */
  const [logs, setLogs] = useState<string>('');
  const logsRef = useRef<string[]>([]);
  useEffect(() => {
    const eventsBatcher = new EventsBatcher<string>(250);
    eventsBatcher.onBatch((newLogs) => {
      const newLogsList = [...logsRef.current, ...newLogs];
      logsRef.current = newLogsList;
      setLogs(newLogsList.join(''));
    });
    const handler = (_event: IpcRendererEvent, args: string) => {
      eventsBatcher.enqueue(args);
    };
    ipcRenderer.on(PushMessageType.BuildFlashLogEntry, handler);
    return () => {
      logsRef.current = [];
      ipcRenderer.removeListener(PushMessageType.BuildFlashLogEntry, handler);
    };
  }, []);

  const [
    firmwareVersionData,
    setFirmwareVersionData,
  ] = useState<FirmwareVersionData | null>(null);
  const [firmwareVersionErrors, setFirmwareVersionErrors] = useState<Error[]>(
    []
  );
  const onFirmwareVersionData = (data: FirmwareVersionData) => {
    setFirmwareVersionErrors([]);
    setFirmwareVersionData(data);
  };

  const [deviceTarget, setDeviceTarget] = useState<DeviceTarget | null>(null);
  const [deviceTargetErrors, setDeviceTargetErrors] = useState<Error[]>([]);
  const onDeviceTarget = (data: DeviceTarget) => {
    setDeviceTargetErrors([]);
    setDeviceTarget(data);
  };

  const [deviceOptionsFormData, setDeviceOptionsFormData] = useState<
    DeviceOptionsFormData
  >({
    userDefinesTxt: '',
    userDefinesMode: UserDefinesMode.UserInterface,
    userDefineOptions: [],
  });
  const [deviceOptionsErrors, setDeviceOptionsErrors] = useState<Error[]>([]);
  const [
    deviceOptionCategories,
    setDeviceOptionCategories,
  ] = useState<UserDefinesByCategory | null>(null);
  useEffect(() => {
    if (deviceTarget === null) {
      setDeviceOptionCategories(null);
    } else {
      setDeviceOptionCategories(
        userDefineConstrains.getCategorizedByTarget(deviceTarget)
      );
      const allowedOptions = userDefineConstrains.getByTarget(deviceTarget);
      const options = allowedOptions.map((key) => {
        return {
          key,
          checked: false,
          label: key,
          value: '',
        };
      });
      setDeviceOptionsFormData({
        userDefinesMode: deviceOptionsFormData?.userDefinesMode,
        userDefinesTxt: deviceOptionsFormData?.userDefinesTxt,
        userDefineOptions: options,
      });
    }
  }, [deviceTarget]);

  const onUserDefines = (data: DeviceOptionsFormData) => {
    setDeviceOptionsErrors([]);

    setDeviceOptionsFormData(data);
  };

  const [buildInProgress, setBuildInProgress] = useState<boolean>(false);
  const [
    response,
    setResponse,
  ] = useState<BuildFlashFirmwareResponseBody | null>(null);
  useEffect(() => {
    const handler = (
      _event: IpcRendererEvent,
      res: BuildFlashFirmwareResponseBody
    ) => {
      console.log('flash firmware RESPONSE', res);
      setBuildInProgress(false);
      setResponse(res);
    };
    ipcRenderer.on(MainResponseType.BuildFlashFirmware, handler);

    return () => {
      ipcRenderer.removeListener(MainResponseType.BuildFlashFirmware, handler);
    };
  }, []);

  const reset = () => {
    logsRef.current = [];
    progressNotificationsRef.current = [];
    setLogs('');
    setFirmwareVersionErrors([]);
    setDeviceTargetErrors([]);
    setDeviceOptionsErrors([]);

    setProgressNotifications([]);
    setLastProgressNotification(null);

    setResponse(null);
  };

  const onBack = () => {
    reset();
    setViewState(ViewState.Configuration);
  };

  const sendJob = (type: JobType) => {
    reset();

    // Validate firmware source
    if (firmwareVersionData === null) {
      setFirmwareVersionErrors([new Error('Please select firmware source')]);
      return;
    }
    const sourceErrors = validFirmwareVersionData(firmwareVersionData);
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

    const userDefines: UserDefine[] = deviceOptionsFormData?.userDefineOptions
      .map((item): UserDefine | null => {
        if (item.checked) {
          return {
            key: item.key,
            value: item.value,
          };
        }
        return null;
      })
      .filter((item): item is UserDefine => item != null);

    switch (deviceOptionsFormData.userDefinesMode) {
      case UserDefinesMode.Manual:
        break;
      case UserDefinesMode.UserInterface:
        const errs = new UserDefinesValidator().validate(userDefines);
        if (errs.length > 0) {
          setDeviceOptionsErrors(errs);
          return;
        }
        break;
      default:
        break;
    }

    const req: BuildFlashFirmwareRequestBody = {
      type,
      firmware: firmwareVersionData,
      target: deviceTarget,
      userDefinesTxt: deviceOptionsFormData.userDefinesTxt,
      userDefinesMode: deviceOptionsFormData.userDefinesMode,
      userDefines,
    };
    setViewState(ViewState.Compiling);
    setBuildInProgress(true);
    ipcRenderer.send(MainRequestType.BuildFlashFirmware, req);
  };

  const onBuild = () => sendJob(JobType.Build);
  const onBuildAndFlash = () => sendJob(JobType.BuildAndFlash);

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
                  repositoryOwner={Config.git.owner}
                  repositoryName={Config.git.repositoryName}
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
                  categories={deviceOptionCategories}
                  target={deviceTarget}
                  onChange={onUserDefines}
                />
                <ShowAlerts severity="error" messages={deviceOptionsErrors} />
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
                  progressNotification={lastProgressNotification}
                />
                <BuildNotificationsList notifications={progressNotifications} />
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
              {response !== null && (
                <>
                  <CardTitle icon={<SettingsIcon />} title="Result" />
                  <Divider />
                  <CardContent>
                    <BuildResponse response={response} />
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
