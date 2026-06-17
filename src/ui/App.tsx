import { FunctionComponent, useCallback, useEffect, useMemo, useState } from 'react';
import { Routes, Route, HashRouter, Navigate } from 'react-router';
import CssBaseline from '@mui/material/CssBaseline';
import '@fontsource/roboto';
import { ThemeProvider, StyledEngineProvider } from '@mui/material';
import { ApolloProvider } from '@apollo/client/react';
import { createAppTheme } from './theme';
import client from './gql';
import ConfiguratorView from './views/ConfiguratorView';
import LogsView from './views/LogsView';
import SerialMonitorView from './views/SerialMonitorView';
import SettingsView from './views/SettingsView';
import SupportView from './views/SupportView';
import HomeView from './views/HomeView';
import { Config } from './config';
import { DeviceType, MulticastDnsInformation } from './gql/generated/types';
import useNetworkDevices, {
  mdnsTypeToDeviceType,
} from './hooks/useNetworkDevices';
import WifiDeviceNotification from './components/WifiDeviceNotification';
import AppStateProvider from './context/AppStateProvider';
import useBuildProgressNotifications from './hooks/useBuildProgressNotifications';
import useBuildLogs from './hooks/useBuildLogs';
import useResolvedThemeMode from './hooks/useResolvedThemeMode';

interface ThemeWrapperProps {
  children: React.ReactNode;
}

const ThemeWrapper: FunctionComponent<ThemeWrapperProps> = ({ children }) => {
  const resolvedMode = useResolvedThemeMode();
  const theme = useMemo(() => createAppTheme(resolvedMode), [resolvedMode]);

  // Sync the body/html background with the current theme.
  // The flash-prevention script in index.ejs sets an inline background-color
  // at load time to avoid a white flash. We override it here whenever the
  // theme changes so CssBaseline's background takes effect.
  useEffect(() => {
    const bg = theme.palette.background.default;
    document.body.style.backgroundColor = bg;
    document.documentElement.style.backgroundColor = bg;
  }, [theme]);

  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </StyledEngineProvider>
  );
};

const App = () => {
  const { networkDevices, newNetworkDevices, removeDeviceFromNewList }
    = useNetworkDevices();

  const [device, setDevice] = useState<string | null>('');

  const onDeviceChange = useCallback(
    (dnsDevice: MulticastDnsInformation | null) => {
      const dnsDeviceName = dnsDevice?.name ?? null;
      setDevice(dnsDeviceName);
      if (dnsDevice) {
        if (mdnsTypeToDeviceType(dnsDevice.type) === DeviceType.Backpack) {
          window.location.href = '#/backpack';
        } else {
          window.location.href = '#/configurator';
        }
      }
    },
    [],
  );

  const {
    buildProgressNotifications,
    resetBuildProgressNotifications,
  } = useBuildProgressNotifications();

  const { buildLogs, resetLogs } = useBuildLogs();

  return (
    <ApolloProvider client={client}>
      <AppStateProvider>
        <ThemeWrapper>
          <HashRouter>
            <Routes>
              <Route
                path="/"
                element={<Navigate replace to="/home" />}
              />
              <Route path="/home" element={<HomeView />} />
              <Route
                path="/configurator"
                element={(
                  <ConfiguratorView
                    key="configurator"
                    gitRepository={Config.expressLRSGit}
                    selectedDevice={device}
                    networkDevices={networkDevices}
                    onDeviceChange={onDeviceChange}
                    deviceType={DeviceType.ExpressLRS}
                    buildProgressNotifications={buildProgressNotifications}
                    resetBuildProgressNotifications={
                      resetBuildProgressNotifications
                    }
                    buildLogs={buildLogs}
                    resetBuildLogs={resetLogs}
                  />
                )}
              />
              <Route
                path="/backpack"
                element={(
                  <ConfiguratorView
                    key="backpack"
                    gitRepository={Config.backpackGit}
                    selectedDevice={device}
                    networkDevices={networkDevices}
                    onDeviceChange={onDeviceChange}
                    deviceType={DeviceType.Backpack}
                    buildProgressNotifications={buildProgressNotifications}
                    resetBuildProgressNotifications={
                      resetBuildProgressNotifications
                    }
                    buildLogs={buildLogs}
                    resetBuildLogs={resetLogs}
                  />
                )}
              />
              <Route path="/logs" element={<LogsView />} />
              <Route path="/serial-monitor" element={<SerialMonitorView />} />
              <Route path="/settings" element={<SettingsView />} />
              <Route path="/support" element={<SupportView />} />
            </Routes>
          </HashRouter>
          <WifiDeviceNotification
            newNetworkDevices={newNetworkDevices}
            removeDeviceFromNewList={removeDeviceFromNewList}
            onDeviceChange={onDeviceChange}
          />
        </ThemeWrapper>
      </AppStateProvider>
    </ApolloProvider>
  );
};

export default App;
