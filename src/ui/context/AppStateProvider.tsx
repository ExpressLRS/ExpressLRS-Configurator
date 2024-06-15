import React, { FunctionComponent, useMemo, useState } from 'react';
import AppState from '../models/AppState';
import AppStatus from '../models/enum/AppStatus';
import ApplicationStorage from '../storage';

export const AppStateContext = React.createContext<{
  appState: AppState;
  setAppState: (appState: AppState) => void;
}>({
  appState: {
    appStatus: AppStatus.Interactive,
    isExpertModeEnabled: false,
  },
  setAppState: () => {},
});

interface AppStateProviderContextProps {
  children?: React.ReactNode;
}

const AppStateProvider: FunctionComponent<AppStateProviderContextProps> = ({
  children,
}) => {
  const [appState, setAppState] = useState<AppState>(() => {
    const storage = new ApplicationStorage();
    return {
      appStatus: AppStatus.Interactive,
      isExpertModeEnabled: storage.getExpertModeEnabled() ?? false,
    };
  });
  const preSetAppState = (state: AppState) => {
    const storage = new ApplicationStorage();
    storage.setExpertModeEnabled(state.isExpertModeEnabled);
    setAppState(state);
  };
  const value = useMemo(
    () => ({ appState, setAppState: preSetAppState }),
    [appState]
  );
  return (
    <AppStateContext.Provider value={value}>
      {children}
    </AppStateContext.Provider>
  );
};

export default AppStateProvider;
