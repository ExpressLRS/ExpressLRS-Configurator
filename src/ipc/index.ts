export enum IpcRequest {
  OpenFileLocation = 'OPEN_FILE_LOCATION',
  OpenLogsFolder = 'OPEN_LOGS_FOLDER',
}

export interface OpenFileLocationRequestBody {
  path: string;
}
