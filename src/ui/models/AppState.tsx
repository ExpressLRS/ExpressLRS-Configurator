import AppStatus from './enum/AppStatus';
import FirmwareOutputMode from './enum/FirmwareOutputMode';
import ThemeMode from './enum/ThemeMode';

export default interface AppState {
  appStatus: AppStatus;
  isExpertModeEnabled: boolean;
  themeMode: ThemeMode;
  firmwareOutputMode: FirmwareOutputMode;
  firmwareOutputFolder: string;
}
