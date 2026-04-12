import AppStatus from './enum/AppStatus';
import ThemeMode from './enum/ThemeMode';

export default interface AppState {
  appStatus: AppStatus;
  isExpertModeEnabled: boolean;
  themeMode: ThemeMode;
}
