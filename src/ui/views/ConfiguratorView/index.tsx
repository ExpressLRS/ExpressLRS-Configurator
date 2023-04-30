import React, {
  FunctionComponent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  Alert,
  AlertTitle,
  Box,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  IconButton,
  Tooltip,
} from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import { ipcRenderer } from 'electron';
import { ContentCopy, NetworkWifi, Save } from '@mui/icons-material';
import { SxProps, Theme } from '@mui/system';
import FirmwareVersionForm from '../../components/FirmwareVersionForm';
import DeviceTargetForm from '../../components/DeviceTargetForm';
import DeviceOptionsForm, {
  cleanUserDefines,
  DeviceOptionsFormData,
} from '../../components/DeviceOptionsForm';
import ShowAlerts from '../../components/ShowAlerts';
import CardTitle from '../../components/CardTitle';
import Logs from '../../components/Logs';
import BuildProgressBar from '../../components/BuildProgressBar';
import BuildNotificationsList from '../../components/BuildNotificationsList';
import {
  BuildFirmwareErrorType,
  BuildFlashFirmwareInput,
  BuildJobType,
  BuildProgressNotification,
  Device,
  DeviceType,
  FirmwareSource,
  FirmwareVersionDataInput,
  FlashingMethod,
  MulticastDnsInformation,
  Target,
  TargetDeviceOptionsQuery,
  useAvailableFirmwareTargetsLazyQuery,
  useBuildFlashFirmwareMutation,
  useLuaScriptLazyQuery,
  UserDefineKey,
  UserDefineKind,
  UserDefinesMode,
  useTargetDeviceOptionsLazyQuery,
} from '../../gql/generated/types';
import Loader from '../../components/Loader';
import BuildResponse from '../../components/BuildResponse';
import {
  IpcRequest,
  OpenFileLocationRequestBody,
  SaveFileRequestBody,
  SaveFileResponseBody,
  UpdateBuildStatusRequestBody,
} from '../../../ipc';
import UserDefinesValidator from './UserDefinesValidator';
import ApplicationStorage from '../../storage';
import persistDeviceOptions from '../../storage/commands/persistDeviceOptions';
import mergeWithDeviceOptionsFromStorage from '../../storage/commands/mergeWithDeviceOptionsFromStorage';
import UserDefinesAdvisor from '../../components/UserDefinesAdvisor';
import SerialDeviceSelect from '../../components/SerialDeviceSelect';
import WifiDeviceSelect from '../../components/WifiDeviceSelect';
import WifiDeviceList from '../../components/WifiDeviceList';
import GitRepository from '../../models/GitRepository';
import ShowTimeoutAlerts from '../../components/ShowTimeoutAlerts';
import ShowAfterTimeout from '../../components/ShowAfterTimeout';
import useAppState from '../../hooks/useAppState';
import AppStatus from '../../models/enum/AppStatus';
import MainLayout from '../../layouts/MainLayout';
import SplitButton from '../../components/SplitButton';

const styles: Record<string, SxProps<Theme>> = {
  button: {
    marginRight: 2,
  },
  longBuildDurationWarning: {
    marginBottom: 1,
  },
  buildNotification: {
    marginBottom: 1,
  },
};

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
    case FirmwareSource.GitPullRequest:
      if (
        !(data.gitPullRequest && data.gitPullRequest.headCommitHash.length > 0)
      ) {
        errors.push(new Error('Firmware Pull Request is not selected'));
      }
      break;
    default:
      throw new Error(`unknown firmware data source: ${data.source}`);
  }
  return errors;
};

enum ViewState {
  Configuration = 'CONFIGURATION',
  Compiling = 'https://xkcd.com/303/',
}

interface ConfiguratorViewProps {
  gitRepository: GitRepository;
  selectedDevice: string | null;
  networkDevices: Map<string, MulticastDnsInformation>;
  onDeviceChange: (dnsDevice: MulticastDnsInformation | null) => void;
  deviceType: DeviceType;
  buildProgressNotifications: BuildProgressNotification[];
  lastBuildProgressNotification: BuildProgressNotification | null;
  resetBuildProgressNotifications: () => void;
  buildLogs: string;
  resetBuildLogs: () => void;
}

const ConfiguratorView: FunctionComponent<ConfiguratorViewProps> = (props) => {
  const {
    gitRepository,
    selectedDevice,
    networkDevices,
    onDeviceChange,
    deviceType,
    buildProgressNotifications,
    lastBuildProgressNotification,
    resetBuildProgressNotifications,
    buildLogs,
    resetBuildLogs,
  } = props;

  const [viewState, setViewState] = useState<ViewState>(
    ViewState.Configuration
  );

  const { setAppStatus } = useAppState();

  const [firmwareVersionData, setFirmwareVersionData] =
    useState<FirmwareVersionDataInput | null>(null);
  const [firmwareVersionErrors, setFirmwareVersionErrors] = useState<Error[]>(
    []
  );
  const onFirmwareVersionData = useCallback(
    (data: FirmwareVersionDataInput) => {
      setFirmwareVersionErrors([]);
      setFirmwareVersionData(data);
    },
    []
  );

  const [deviceTarget, setDeviceTarget] = useState<Target | null>(null);
  const [deviceTargetErrors, setDeviceTargetErrors] = useState<Error[]>([]);

  const onDeviceTarget = useCallback(
    (data: Target | null) => {
      setDeviceTargetErrors([]);
      setDeviceTarget(data);
      // if target was manually changed, set selected device to null
      onDeviceChange(null);
    },
    [onDeviceChange]
  );

  const [deviceTargets, setDeviceTargets] = useState<Device[] | null>(null);

  const [
    fetchDeviceTargets,
    {
      loading: loadingTargets,
      data: targetsResponse,
      error: targetsResponseError,
    },
  ] = useAvailableFirmwareTargetsLazyQuery({
    fetchPolicy: 'network-only',
  });

  const [
    fetchLuaScript,
    { data: luaScriptResponse, error: luaScriptResponseError },
  ] = useLuaScriptLazyQuery();

  const device = useMemo(() => {
    return deviceTargets?.find((d) => {
      return d.targets.find((target) => target.id === deviceTarget?.id);
    });
  }, [deviceTarget, deviceTargets]);

  useEffect(() => {
    if (
      firmwareVersionData === null ||
      validateFirmwareVersionData(firmwareVersionData).length > 0
    ) {
      setDeviceTargets(null);
    } else {
      fetchDeviceTargets({
        variables: {
          source: firmwareVersionData.source as FirmwareSource,
          gitBranch: firmwareVersionData.gitBranch!,
          gitTag: firmwareVersionData.gitTag!,
          gitCommit: firmwareVersionData.gitCommit!,
          localPath: firmwareVersionData.localPath!,
          gitPullRequest: firmwareVersionData.gitPullRequest,
          gitRepository: {
            url: gitRepository.url,
            owner: gitRepository.owner,
            repositoryName: gitRepository.repositoryName,
            rawRepoUrl: gitRepository.rawRepoUrl,
            srcFolder: gitRepository.srcFolder,
          },
        },
      });
    }
  }, [gitRepository, firmwareVersionData, fetchDeviceTargets]);

  useEffect(() => {
    if (targetsResponse?.availableFirmwareTargets) {
      setDeviceTargets([
        ...(targetsResponse.availableFirmwareTargets as Device[]),
      ]);
    } else {
      setDeviceTargets(null);
    }
  }, [targetsResponse]);

  const [deviceOptionsFormData, setDeviceOptionsFormData] =
    useState<DeviceOptionsFormData>({
      userDefinesTxt: '',
      userDefinesMode: UserDefinesMode.UserInterface,
      userDefineOptions: [],
    });

  const handleDeviceOptionsResponse = async (
    deviceOptionsResponse: TargetDeviceOptionsQuery
  ) => {
    const storage = new ApplicationStorage();
    const deviceName = device?.name || null;
    const userDefineOptions = await mergeWithDeviceOptionsFromStorage(
      storage,
      deviceName,
      {
        ...deviceOptionsFormData,
        userDefineOptions: [...deviceOptionsResponse.targetDeviceOptions],
      }
    );

    // if a network device is selected, merge in its options
    if (selectedDevice && networkDevices.has(selectedDevice)) {
      const networkDevice = networkDevices.get(selectedDevice);
      userDefineOptions.userDefineOptions =
        userDefineOptions.userDefineOptions.map((userDefineOption) => {
          const networkDeviceOption = networkDevice?.options.find(
            (item) => item.key === userDefineOption.key
          );
          if (networkDeviceOption) {
            return {
              ...userDefineOption,
              enabled: networkDeviceOption.enabled,
              value: networkDeviceOption.value,
            };
          }
          return userDefineOption;
        });
    }

    setDeviceOptionsFormData(userDefineOptions);
  };
  const [
    fetchOptions,
    {
      loading: loadingOptions,
      data: deviceOptionsResponse,
      error: deviceOptionsResponseError,
    },
  ] = useTargetDeviceOptionsLazyQuery({
    fetchPolicy: 'network-only',
    onCompleted: (data) => {
      handleDeviceOptionsResponse(data).catch((err) => {
        console.error('failed to handle device options response', err);
      });
    },
  });

  useEffect(() => {
    if (
      deviceTarget === null ||
      firmwareVersionData === null ||
      validateFirmwareVersionData(firmwareVersionData).length > 0
    ) {
      setDeviceOptionsFormData({
        userDefinesTxt: '',
        userDefinesMode: UserDefinesMode.UserInterface,
        userDefineOptions: [],
      });
    } else {
      fetchOptions({
        variables: {
          target: deviceTarget.name,
          source: firmwareVersionData.source as FirmwareSource,
          gitBranch: firmwareVersionData.gitBranch!,
          gitTag: firmwareVersionData.gitTag!,
          gitCommit: firmwareVersionData.gitCommit!,
          localPath: firmwareVersionData.localPath!,
          gitPullRequest: firmwareVersionData.gitPullRequest,
          gitRepository: {
            url: gitRepository.url,
            owner: gitRepository.owner,
            repositoryName: gitRepository.repositoryName,
            rawRepoUrl: gitRepository.rawRepoUrl,
            srcFolder: gitRepository.srcFolder,
          },
        },
      });
    }
  }, [deviceTarget, firmwareVersionData, gitRepository, fetchOptions]);

  const onResetToDefaults = () => {
    const handleReset = async () => {
      if (deviceOptionsResponse === undefined || deviceTarget === null) {
        // eslint-disable-next-line no-alert
        alert(`deviceOptionsResponse is undefined`);
        return;
      }
      const deviceName = device?.name || null;
      if (deviceName) {
        const storage = new ApplicationStorage();
        await storage.removeDeviceOptions(deviceName);

        const userDefineOptions = await mergeWithDeviceOptionsFromStorage(
          storage,
          deviceName,
          {
            ...deviceOptionsFormData,
            userDefineOptions: [...deviceOptionsResponse.targetDeviceOptions],
          }
        );
        setDeviceOptionsFormData(userDefineOptions);
      }
    };
    handleReset().catch((err) => {
      console.error(`failed to reset device options form data: ${err}`);
    });
  };

  const onUserDefines = useCallback(
    (data: DeviceOptionsFormData) => {
      setDeviceOptionsFormData(data);
      if (deviceTarget !== null) {
        const storage = new ApplicationStorage();
        const deviceName = device?.name;
        if (deviceName) {
          persistDeviceOptions(storage, deviceName, data).catch((err) => {
            console.error(`failed to persist user defines: ${err}`);
          });
        }
      }
    },
    [deviceTarget, deviceTargets]
  );

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

  const isTX = useMemo(() => {
    if (deviceTarget) {
      return deviceTarget.name?.indexOf('_TX_') > -1;
    }
    return false;
  }, [deviceTarget]);

  const hasLuaScript = useMemo(() => {
    return deviceType === DeviceType.ExpressLRS && isTX;
  }, [deviceType, isTX]);

  useEffect(() => {
    if (firmwareVersionData && isTX && hasLuaScript) {
      fetchLuaScript({
        variables: {
          source: firmwareVersionData.source as FirmwareSource,
          gitBranch: firmwareVersionData.gitBranch!,
          gitTag: firmwareVersionData.gitTag!,
          gitCommit: firmwareVersionData.gitCommit!,
          localPath: firmwareVersionData.localPath!,
          gitPullRequest: firmwareVersionData.gitPullRequest,
          gitRepository: {
            url: gitRepository.url,
            owner: gitRepository.owner,
            repositoryName: gitRepository.repositoryName,
            rawRepoUrl: gitRepository.rawRepoUrl,
            srcFolder: gitRepository.srcFolder,
          },
        },
      });
    }
  }, [gitRepository, firmwareVersionData, fetchLuaScript, isTX, hasLuaScript]);

  /*
    Display Electron.js confirmation dialog if user wants to shutdown the app
    when build is in progress.
   */
  useEffect(() => {
    const body: UpdateBuildStatusRequestBody = {
      buildInProgress,
    };
    ipcRenderer.send(IpcRequest.UpdateBuildStatus, body);
  }, [buildInProgress]);

  const [serialDevice, setSerialDevice] = useState<string | null>(null);
  const onSerialDevice = (newSerialDevice: string | null) => {
    setSerialDevice(newSerialDevice);
  };

  const [wifiDevice, setWifiDevice] = useState<string | null>(null);
  const onWifiDevice = useCallback((newWifiDevice: string | null) => {
    setWifiDevice(newWifiDevice);
  }, []);

  const [serialPortRequired, setSerialPortRequired] = useState<boolean>(false);
  const [wifiDeviceRequired, setWifiDeviceRequired] = useState<boolean>(false);

  useEffect(() => {
    if (
      deviceTarget &&
      (deviceTarget.flashingMethod === FlashingMethod.BetaflightPassthrough ||
        deviceTarget.flashingMethod === FlashingMethod.UART ||
        deviceTarget.flashingMethod === FlashingMethod.EdgeTxPassthrough ||
        deviceTarget.flashingMethod === FlashingMethod.Passthrough)
    ) {
      setSerialPortRequired(true);
    } else {
      setSerialPortRequired(false);
    }

    if (deviceTarget && deviceTarget.flashingMethod === FlashingMethod.WIFI) {
      setWifiDeviceRequired(true);
    } else {
      setWifiDeviceRequired(false);
    }
  }, [deviceTarget, deviceTarget, deviceTargets]);

  const [deviceOptionsValidationErrors, setDeviceOptionsValidationErrors] =
    useState<Error[] | null>(null);

  const reset = () => {
    resetBuildLogs();
    setFirmwareVersionErrors([]);
    setDeviceTargetErrors([]);
    setDeviceOptionsValidationErrors([]);

    resetBuildProgressNotifications();
  };

  const onBack = () => {
    reset();
    setViewState(ViewState.Configuration);
    setAppStatus(AppStatus.Interactive);
  };

  const getAbbreviatedDeviceName = (item: Device) => {
    return item.abbreviatedName?.slice(0, 16) ?? item.name?.slice(0, 16);
  };

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

    let uploadPort: string | undefined;

    if (serialPortRequired && serialDevice != null) {
      uploadPort = serialDevice;
    } else if (wifiDeviceRequired && wifiDevice !== null) {
      uploadPort = wifiDevice;
    }

    const userDefines = cleanUserDefines(
      deviceOptionsFormData.userDefineOptions
    );

    if (device?.parent && device?.name) {
      const deviceName = getAbbreviatedDeviceName(device);
      // add the user define for the device name
      userDefines.push({
        key: UserDefineKey.DEVICE_NAME,
        value: deviceName,
        enabled: true,
        enumValues: null,
        type: UserDefineKind.Text,
      });
    }

    const input: BuildFlashFirmwareInput = {
      type,
      firmware: firmwareVersionData,
      target: deviceTarget.name,
      userDefinesTxt: deviceOptionsFormData.userDefinesTxt,
      userDefinesMode: deviceOptionsFormData.userDefinesMode,
      userDefines,
      serialDevice: uploadPort,
    };
    buildFlashFirmwareMutation({
      variables: {
        input,
        gitRepository: {
          url: gitRepository.url,
          owner: gitRepository.owner,
          repositoryName: gitRepository.repositoryName,
          rawRepoUrl: gitRepository.rawRepoUrl,
          srcFolder: gitRepository.srcFolder,
        },
      },
    });
    setViewState(ViewState.Compiling);
    setAppStatus(AppStatus.Busy);
  };

  useEffect(() => {
    if (
      !buildInProgress &&
      response?.buildFlashFirmware?.success !== undefined
    ) {
      window.scrollTo(0, document.body.scrollHeight);
    }
  }, [buildInProgress, response]);

  const onBuild = () => sendJob(BuildJobType.Build);
  const onBuildAndFlash = () => sendJob(BuildJobType.BuildAndFlash);
  const onForceFlash = () => sendJob(BuildJobType.ForceFlash);

  const deviceTargetRef = useRef<HTMLDivElement | null>(null);
  const deviceOptionsRef = useRef<HTMLDivElement | null>(null);

  const [deviceSelectErrorDialogOpen, setDeviceSelectErrorDialogOpen] =
    useState<boolean>(false);

  const handleSelectedDeviceChange = useCallback(
    (deviceName: string) => {
      const dnsDevice = networkDevices.get(deviceName);
      if (dnsDevice) {
        const dnsDeviceName = dnsDevice.deviceName?.toUpperCase();
        const dnsDeviceTarget = dnsDevice.target.toUpperCase();

        let deviceMatches: Device[] | undefined = [];

        // try to find the device by the deviceName
        deviceMatches = deviceTargets?.filter((item) => {
          if (getAbbreviatedDeviceName(item).toUpperCase() === dnsDeviceName) {
            return true;
          }

          if (item.luaName?.toUpperCase() === dnsDeviceName) {
            return true;
          }

          return false;
        });

        // if no matches found by deviceName, then use the target
        if (
          deviceMatches?.length === 0 &&
          dnsDeviceTarget.trim().length !== 0
        ) {
          deviceMatches = deviceTargets?.filter((item) => {
            // only match on a device that doesn't have a parent, which means it
            // is not an alias of another device
            if (!item.parent) {
              if (dnsDeviceTarget === item.priorTargetName) {
                return true;
              }
              return item.targets.find((target) => {
                const baseTargetName = target.name.split('_via_')[0];
                return baseTargetName.toUpperCase() === dnsDeviceTarget;
              });
            }
            return false;
          });
        }

        // if no device is found that matches the target
        if (!deviceMatches || deviceMatches.length === 0) {
          console.error(
            `no device matches found for target ${dnsDeviceTarget}!`
          );
          setDeviceSelectErrorDialogOpen(true);
          return;
        }

        // if multiple device matches are found, then don't select any of them
        // we do not know which one is correct and do not want to pick the wrong device.
        if (deviceMatches.length > 1) {
          console.error(
            `multiple device matches found for target ${dnsDeviceTarget}!`
          );
          setDeviceSelectErrorDialogOpen(true);
          return;
        }

        const deviceMatch = deviceMatches[0];

        const dTarget =
          deviceMatch?.targets.find((target) => {
            return target.flashingMethod === FlashingMethod.WIFI;
          }) ||
          deviceMatch?.targets[0] ||
          null;

        if (dTarget !== deviceTarget) {
          setDeviceTarget(dTarget);
          deviceTargetRef?.current?.scrollIntoView({ behavior: 'smooth' });
        }

        setWifiDevice(dnsDevice.ip);
      }
    },
    [deviceTarget, deviceTargets, networkDevices]
  );

  useEffect(() => {
    if (selectedDevice) {
      handleSelectedDeviceChange(selectedDevice);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDevice]);

  const luaDownloadButton = () => {
    if (
      hasLuaScript &&
      luaScriptResponse &&
      luaScriptResponse.luaScript.fileLocation &&
      luaScriptResponse.luaScript.fileLocation.length > 0
    ) {
      return (
        <Button
          sx={styles.button}
          color="primary"
          size="large"
          variant="contained"
          href={luaScriptResponse?.luaScript.fileLocation ?? ''}
          download
        >
          Download LUA script
        </Button>
      );
    }
    return null;
  };

  const handleDeviceSelectErrorDialogClose = useCallback(() => {
    setDeviceSelectErrorDialogOpen(false);
  }, []);

  const saveBuildLogToFile = useCallback(async () => {
    const saveFileRequestBody: SaveFileRequestBody = {
      data: buildLogs,
      defaultPath: `ExpressLRSBuildLog_${new Date()
        .toISOString()
        .replace(/[^0-9]/gi, '')}.txt`,
    };

    const result: SaveFileResponseBody = await ipcRenderer.invoke(
      IpcRequest.SaveFile,
      saveFileRequestBody
    );

    if (result.success) {
      const openFileLocationRequestBody: OpenFileLocationRequestBody = {
        path: result.path,
      };
      ipcRenderer.send(
        IpcRequest.OpenFileLocation,
        openFileLocationRequestBody
      );
    }
  }, [buildLogs]);

  return (
    <MainLayout>
      {viewState === ViewState.Configuration && (
        <>
          <Card>
            <CardTitle icon={<SettingsIcon />} title="Firmware version" />
            <Divider />
            <CardContent>
              <FirmwareVersionForm
                onChange={onFirmwareVersionData}
                data={firmwareVersionData}
                gitRepository={gitRepository}
              />
              <ShowAlerts severity="error" messages={firmwareVersionErrors} />
            </CardContent>
            <Divider />

            <CardTitle icon={<SettingsIcon />} title="Target" />
            <Divider />
            <CardContent ref={deviceTargetRef}>
              {firmwareVersionData === null ||
                (validateFirmwareVersionData(firmwareVersionData).length >
                  0 && (
                  <Alert severity="info">
                    <AlertTitle>Notice</AlertTitle>
                    Please select a firmware version first
                  </Alert>
                ))}
              {!loadingTargets && !targetsResponseError && (
                <DeviceTargetForm
                  currentTarget={deviceTarget}
                  onChange={onDeviceTarget}
                  firmwareVersionData={firmwareVersionData}
                  deviceOptions={deviceTargets}
                />
              )}
              <Loader loading={loadingTargets} />
              {luaDownloadButton()}
              {hasLuaScript && (
                <ShowAlerts
                  severity="error"
                  messages={luaScriptResponseError}
                />
              )}
              <ShowAlerts severity="error" messages={targetsResponseError} />
              <ShowAlerts severity="error" messages={deviceTargetErrors} />
            </CardContent>
            <Divider />

            <CardTitle
              icon={<SettingsIcon />}
              title={
                <div ref={deviceOptionsRef}>
                  Device options{' '}
                  {deviceOptionsFormData.userDefinesMode ===
                    UserDefinesMode.UserInterface &&
                    deviceTarget !== null &&
                    !loadingOptions && (
                      <Tooltip
                        placement="top"
                        arrow
                        title={
                          <div>
                            Reset device options to the recommended defaults on
                            this device target. Except for your custom binding
                            phrase.
                          </div>
                        }
                      >
                        <Button onClick={onResetToDefaults} size="small">
                          Reset
                        </Button>
                      </Tooltip>
                    )}
                </div>
              }
            />
            <Divider />
            <CardContent>
              {!loadingOptions && (
                <DeviceOptionsForm
                  target={deviceTarget?.name ?? null}
                  deviceOptions={deviceOptionsFormData}
                  onChange={onUserDefines}
                />
              )}
              {deviceOptionsFormData.userDefinesMode ===
                UserDefinesMode.UserInterface &&
                (firmwareVersionData === null ||
                  validateFirmwareVersionData(firmwareVersionData).length > 0 ||
                  deviceTarget === null) && (
                  <Alert severity="info">
                    <AlertTitle>Notice</AlertTitle>
                    Please select a firmware version and device target first
                  </Alert>
                )}
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
              <UserDefinesAdvisor
                deviceOptionsFormData={deviceOptionsFormData}
              />

              <div>
                {serialPortRequired && (
                  <SerialDeviceSelect
                    serialDevice={serialDevice}
                    onChange={onSerialDevice}
                  />
                )}
                {wifiDeviceRequired && (
                  <WifiDeviceSelect
                    wifiDevice={wifiDevice}
                    wifiDevices={Array.from(networkDevices.values()).filter(
                      (item) => {
                        return deviceTarget?.name
                          ?.toUpperCase()
                          .startsWith(item.target.toUpperCase());
                      }
                    )}
                    onChange={onWifiDevice}
                  />
                )}
                <Button
                  sx={styles.button}
                  size="large"
                  variant="contained"
                  onClick={onBuild}
                >
                  Build
                </Button>
                <SplitButton
                  sx={styles.button}
                  size="large"
                  variant="contained"
                  options={[
                    {
                      label: 'Build & Flash',
                      value: BuildJobType.BuildAndFlash,
                    },
                    {
                      label: 'Force Flash',
                      value: BuildJobType.ForceFlash,
                    },
                  ]}
                  onButtonClick={(value: string | null) => {
                    if (value === BuildJobType.BuildAndFlash) {
                      onBuildAndFlash();
                    } else if (value === BuildJobType.ForceFlash) {
                      onForceFlash();
                    }
                  }}
                />
              </div>
            </CardContent>
          </Card>
          <Card>
            {networkDevices.size > 0 && (
              <Box>
                <Divider />
                <CardTitle icon={<NetworkWifi />} title="Network Devices" />
                <Divider />
                <CardContent>
                  <div>
                    <WifiDeviceList
                      wifiDevices={Array.from(networkDevices.values())}
                      onChange={(dnsDevice: MulticastDnsInformation) => {
                        onDeviceChange(dnsDevice);
                        handleSelectedDeviceChange(dnsDevice.name);
                      }}
                    />
                  </div>
                </CardContent>
              </Box>
            )}
          </Card>
          <Dialog
            open={deviceSelectErrorDialogOpen}
            onClose={handleDeviceSelectErrorDialogClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">
              Device Select Error
            </DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                The target device could not be automatically selected, it must
                be done manually.
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleDeviceSelectErrorDialogClose}>
                Close
              </Button>
            </DialogActions>
          </Dialog>
        </>
      )}

      {viewState === ViewState.Compiling && (
        <Card>
          <CardTitle icon={<SettingsIcon />} title="Build" />
          <Divider />
          <CardContent>
            <BuildProgressBar
              inProgress={buildInProgress}
              jobType={currentJobType}
              progressNotification={lastBuildProgressNotification}
            />
            <BuildNotificationsList
              notifications={buildProgressNotifications}
            />

            <ShowAlerts severity="error" messages={buildFlashErrorResponse} />
          </CardContent>

          {buildLogs.length > 0 && (
            <>
              <CardTitle
                icon={<SettingsIcon />}
                title={
                  <Box display="flex" justifyContent="space-between">
                    <Box>Logs</Box>
                    <Box>
                      <IconButton
                        aria-label="Copy log to clipboard"
                        title="Copy log to clipboard"
                        onClick={async () => {
                          await navigator.clipboard.writeText(buildLogs);
                        }}
                      >
                        <ContentCopy />
                      </IconButton>
                      <IconButton
                        aria-label="Save log to file"
                        title="Save log to file"
                        onClick={saveBuildLogToFile}
                      >
                        <Save />
                      </IconButton>
                    </Box>
                  </Box>
                }
              />
              <Divider />
              <CardContent>
                <Box sx={styles.longBuildDurationWarning}>
                  <ShowTimeoutAlerts
                    severity="warning"
                    messages="Sometimes builds take at least a few minutes. It is normal, especially for the first time builds."
                    active={buildInProgress}
                    timeout={14 * 1000}
                  />
                </Box>
                <Logs data={buildLogs} />
              </CardContent>
              <Divider />
            </>
          )}
          {response !== undefined && (
            <>
              <CardTitle icon={<SettingsIcon />} title="Result" />
              <Divider />
              <CardContent>
                {response?.buildFlashFirmware?.success &&
                  currentJobType === BuildJobType.BuildAndFlash &&
                  deviceTarget?.flashingMethod === FlashingMethod.WIFI && (
                    <Alert sx={styles.buildNotification} severity="warning">
                      <AlertTitle>Warning</AlertTitle>
                      Please wait for LED to resume blinking before
                      disconnecting power
                    </Alert>
                  )}
                <ShowAfterTimeout
                  timeout={
                    response?.buildFlashFirmware?.success &&
                    currentJobType === BuildJobType.BuildAndFlash &&
                    deviceTarget?.flashingMethod === FlashingMethod.WIFI
                      ? 15000
                      : 1000
                  }
                  active={!buildInProgress}
                >
                  <Box sx={styles.buildNotification}>
                    <BuildResponse
                      response={response?.buildFlashFirmware}
                      firmwareVersionData={firmwareVersionData}
                    />
                  </Box>
                  {response?.buildFlashFirmware?.success && hasLuaScript && (
                    <Alert sx={styles.buildNotification} severity="info">
                      <AlertTitle>Update Lua Script</AlertTitle>
                      Make sure to update the Lua script on your radio
                    </Alert>
                  )}
                </ShowAfterTimeout>
                {response?.buildFlashFirmware?.success &&
                  currentJobType === BuildJobType.Build && (
                    <Alert sx={styles.buildNotification} severity="info">
                      <AlertTitle>Build notice</AlertTitle>
                      Firmware binary file was opened in the file explorer
                    </Alert>
                  )}
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
                  sx={styles.button}
                  color="primary"
                  size="large"
                  variant="contained"
                  onClick={onBack}
                >
                  Back
                </Button>

                {!response?.buildFlashFirmware.success && (
                  <Button
                    sx={styles.button}
                    size="large"
                    variant="contained"
                    onClick={() => {
                      sendJob(currentJobType);
                    }}
                  >
                    Retry
                  </Button>
                )}

                {!response?.buildFlashFirmware.success &&
                  response?.buildFlashFirmware.errorType ===
                    BuildFirmwareErrorType.TargetMismatch && (
                    <Button
                      sx={styles.button}
                      size="large"
                      variant="contained"
                      onClick={onForceFlash}
                    >
                      Force Flash
                    </Button>
                  )}

                {response?.buildFlashFirmware.success && luaDownloadButton()}
              </CardContent>
            </>
          )}
        </Card>
      )}
    </MainLayout>
  );
};

export default ConfiguratorView;
