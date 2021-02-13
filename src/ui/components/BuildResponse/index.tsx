import React, { FunctionComponent, memo } from 'react';
import { Alert, AlertTitle } from '@material-ui/core';
import {
  BuildFirmwareErrorType,
  BuildFlashFirmwareResult,
} from '../../gql/generated/types';

interface BuildResponseProps {
  response: BuildFlashFirmwareResult | undefined;
}

const BuildResponse: FunctionComponent<BuildResponseProps> = memo(
  ({ response }) => {
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
        default:
          return '';
      }
    };
    return (
      <>
        {response !== undefined && response.success && (
          <Alert severity="success">Success!</Alert>
        )}
        {response !== undefined && !response.success && (
          <Alert severity="error">
            <AlertTitle>
              {toTitle(
                response?.errorType ?? BuildFirmwareErrorType.GenericError
              )}
            </AlertTitle>
            {response?.message}
          </Alert>
        )}
      </>
    );
  }
);

export default BuildResponse;
