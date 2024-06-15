import AppStatus from './enum/AppStatus';

export default interface AppState {
  appStatus: AppStatus;
  isExpertModeEnabled: boolean;
}
