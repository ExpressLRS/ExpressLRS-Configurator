import React, { useCallback, useState } from 'react';
import { Routes, Route, HashRouter, Navigate } from 'react-router-dom';
import CssBaseline from '@mui/material/CssBaseline';
import '@fontsource/roboto';
import { ThemeProvider, StyledEngineProvider } from '@mui/material';
import { ApolloProvider } from '@apollo/client';
import theme from './theme';
import client from './gql';
import ConfiguratorView from './views/ConfiguratorView';
import SettingsView from './views/SettingsView';
import LogsView from './views/LogsView';
import SerialMonitorView from './views/SerialMonitorView';
import SupportView from './views/SupportView';
import { Config } from './config';
import { DeviceType, MulticastDnsInformation } from './gql/generated/types';
import useNetworkDevices from './hooks/useNetworkDevices';
import WifiDeviceNotification from './components/WifiDeviceNotification';
import AppStateProvider from './context/AppStateProvider';

const App = () => {
  const { networkDevices, newNetworkDevices, removeDeviceFromNewList } =
    useNetworkDevices();

  const [device, setDevice] = useState<string | null>('');

  const onDeviceChange = useCallback(
    (dnsDevice: MulticastDnsInformation | null) => {
      const dnsDeviceName = dnsDevice?.name ?? null;
      setDevice(dnsDeviceName);
      if (dnsDevice) {
        const dnsDeviceType = dnsDevice.type.toUpperCase();
        if (dnsDeviceType === 'TX' || dnsDeviceType === 'RX') {
          window.location.href = '#/configurator';
        } else if (dnsDeviceType === 'TXBP' || dnsDeviceType === 'VRX') {
          window.location.href = '#/backpack';
        }
      }
    },
    []
  );

  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <ApolloProvider client={client}>
          <AppStateProvider>
            <HashRouter>
              <Routes>
                <Route
                  path="/"
                  element={<Navigate replace to="/configurator" />}
                />
                <Route
                  path="/configurator"
                  element={
                    <ConfiguratorView
                      key="configurator"
                      gitRepository={Config.expressLRSGit}
                      selectedDevice={device}
                      networkDevices={networkDevices}
                      onDeviceChange={onDeviceChange}
                      deviceType={DeviceType.ExpressLRS}
                    />
                  }
                />
                <Route
                  path="/backpack"
                  element={
                    <ConfiguratorView
                      key="backpack"
                      gitRepository={Config.backpackGit}
                      selectedDevice={device}
                      networkDevices={networkDevices}
                      onDeviceChange={onDeviceChange}
                      deviceType={DeviceType.Backpack}
                    />
                  }
                />
                <Route path="/settings" element={<SettingsView />} />
                <Route path="/logs" element={<LogsView />} />
                <Route path="/serial-monitor" element={<SerialMonitorView />} />
                <Route path="/support" element={<SupportView />} />
              </Routes>
            </HashRouter>
            <WifiDeviceNotification
              newNetworkDevices={newNetworkDevices}
              removeDeviceFromNewList={removeDeviceFromNewList}
              onDeviceChange={onDeviceChange}
            />
          </AppStateProvider>
        </ApolloProvider>
      </ThemeProvider>
    </StyledEngineProvider>
  );
};

export default App;
