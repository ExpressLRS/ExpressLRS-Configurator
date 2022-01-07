import { useContext } from 'react';
import { AppStateContext } from '../context/AppStateProvider';
import AppStatus from '../models/enum/AppStatus';

export default function useAppState() {
  const context = useContext(AppStateContext);
  if (context === undefined)
    throw new Error(`No provider for AppStateContext given`);

  const { appState, setAppState } = context;

  const setAppStatus = (mode: AppStatus) => {
    setAppState({ ...appState, appStatus: mode });
  };

  return { ...appState, setAppStatus };
}
