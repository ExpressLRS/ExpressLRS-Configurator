import React, { FunctionComponent, useState } from 'react';
import AppState from '../models/AppState';
import AppStatus from '../models/enum/AppStatus';

export const AppStateContext = React.createContext<{
  appState: AppState;
  setAppState: (appState: AppState) => void;
}>({
  appState: { appStatus: AppStatus.Interactive },
  setAppState: () => {},
});

interface AppStateProviderContextProps {
  children?: React.ReactNode;
}

const AppStateProvider: FunctionComponent<AppStateProviderContextProps> = ({
  children,
}) => {
  const [appState, setAppState] = useState<AppState>({
    appStatus: AppStatus.Interactive,
  });

  return (
    <AppStateContext.Provider value={{ appState, setAppState }}>
      {children}
    </AppStateContext.Provider>
  );
};

export default AppStateProvider;
