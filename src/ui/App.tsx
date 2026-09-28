import { FunctionComponent, useCallback, useEffect, useMemo, useState } from 'react';
import { Routes, Route, HashRouter, Navigate } from 'react-router';
import CssBaseline from '@mui/material/CssBaseline';
import '@fontsource/roboto';
import { ThemeProvider } from '@mui/material';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';
import { prefixer } from 'stylis';
import rtlPlugin from 'stylis-plugin-rtl';
import { useTranslation } from 'react-i18next';
import { ApolloProvider } from '@apollo/client/react';
import { createAppTheme, ThemeDirection } from './theme';
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

// Emotion caches per text direction. The RTL cache flips left/right styles
// (margins, paddings, positions) for right-to-left languages such as Arabic.
// `prepend: true` replaces StyledEngineProvider's injectFirst.
const emotionCaches: Record<ThemeDirection, ReturnType<typeof createCache>> = {
  ltr: createCache({ key: 'mui', prepend: true }),
  rtl: createCache({
    key: 'muirtl',
    prepend: true,
    stylisPlugins: [prefixer, rtlPlugin],
  }),
};

interface ThemeWrapperProps {
  children: React.ReactNode;
}

const ThemeWrapper: FunctionComponent<ThemeWrapperProps> = ({ children }) => {
  const resolvedMode = useResolvedThemeMode();
  const { i18n } = useTranslation();
  const language = i18n.resolvedLanguage ?? i18n.language;
  const direction: ThemeDirection = i18n.dir(language);
  const theme = useMemo(
    () => createAppTheme(resolvedMode, direction, language),
    [resolvedMode, direction, language],
  );

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
    <CacheProvider value={emotionCaches[direction]}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </CacheProvider>
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
