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
            <Route path="/configurator" component={ConfiguratorView} />
            <Route path="/settings" component={SettingsView} />
            <Route path="/logs" component={LogsView} />
          </Switch>
        </HashRouter>
      </ApolloProvider>
    </ThemeProvider>
  );
}
