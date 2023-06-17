import React, { FunctionComponent, memo } from 'react';
import { Alert, AlertTitle } from '@mui/material';
import { SxProps, Theme } from '@mui/system';
import { useTranslation, Trans } from 'react-i18next';
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
              <Trans
                i18nKey="BuildResponse.ErrorDetails"
                defaults="An error has occured, see the above log for the exact error message. If you have not 
                already done so, visit <ExpresslrsLink>Expresslrs.org</ExpresslrsLink> and read 
                the <FlashingGuideLink>Flashing Guide</FlashingGuideLink> for your particular device as well as the 
                <TroubleshootingGuideLink>Troubleshooting Guide<TroubleshootingGuideLink>. If you are 
                still having issues after reviewing the documentation, please copy the build logs above to 
                an online paste site and post in the #help-and-support channel on the 
                <ExpressLRSDiscordLink>ExpressLRS Discord</ExpressLRSDiscordLink> with a link to the logs and other 
                relevant information like your device, which flashing method you were using, and what steps you
                have already taken to resolve the issue."
                components={{
                  ExpresslrsLink: (
                    <DocumentationLink url="https://www.expresslrs.org/" />
                  ),
                  FlashingGuideLink: (
                    <DocumentationLink url="https://www.expresslrs.org/quick-start/getting-started/" />
                  ),
                  TroubleshootingGuideLink: (
                    <DocumentationLink url="https://www.expresslrs.org/quick-start/troubleshooting/#flashingupdating" />
                  ),
                  ExpressLRSDiscordLink: (
                    <DocumentationLink url="https://discord.gg/dS6ReFY" />
                  ),
                }}
              />
            </p>
          </Alert>
        )}
      </>
    );
  }
);

export default BuildResponse;
