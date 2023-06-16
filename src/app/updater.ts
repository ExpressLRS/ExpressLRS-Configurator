import { autoUpdater } from 'electron-updater';
import { BrowserWindow, dialog } from 'electron';
import { useTranslation } from 'react-i18next';
import { LoggerService } from '../api/src/logger';

export default class Updater {
  constructor(
    private logger: LoggerService,
    private mainWindow: BrowserWindow
  ) {
    autoUpdater.autoDownload = false;

    autoUpdater.on('error', (error) => {
      this.logger.error(error, error.stack);
    });

    autoUpdater.on('update-available', async () => {
      const { t } = useTranslation();
      const response = await dialog.showMessageBox(this.mainWindow, {
        type: 'info',
        title: t('Updater.FoundUpdates'),
        message: t('Updater.UdateNow'),
        buttons: [t('Updater.Sure'), t('Updater.Later')],
      });

      if (response.response === 0) {
        logger.log('Downloading Update');
        autoUpdater.downloadUpdate();
        await dialog.showMessageBox(this.mainWindow, {
          type: 'info',
          title: t('Updater.UpdateDownloading'),
          message: t('Updater.notifiedWhenReadyToInstall'),
          buttons: [],
        });
      }
    });

    autoUpdater.on('update-downloaded', async () => {
      const { t } = useTranslation();
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
