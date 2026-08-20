export enum IpcRequest {
  OpenFileLocation = 'OPEN_FILE_LOCATION',
  OpenLogsFolder = 'OPEN_LOGS_FOLDER',
  UpdateBuildStatus = 'UPDATE_BUILD_STATUS',
  ChooseFolder = 'CHOOSE_FOLDER',
  SaveFile = 'SAVE_FILE',
  SaveBuildOutput = 'SAVE_BUILD_OUTPUT',
  DownloadFile = 'DOWNLOAD_FILE',
}

export interface OpenFileLocationRequestBody {
  path: string;
}

export interface UpdateBuildStatusRequestBody {
  buildInProgress: boolean;
}

export interface ChooseFolderRequestBody {
  title?: string;
  message?: string;
  defaultPath?: string;
}

export interface ChooseFolderResponseBody {
  success: boolean;
  directoryPath: string;
}

export interface SaveFileRequestBody {
  defaultPath?: string;
  data: string | Uint8Array;
}

export interface SaveFileResponseBody {
  success: boolean;
  path: string;
}

export interface SaveBuildOutputRequestBody {
  /**
   * Firmware binary produced by the build. Every file that sits next to it is
   * considered a build artefact and is copied along with it.
   */
  firmwareBinPath: string;
  /**
   * When set, artefacts are copied into this directory without asking the
   * user. When empty, a folder selection dialog is shown.
   */
  destinationDirectory?: string;
  title?: string;
  message?: string;
}

export interface SaveBuildOutputResponseBody {
  success: boolean;
  /** true when the user dismissed the folder selection dialog */
  canceled: boolean;
  /** folder the artefacts have been copied into */
  directoryPath: string;
  /** firmware binary inside directoryPath */
  firmwareBinPath: string;
  message?: string;
}

export interface DownloadFileRequestBody {
  url: string;
}
