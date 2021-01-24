export enum MainRequestType {
  CheckDependencies = 'CHECK_DEPENDENCIES_REQ',
  InstallDependencies = 'INSTALL_DEPENDENCIES_REQ',
  BuildFlashFirmware = 'BUILD_FLASH_FIRMWARE_REQ',
}

export enum MainResponseType {
  CheckDependencies = 'CHECK_DEPENDENCIES_RES',
  InstallDependencies = 'INSTALL_DEPENDENCIES_RES',
  BuildFlashFirmware = 'BUILD_FLASH_FIRMWARE_RES',
}

export enum PushMessageType {
  FlashFirmWareProgressNotification = 'FLASH_FIRMWARE_PROGRESS_NOTIFICATION',
  BuildFlashLogEntry = 'BUILD_FLASH_LOG_ENTRY',
  InstallDependenciesLogEntry = 'BUILD_FLASH_LOG_ENTRY',
}
