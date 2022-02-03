import React, { FunctionComponent, memo } from 'react';
import { Alert, AlertTitle } from '@mui/material';
import { SxProps, Theme } from '@mui/system';
import {
  BuildFirmwareErrorType,
  BuildFlashFirmwareResult,
} from '../../gql/generated/types';

const styles: SxProps<Theme> = {
  errorMessage: {
    whiteSpace: 'pre-wrap',
    fontFamily: 'monospace',
  },
};

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
        case BuildFirmwareErrorType.TargetMismatch:
          return 'The target you are trying to flash does not match the devices current target, if you are sure you want to do this, click Force Flash below';
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
          <Alert sx={styles.errorMessage} severity="error">
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
