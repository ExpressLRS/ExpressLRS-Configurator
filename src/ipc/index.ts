export enum IpcRequest {
  OpenFileLocation = 'OPEN_FILE_LOCATION',
  OpenLogsFolder = 'OPEN_LOGS_FOLDER',
  UpdateBuildStatus = 'UPDATE_BUILD_STATUS',
}

export interface OpenFileLocationRequestBody {
  path: string;
}

export interface UpdateBuildStatusRequestBody {
  buildInProgress: boolean;
}
