import { registerEnumType } from 'type-graphql';

enum BuildFirmwareSubstep {
  InstallingDependencies = 'INSTALLING_DEPENDENCIES',
  CompilingFirmware = 'COMPILING_FIRMWARE',
  PackagingFirmware = 'PACKAGING_FIRMWARE',
  DetectingDevice = 'DETECTING_DEVICE',
  ConnectingToDevice = 'CONNECTING_TO_DEVICE',
  ErasingFlash = 'ERASING_FLASH',
  WritingFirmware = 'WRITING_FIRMWARE',
  VerifyingFirmware = 'VERIFYING_FIRMWARE',
  RestartingDevice = 'RESTARTING_DEVICE',
  UploadingFirmware = 'UPLOADING_FIRMWARE',
  TargetMismatch = 'TARGET_MISMATCH',
}

registerEnumType(BuildFirmwareSubstep, {
  name: 'BuildFirmwareSubstep',
});

export default BuildFirmwareSubstep;
