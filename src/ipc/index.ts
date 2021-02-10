export enum IpcRequest {
  OpenFileLocation = 'OPEN_FILE_LOCATION',
}

export interface OpenFileLocationRequestBody {
  path: string;
}
