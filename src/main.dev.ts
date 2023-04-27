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
import { app, BrowserWindow, dialog, ipcMain, shell } from 'electron';
import mkdirp from 'mkdirp';
import winston from 'winston';
import fs from 'fs';
import MenuBuilder from './menu';
import ApiServer from './api';
import {
  ChooseFolderResponseBody,
  IpcRequest,
  OpenFileLocationRequestBody,
  SaveFileRequestBody,
  SaveFileResponseBody,
  UpdateBuildStatusRequestBody,
} from './ipc';
import Updater from './app/updater';
import WinstonLoggerService from './api/src/logger/WinstonLogger';

import packageJson from '../package.json';

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
logger.log('path', {
  PATH: process.env.PATH,
});

const isWindows = process.platform.startsWith('win');
const isMacOS = process.platform.startsWith('darwin');
let userDataDirectory = app.getPath('userData');

if (isWindows) {
  const dirtyUserDataDirectory = app.isPackaged
    ? path.join('c:', 'ProgramData', packageJson.name)
    : path.join('c:', 'ProgramData', `${packageJson.name}-dev`);
  try {
    const isASCII = (str: string) => {
      return /^[\x20-\x7F]*$/.test(str);
    };
    if (!isASCII(userDataDirectory)) {
      mkdirp.sync(dirtyUserDataDirectory);
      userDataDirectory = dirtyUserDataDirectory;
      logger.log(
        `Non-ASCII path detected, using ${dirtyUserDataDirectory} directory for firmware storage`
      );
    } else {
      logger.log(
        `using appdata path ${userDataDirectory} for firmware storage`
      );
    }
  } catch (err) {
    logger.error(
      'failed to create c:/.expresslrs directory, will use usual path',
      undefined,
      {
        err,
      }
    );
  }
}

// eslint-disable-next-line @typescript-eslint/ban-types
const handleFatalError = (err: Error | object | null | undefined) => {
  logger.error(`handling fatal error: ${err}`);
  try {
    // eslint-disable-next-line promise/no-promise-in-callback
    dialog
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      .showMessageBox(undefined, {
        type: 'error',
        buttons: ['Okay'],
        title: 'Oops! Something went wrong!',
        detail: 'Help us improve your experience by sending an error report',
        message: `Error: ${err}`,
      })
      .then(() => {
        console.log('received resp from message box');
        process.exit(1);
      })
      .catch((dialogErr) => {
        logger.error('failed to show error dialog', dialogErr.stack);
        process.exit(1);
      });
  } catch (e) {
    /*
      This API can be called safely before the ready event the app module emits, it is usually used to report errors
      in early stage of startup. If called before the app readyevent on Linux, the message will be emitted to stderr,
      and no GUI dialog will appear.
     */
    dialog.showErrorBox('Oops! Something went wrong!', `Error: ${err}`);
    process.exit(1);
  }
};
process.on('uncaughtException', (err) => {
  logger.error(`uncaughtException ${err.message}`, err.stack);
  handleFatalError(err);
});
process.on('unhandledRejection', (err) => {
  logger.error(`unhandledRejection: ${err}`);
  handleFatalError(err);
});

if (app.commandLine.hasSwitch('disable-gpu')) {
  app.disableHardwareAcceleration();
  app.commandLine.appendSwitch('disable-software-rasterizer');
}

let mainWindow: BrowserWindow | null = null;
let updater: Updater | null = null;
const localServer: ApiServer = new ApiServer();

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
  const installer = await import('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = [installer.REACT_DEVELOPER_TOOLS];
  return installer
    .default(extensions, {
      forceDownload,
      loadExtensionOptions: {
        allowFileAccess: true,
      },
    })
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
  logger.log(`received unused port`, { port });

  logger.log('starting server...');
  const firmwaresPath = path.join(userDataDirectory, 'firmwares', 'github');
  await mkdirp(firmwaresPath);
  const firmwareCloudCachePath = path.join(
    userDataDirectory,
    'firmwares',
    'cloud'
  );
  await mkdirp(firmwareCloudCachePath);
  const targetsStoragePath = path.join(
    userDataDirectory,
    'firmwares',
    'targets'
  );
  const userDefinesStoragePath = path.join(
    userDataDirectory,
    'firmwares',
    'userDefines'
  );

  const dependenciesPath = app.isPackaged
    ? path.join(process.resourcesPath, '../dependencies')
    : path.join(__dirname, '../dependencies');

  const getPlatformioPath = path.join(dependenciesPath, 'get-platformio.py');
  const platformioStateTempStoragePath = path.join(
    userDataDirectory,
    'platformio-temp-state-storage'
  );

  const localApiServerEnv = process.env;

  /* Set the temp directory for the PlatformIO Installer */
  localApiServerEnv.PLATFORMIO_INSTALLER_TMPDIR = userDataDirectory;

  if (isWindows) {
    const publicFolder = 'C:\\Users\\Public';
    try {
      // As of 2023-04-25, Platform IO installer fails on "building wheel for platformio"
      // if the path to the installer temporary directory is too long, so use the Public
      // User folder instead of the app data directory
      if (fs.existsSync(publicFolder)) {
        const testFile = path.join(publicFolder, `${Date.now()}.txt`);
        fs.writeFileSync(testFile, '');
        fs.unlinkSync(testFile);
        localApiServerEnv.PLATFORMIO_INSTALLER_TMPDIR = publicFolder;
        logger.log(
          `using public folder ${publicFolder} for PlatformIO Installer`
        );
      } else {
        logger.log(
          `using appdata path ${userDataDirectory} for PlatformIO Installer`
        );
      }
    } catch (err) {
      logger.error(
        `${publicFolder} not writable, using ${userDataDirectory} for PlatformIO Installer`,
        undefined,
        {
          err,
        }
      );
    }
  }

  /*
    We manually prepend $PATH on Windows and macOS machines with portable Git and Python locations.
   */
  let PATH = process.env.PATH ?? '';
  const prependPATH = (pth: string, item: string): string => {
    if (pth.indexOf(item) > -1) {
      return pth;
    }
    if (pth.length > 0) {
      return `${item}${path.delimiter}${pth}`;
    }
    return item;
  };

  if (isWindows) {
    const portablePythonLocation = path.join(
      dependenciesPath,
      'windows_amd64/python'
    );
    const portableGitLocation = path.join(
      dependenciesPath,
      'windows_amd64/PortableGit/bin'
    );
    PATH = prependPATH(PATH, portablePythonLocation);
    PATH = prependPATH(PATH, portableGitLocation);
  }
  if (isMacOS) {
    const portablePythonLocation = path.join(
      dependenciesPath,
      'darwin_amd64/python-portable-darwin-3.8.4/bin'
    );
    const portableGitLocation = path.join(
      dependenciesPath,
      'darwin_amd64/git-2.29.2/bin'
    );
    PATH = prependPATH(PATH, portablePythonLocation);
    PATH = prependPATH(PATH, portableGitLocation);
    localApiServerEnv.GIT_EXEC_PATH = path.join(
      dependenciesPath,
      'darwin_amd64/git-2.29.2/libexec/git-core'
    );
  }
  localApiServerEnv.PATH = PATH;

  const devicesPath = app.isPackaged
    ? path.join(process.resourcesPath, 'devices')
    : path.join(__dirname, '../devices');

  logger.log('local api server PATH', {
    PATH,
  });

  await localServer.start(
    {
      configuratorGit: {
        url: packageJson.repository.url.replaceAll('git+', ''),
        owner: packageJson.build.publish.owner,
        repositoryName: packageJson.build.publish.repo,
      },
      multicastDnsSimulatorEnabled:
        process.env.MULTICAST_DNS_SIMULATOR_ENABLED === 'true',
      firmwaresPath,
      cloudCacheServer: 'https://artifactory.expresslrs.org',
      firmwareCloudCachePath,
      getPlatformioPath,
      platformioStateTempStoragePath,
      PATH,
      env: localApiServerEnv,
      devicesPath,
      targetsStoragePath,
      userDefinesStoragePath,
      userDataPath: app.getPath('userData'),
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
  mainWindow.on('close', (e) => {
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    if (buildInProgress) {
      const choice = dialog.showMessageBoxSync(mainWindow!, {
        type: 'question',
        buttons: ['Yes', 'No'],
        title: 'Are you sure you want to quit?',
        message: 'It looks like you have a build in progress',
      });
      if (choice === 1) {
        e.preventDefault();
      }
    }
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

    // set the window title based on package.json
    const windowTitle = require('./package.json').productName;
    mainWindow.setTitle(windowTitle);
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

  updater = new Updater(logger, mainWindow);
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
    logger.error(`createWindow error ${err}`);
    handleFatalError(err);
  })
  .then(() => {
    return updater?.checkForUpdates();
  })
  .catch((err: Error) => {
    logger.error(`Auto update error ${err}`);
  });

app.on('activate', () => {
  // On macOS, it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow();
  }
});

/*
  Handle IPC requests from the User Interface
 */
ipcMain.on(
  IpcRequest.OpenFileLocation,
  (_, arg: OpenFileLocationRequestBody) => {
    logger.log('received a request to show item in folder', {
      path: arg.path,
    });
    shell.showItemInFolder(arg.path);
  }
);

ipcMain.handle(
  IpcRequest.ChooseFolder,
  async (): Promise<ChooseFolderResponseBody> => {
    const result = await dialog.showOpenDialog({
      title: 'Select firmware source folder',
      message: 'Folder must contain platformio.ini file',
      properties: ['openDirectory'],
    });
    if (result.canceled || result.filePaths.length === 0) {
      return {
        success: false,
        directoryPath: '',
      };
    }
    return {
      success: true,
      directoryPath: result.filePaths[0],
    };
  }
);

ipcMain.on(IpcRequest.OpenLogsFolder, () => {
  const logsLocation = path.join(logsPath, logsFilename);
  logger.log('received a request to logs path', {
    logsLocation,
  });
  shell.showItemInFolder(logsLocation);
});

let buildInProgress = false;
ipcMain.on(
  IpcRequest.UpdateBuildStatus,
  (_, arg: UpdateBuildStatusRequestBody) => {
    buildInProgress = arg.buildInProgress;
    logger.log('received a request to update build status', {
      arg,
    });
  }
);

ipcMain.handle(
  IpcRequest.SaveFile,
  async (_, arg: SaveFileRequestBody): Promise<SaveFileResponseBody> => {
    const result = await dialog.showSaveDialog({
      title: 'Save File',
      defaultPath: arg.defaultPath,
    });
    if (result.canceled || !result.filePath || result.filePath.length === 0) {
      return {
        success: false,
        path: '',
      };
    }
    await fs.promises.writeFile(result.filePath, arg.data);
    return {
      success: true,
      path: result.filePath,
    };
  }
);
