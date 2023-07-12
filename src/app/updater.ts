import { autoUpdater } from 'electron-updater';
import { BrowserWindow, dialog } from 'electron';
import { initReactI18next } from 'react-i18next';
import i18n from 'i18next';
import Backend from 'i18next-http-backend'; // For loading translations from backend
import { LoggerService } from '../api/src/logger';

export default class Updater {
  constructor(
    private logger: LoggerService,
    private mainWindow: BrowserWindow,
    private baseUrl: string
  ) {
    const systemLocale = Intl.DateTimeFormat().resolvedOptions().locale;

    const loadPath = `${
      this.baseUrl ?? 'http://localhost:3500/'
    }/locales/{{lng}}/messages.json`;

    i18n
      .use(Backend)
      .use(initReactI18next)
      .init({
        initImmediate: false,
        fallbackLng: 'en',
        backend: {
          loadPath,
        },
        debug:
          process.env.NODE_ENV === 'development' ||
          process.env.DEBUG_PROD === 'true',
      });

    i18n.loadLanguages(systemLocale);
    const t = i18n.getFixedT(systemLocale);

    autoUpdater.autoDownload = false;

    autoUpdater.on('error', (error) => {
      this.logger.error(error, error.stack);
    });

    autoUpdater.on('update-available', async () => {
      const response = await dialog.showMessageBox(this.mainWindow, {
        type: 'info',
        title: t('Updater.FoundUpdates'),
        message: t('Updater.UpdateNow'),
        buttons: [t('Updater.Sure'), t('Updater.Later')],
      });

      if (response.response === 0) {
        logger.log('Downloading Update');
        autoUpdater.downloadUpdate();
        await dialog.showMessageBox(this.mainWindow, {
          type: 'info',
          title: t('Updater.UpdateDownloading'),
          message: t('Updater.NotifiedWhenReadyToInstall'),
          buttons: [],
        });
      }
    });

    autoUpdater.on('update-downloaded', async () => {
      const response = await dialog.showMessageBox(this.mainWindow, {
        type: 'info',
        buttons: [t('Updater.Restart'), t('Updater.Later')],
        title: t('Updater.ApplicationUpdate'),
        message: t('Updater.Update'),
        detail: t('Updater.ApplyUpdates'),
      });
      if (response.response === 0) {
        setImmediate(() => autoUpdater.quitAndInstall());
      }
    });
  }

  async checkForUpdates() {
    const isMacOS = process.platform.startsWith('darwin');
    // does not work in development and macOS requires the application to be signed
    if (process.env.NODE_ENV !== 'development' && !isMacOS) {
      try {
        await autoUpdater.checkForUpdates();
      } catch (error) {
        this.logger.error(error);
      }
    }
  }
}
