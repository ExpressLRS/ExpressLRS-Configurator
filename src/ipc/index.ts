export enum IpcRequest {
  OpenFileLocation = 'OPEN_FILE_LOCATION',
  OpenLogsFolder = 'OPEN_LOGS_FOLDER',
  UpdateBuildStatus = 'UPDATE_BUILD_STATUS',
  ChooseFolder = 'CHOOSE_FOLDER',
  SaveFile = 'SAVE_FILE',
  LoadLogFile = 'LOAD_LOG_FILE',
}

export interface OpenFileLocationRequestBody {
  path: string;
}

export interface UpdateBuildStatusRequestBody {
  buildInProgress: boolean;
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
