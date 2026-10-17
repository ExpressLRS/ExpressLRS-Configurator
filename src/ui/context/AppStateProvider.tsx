import React, { FunctionComponent, useMemo, useState } from 'react';
import AppState from '../models/AppState';
import AppStatus from '../models/enum/AppStatus';
import FirmwareOutputMode from '../models/enum/FirmwareOutputMode';
import ThemeMode from '../models/enum/ThemeMode';
import ApplicationStorage from '../storage';

export const AppStateContext = React.createContext<{
  appState: AppState;
  setAppState: (appState: AppState) => void;
}>({
      appState: {
        appStatus: AppStatus.Interactive,
        isExpertModeEnabled: false,
        themeMode: ThemeMode.System,
        firmwareOutputMode: FirmwareOutputMode.AskEveryTime,
        firmwareOutputFolder: '',
      },
      setAppState: () => {},
    });

interface AppStateProviderContextProps {
  children?: React.ReactNode;
}

const parseThemeMode = (value: string | null): ThemeMode => {
  switch (value) {
    case ThemeMode.Light:
      return ThemeMode.Light;
    case ThemeMode.Dark:
      return ThemeMode.Dark;
    case ThemeMode.System:
      return ThemeMode.System;
    default:
      return ThemeMode.System;
  }
};

const parseFirmwareOutputMode = (value: string | null): FirmwareOutputMode => {
  switch (value) {
    case FirmwareOutputMode.AskEveryTime:
      return FirmwareOutputMode.AskEveryTime;
    case FirmwareOutputMode.FixedFolder:
      return FirmwareOutputMode.FixedFolder;
    case FirmwareOutputMode.TemporaryFolder:
      return FirmwareOutputMode.TemporaryFolder;
    default:
      return FirmwareOutputMode.AskEveryTime;
  }
};

const AppStateProvider: FunctionComponent<AppStateProviderContextProps> = ({
  children,
}) => {
  const [appState, setAppState] = useState<AppState>(() => {
    const storage = new ApplicationStorage();
    return {
      appStatus: AppStatus.Interactive,
      isExpertModeEnabled: storage.getExpertModeEnabled() ?? false,
      themeMode: parseThemeMode(storage.getThemeMode()),
      firmwareOutputMode: parseFirmwareOutputMode(
        storage.getFirmwareOutputMode(),
      ),
      firmwareOutputFolder: storage.getFirmwareOutputFolder() ?? '',
    };
  });
  const preSetAppState = (state: AppState) => {
    const storage = new ApplicationStorage();
    storage.setExpertModeEnabled(state.isExpertModeEnabled);
    storage.setThemeMode(state.themeMode);
    storage.setFirmwareOutputMode(state.firmwareOutputMode);
    storage.setFirmwareOutputFolder(state.firmwareOutputFolder);
    setAppState(state);
  };
  const value = useMemo(
    () => ({ appState, setAppState: preSetAppState }),
    [appState],
  );
  return (
    <AppStateContext.Provider value={value}>
      {children}
    </AppStateContext.Provider>
  );
};

export default AppStateProvider;
