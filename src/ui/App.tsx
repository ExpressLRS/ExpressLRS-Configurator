import React, { useCallback, useState } from 'react';
import { Switch, Route, Redirect, HashRouter } from 'react-router-dom';
import CssBaseline from '@material-ui/core/CssBaseline';
import '@fontsource/roboto';
import { ThemeProvider } from '@material-ui/core';
import { ApolloProvider } from '@apollo/client';
import theme from './theme';
import client from './gql';
import ConfiguratorView from './views/ConfiguratorView';
import SettingsView from './views/SettingsView';
import LogsView from './views/LogsView';
import SerialMonitorView from './views/SerialMonitorView';
import SupportView from './views/SupportView';
import { Config } from './config';
import { MulticastDnsInformation } from './gql/generated/types';
import useNetworkDevices from './hooks/useNetworkDevices';
import WifiDeviceNotification from './components/WifiDeviceNotification';

export default function App() {
  const {
    networkDevices,
    newNetworkDevices,
    removeDeviceFromNewList,
  } = useNetworkDevices();

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
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ApolloProvider client={client}>
        <HashRouter>
          <Switch>
            <Route exact path="/">
              <Redirect to="/configurator" />
            </Route>
            <Route path="/configurator">
              <ConfiguratorView
                key="configurator"
                gitRepository={Config.expressLRSGit}
                selectedDevice={device}
                networkDevices={networkDevices}
                onDeviceChange={onDeviceChange}
              />
            </Route>
            <Route path="/backpack">
              <ConfiguratorView
                key="backpack"
                gitRepository={Config.backpackGit}
                selectedDevice={device}
                networkDevices={networkDevices}
                onDeviceChange={onDeviceChange}
              />
            </Route>
            <Route path="/settings" component={SettingsView} />
            <Route path="/logs" component={LogsView} />
            <Route path="/serial-monitor" component={SerialMonitorView} />
            <Route path="/support" component={SupportView} />
          </Switch>
        </HashRouter>
        <WifiDeviceNotification
          newNetworkDevices={newNetworkDevices}
          removeDeviceFromNewList={removeDeviceFromNewList}
          onDeviceChange={onDeviceChange}
        />
      </ApolloProvider>
    </ThemeProvider>
  );
}
