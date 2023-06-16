import React, { FunctionComponent, memo } from 'react';
import { Alert, AlertTitle } from '@mui/material';
import { SxProps, Theme } from '@mui/system';
import { useTranslation } from 'react-i18next';
import {
  BuildFirmwareErrorType,
  BuildFlashFirmwareResult,
  FirmwareVersionDataInput,
} from '../../gql/generated/types';
import DocumentationLink from '../DocumentationLink';

const styles: Record<string, SxProps<Theme>> = {
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
    const { t } = useTranslation();

    // TODO: translations
    const toTitle = (errorType: BuildFirmwareErrorType | undefined): string => {
      if (errorType === null || errorType === undefined) {
        return t('BuildResponse.Error');
      }
      switch (errorType) {
        case BuildFirmwareErrorType.GenericError:
          return t('BuildResponse.Error');
        case BuildFirmwareErrorType.GitDependencyError:
          return t('BuildResponse.GitDependencyError');
        case BuildFirmwareErrorType.PythonDependencyError:
          return t('BuildResponse.PythonDependencyError');
        case BuildFirmwareErrorType.PlatformioDependencyError:
          return t('BuildResponse.PlatformioDependencyError');
        case BuildFirmwareErrorType.BuildError:
          return t('BuildResponse.BuildError');
        case BuildFirmwareErrorType.FlashError:
          return t('BuildResponse.FlashError');
        case BuildFirmwareErrorType.TargetMismatch:
          return t('BuildResponse.TargetMismatch');
        default:
          return '';
      }
    };
    return (
      <>
        {response !== undefined && response.success && (
          <Alert severity="success">{t('BuildResponse.Success')}</Alert>
        )}
        {response !== undefined && !response.success && (
          <Alert sx={styles.errorMessage} severity="error">
            <AlertTitle>
              {toTitle(
                response?.errorType ?? BuildFirmwareErrorType.GenericError
              )}
            </AlertTitle>
            <p>
              {t('BuildResponse.DodumentP1')}{' '}
              <DocumentationLink
                firmwareVersion={firmwareVersionData}
                url="https://www.expresslrs.org/"
              >
                Expresslrs.org
              </DocumentationLink>{' '}
              {t('BuildResponse.DodumentP2')}{' '}
              <DocumentationLink
                firmwareVersion={firmwareVersionData}
                url="https://www.expresslrs.org/quick-start/getting-started/"
              >
                {t('BuildResponse.DodumentP3')}
              </DocumentationLink>{' '}
              {t('BuildResponse.DodumentP4')}{' '}
              <DocumentationLink
                firmwareVersion={firmwareVersionData}
                url="https://www.expresslrs.org/quick-start/troubleshooting/#flashingupdating"
              >
                {t('BuildResponse.DodumentP5')}
              </DocumentationLink>
              {t('BuildResponse.DodumentP6')}{' '}
              <DocumentationLink
                firmwareVersion={firmwareVersionData}
                url="https://discord.gg/dS6ReFY"
              >
                ExpressLRS Discord
              </DocumentationLink>{' '}
              {t('BuildResponse.DodumentP7')}
            </p>
          </Alert>
        )}
      </>
    );
  }
);

export default BuildResponse;
