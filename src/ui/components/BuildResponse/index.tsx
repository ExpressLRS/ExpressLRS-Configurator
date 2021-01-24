import React, {FunctionComponent} from 'react';
import {Alert, AlertTitle} from '@material-ui/core';
import {BuildFirmwareErrorType, BuildFlashFirmwareResponseBody} from '../../../main/handlers/BuildFirmwareHandler';

interface BuildResponseProps {
  response: BuildFlashFirmwareResponseBody | null;
}

export const BuildResponse: FunctionComponent<BuildResponseProps> = ({response}) => {
  // TODO: translations
  const toTitle = (errorType: BuildFirmwareErrorType | undefined): string => {
    if (errorType === null || errorType === undefined) {
      return 'Error';
    }
    switch (errorType) {
      case BuildFirmwareErrorType.GenericError:
        return 'Error';
      case BuildFirmwareErrorType.GitDependencyError:
        return 'Git dependency error';
      case BuildFirmwareErrorType.PythonDependencyError:
        return 'Python dependency error';
      case BuildFirmwareErrorType.PlatformioDependencyError:
        return 'Platformio dependency error';
      case BuildFirmwareErrorType.BuildError:
        return 'Build error';
      case BuildFirmwareErrorType.FlashError:
        return 'Flash error';
    }
    return 'Error';
  };
  return (
    <>
      {response !== null && response.success && <Alert severity="success">
        Success!
      </Alert>}
      {response !== null && !response.success && <Alert severity="error">
        <AlertTitle>{toTitle(response?.errorType)}</AlertTitle>
        {response?.message}
      </Alert>}
    </>
  );
};

export default BuildResponse;
