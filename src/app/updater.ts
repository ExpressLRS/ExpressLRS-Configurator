import { autoUpdater } from 'electron-updater';
import { BrowserWindow, dialog } from 'electron';
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
      const response = await dialog.showMessageBox(this.mainWindow, {
        type: 'info',
        title: 'Found Updates',
        message: 'Found updates, do you want update now?',
        buttons: ['Sure', 'Later'],
      });

      if (response.response === 0) {
        logger.log('Downloading Update');
        autoUpdater.downloadUpdate();
        await dialog.showMessageBox(this.mainWindow, {
          type: 'info',
          title: 'Update Downloading',
          message:
            'Update is being downloaded, you will be notified when it is ready to install',
          buttons: [],
        });
      }
    });

    autoUpdater.on('update-downloaded', async () => {
      const response = await dialog.showMessageBox(this.mainWindow, {
        type: 'info',
        buttons: ['Restart', 'Later'],
        title: 'Application Update',
        message: 'Update',
        detail:
          'A new version has been downloaded. Restart the application to apply the updates.',
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
