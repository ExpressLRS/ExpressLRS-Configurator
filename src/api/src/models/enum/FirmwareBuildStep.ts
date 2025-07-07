import { registerEnumType } from 'type-graphql';

enum BuildFirmwareStep {
  VERIFYING_BUILD_SYSTEM = 'VERIFYING_BUILD_SYSTEM',
  DOWNLOADING_FIRMWARE = 'DOWNLOADING_FIRMWARE',
  BUILDING_FIRMWARE = 'BUILDING_FIRMWARE',
  FLASHING_FIRMWARE = 'FLASHING_FIRMWARE',
}

registerEnumType(BuildFirmwareStep, {
  name: 'BuildFirmwareStep',
});

export default BuildFirmwareStep;
