import 'reflect-metadata';
/* eslint global-require: off, no-console: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `yarn build` or `yarn build-main`, this file is compiled to
 * `./src/main.prod.js` using webpack. This gives us some performance wins.
 */
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import path from 'path';
import { app, BrowserWindow, ipcMain, shell } from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import mkdirp from 'mkdirp';
import winston from 'winston';
import MenuBuilder from './menu';
import ApiServer from './api';
import { IpcRequest, OpenFileLocationRequestBody } from './ipc';
import WinstonLoggerService from './api/src/logger/WinstonLogger';

const logsPath = path.join(app.getPath('userData'), 'logs');
const logsFilename = 'expressslrs-configurator.log';
const winstonLogger = winston.createLogger({
  level: 'debug',
  format: winston.format.simple(),
  defaultMeta: {},
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.prettyPrint(),
        winston.format.timestamp()
      ),
    }),
    new winston.transports.File({
      dirname: logsPath,
      filename: logsFilename,
      maxFiles: 10,
      maxsize: 5_000_000, // in bytes
      format: winston.format.combine(
        winston.format.prettyPrint(),
        winston.format.timestamp()
      ),
    }),
  ],
});
const logger = new WinstonLoggerService(winstonLogger);
process.on('uncaughtException', (err) => {
  logger.error(`uncaughtException ${err.message}`, err.stack);
});
process.on('unhandledRejection', (err) => {
  logger.error(`unhandledRejection: ${err}`);
});

let mainWindow: BrowserWindow | null = null;
const localServer: ApiServer = new ApiServer();

export default class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

if (
  process.env.NODE_ENV === 'development' ||
  process.env.DEBUG_PROD === 'true'
) {
  require('electron-debug')({
    showDevTools: false,
  });
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS', 'APOLLO_DEVELOPER_TOOLS'];

  return installer
    .default(
      extensions.map((name) => installer[name]),
      forceDownload
    )
    .catch((err: Error) => {
      logger.error(err);
    });
};

const createWindow = async () => {
  if (
    process.env.NODE_ENV === 'development' ||
    process.env.DEBUG_PROD === 'true'
  ) {
    await installExtensions();
  }

  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(__dirname, '../assets');

  const getAssetPath = (...paths: string[]): string => {
    return path.join(RESOURCES_PATH, ...paths);
  };

  logger.log('trying to get port');
  const port = await ApiServer.getPort(3500);
  logger.log(`received unused port: ${port}`);

  logger.log('starting server...');
  const firmwaresPath = path.join(app.getPath('userData'), 'firmwares', 'git');
  await mkdirp(firmwaresPath);
  await localServer.start(
    {
      git: {
        cloneUrl: 'https://github.com/AlessandroAU/ExpressLRS',
        url: 'https://github.com/AlessandroAU/ExpressLRS',
        owner: 'AlessandroAU',
        repositoryName: 'ExpressLRS',
      },
      firmwaresPath,
      PATH: process.env.PATH ?? '',
      env: process.env,
    },
    logger,
    port
  );
  logger.log('server started');

  mainWindow = new BrowserWindow({
    show: false,
    width: 1400,
    height: 920,
    icon: getAssetPath('icon.png'),
    // TODO: improve electron.js security
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  const apiUrl = `http://localhost:${port}/graphql`;
  const subscriptionsUrl = `ws://localhost:${port}/graphql`;
  mainWindow.loadURL(
    `file://${__dirname}/index.html?api_url=${apiUrl}&subscriptions_url=${subscriptionsUrl}`
  );

  // TODO: Use 'ready-to-show' event
  //        https://github.com/electron/electron/blob/master/docs/api/browser-window.md#using-ready-to-show-event
  mainWindow.webContents.on('did-finish-load', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
      mainWindow.focus();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  // mainWindow.setMenuBarVisibility(false);
  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();

  // Open urls in the user's browser
  mainWindow.webContents.on('new-window', (event, url) => {
    event.preventDefault();
    shell.openExternal(url);
  });

  // Remove this if your app does not use auto updates
  // eslint-disable-next-line
  // new AppUpdater();
};
/**
 * Add event listeners...
 */

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    localServer.stop();
    app.quit();
  }
});

app
  .whenReady()
  .then(createWindow)
  .catch((err: Error) => {
    logger.error(err);
  });

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow();
  }
});

ipcMain.on(
  IpcRequest.OpenFileLocation,
  (_, arg: OpenFileLocationRequestBody) => {
    shell.showItemInFolder(arg.path);
  }
);

ipcMain.on(IpcRequest.OpenLogsFolder, () => {
  shell.showItemInFolder(`${logsPath}/${logsFilename}`);
});
