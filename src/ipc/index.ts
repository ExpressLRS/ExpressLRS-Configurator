export enum IpcRequest {
  OpenFileLocation = 'OPEN_FILE_LOCATION',
  OpenLogsFolder = 'OPEN_LOGS_FOLDER',
  UpdateBuildStatus = 'UPDATE_BUILD_STATUS',
  ChooseFolder = 'CHOOSE_FOLDER',
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
