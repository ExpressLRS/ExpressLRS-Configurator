import { registerEnumType } from 'type-graphql';

enum BuildFirmwareErrorType {
  PythonDependencyError = 'PythonDependencyError',
  PlatformioDependencyError = 'PlatformioDependencyError',
  GitDependencyError = 'GitDependencyError',
  BuildError = 'BuildError',
  FlashError = 'FlashError',
  GenericError = 'GenericError',
  TargetMismatch = 'TargetMismatch',
}

registerEnumType(BuildFirmwareErrorType, {
  name: 'BuildFirmwareErrorType',
});

export default BuildFirmwareErrorType;
