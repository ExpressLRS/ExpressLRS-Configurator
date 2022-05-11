import React, { FunctionComponent, memo } from 'react';
import { Alert, AlertTitle } from '@mui/material';
import { SxProps, Theme } from '@mui/system';
import {
  BuildFirmwareErrorType,
  BuildFlashFirmwareResult,
  FirmwareVersionDataInput,
} from '../../gql/generated/types';
import DocumentationLink from '../DocumentationLink';

const styles: SxProps<Theme> = {
  errorMessage: {
    a: {
      color: 'white',
    },
  },
};

interface BuildResponseProps {
  response: BuildFlashFirmwareResult | undefined;
  firmwareVersionData: FirmwareVersionDataInput | null;
}

const BuildResponse: FunctionComponent<BuildResponseProps> = memo(
  ({ response, firmwareVersionData }) => {
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
            <p>
              An error has occured, see the above log for the exact error
              message. If you have not already done so, visit{' '}
              <DocumentationLink
                firmwareVersion={firmwareVersionData}
                url="https://www.expresslrs.org/{version}/"
              >
                Expresslrs.org
              </DocumentationLink>{' '}
              and read the{' '}
              <DocumentationLink
                firmwareVersion={firmwareVersionData}
                url="https://www.expresslrs.org/{version}/quick-start/getting-started/"
              >
                Flashing Guide
              </DocumentationLink>{' '}
              for your particular device as well as the{' '}
              <DocumentationLink
                firmwareVersion={firmwareVersionData}
                url="https://www.expresslrs.org/{version}/quick-start/troubleshooting/#flashingupdating"
              >
                Troubleshooting Guide
              </DocumentationLink>
              . If you are still having issues after reviewing the
              documentation, please copy the build logs above to an online paste
              site and post in the #help-and-support channel on the{' '}
              <DocumentationLink
                firmwareVersion={firmwareVersionData}
                url="https://discord.gg/dS6ReFY"
              >
                ExpressLRS Discord
              </DocumentationLink>{' '}
              with a link to the logs and other relevant information like your
              device, which flashing method you were using, and what steps you
              have already taken to resolve the issue.
            </p>
          </Alert>
        )}
      </>
    );
  }
);

export default BuildResponse;
