import React from 'react';
import { Switch, Route, Redirect, HashRouter } from 'react-router-dom';
import CssBaseline from '@material-ui/core/CssBaseline';
import '@fontsource/roboto';
import { ThemeProvider } from '@material-ui/core';
import theme from './theme';

import ConfiguratorView from './views/ConfiguratorView';
import SettingsView from './views/SettingsView';
import LogsView from './views/LogsView';

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
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
    </ThemeProvider>
  );
}
