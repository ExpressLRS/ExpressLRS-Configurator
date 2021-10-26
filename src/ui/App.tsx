import React from 'react';
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

export default function App() {
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
              <ConfiguratorView gitRepository={Config.expressLRSGit} />
            </Route>
            <Route path="/settings" component={SettingsView} />
            <Route path="/logs" component={LogsView} />
            <Route path="/serial-monitor" component={SerialMonitorView} />
            <Route path="/support" component={SupportView} />
          </Switch>
        </HashRouter>
      </ApolloProvider>
    </ThemeProvider>
  );
}
