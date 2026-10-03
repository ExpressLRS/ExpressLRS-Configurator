import { Button } from '@mui/material';
import { FunctionComponent, useEffect } from 'react';
import { useLazyQuery } from '@apollo/client/react';
import { SxProps, Theme } from '@mui/system';
import { useTranslation } from 'react-i18next';
import {
  FirmwareSource,
  FirmwareVersionDataInput,
  LuaScriptDocument,
} from '../../gql/generated/types';
import { DownloadFileRequestBody, IpcRequest } from '../../../ipc';
import GitRepository from '../../models/GitRepository';
import ShowAlerts from '../ShowAlerts';

const styles: Record<string, SxProps<Theme>> = {
  button: {
    marginRight: 2,
  },
};

interface LuaDownloadButtonProps {
  hasLuaScript: boolean;
  firmwareVersionData: FirmwareVersionDataInput | null;
  gitRepository: GitRepository;
  showErrors?: boolean;
}

const LuaDownloadButton: FunctionComponent<LuaDownloadButtonProps> = ({
  hasLuaScript,
  firmwareVersionData,
  gitRepository,
  showErrors = false,
}) => {
  const { t } = useTranslation();

  const [
    fetchLuaScript,
    { data: luaScriptResponse, error: luaScriptResponseError },
  ] = useLazyQuery(LuaScriptDocument);

  useEffect(() => {
    if (firmwareVersionData && hasLuaScript) {
      fetchLuaScript({
        variables: {
          source: firmwareVersionData.source as FirmwareSource,
          gitBranch: firmwareVersionData.gitBranch!,
          gitTag: firmwareVersionData.gitTag!,
          gitCommit: firmwareVersionData.gitCommit!,
          localPath: firmwareVersionData.localPath!,
          gitPullRequest: firmwareVersionData.gitPullRequest,
          gitRepository: {
            url: gitRepository.url,
            owner: gitRepository.owner,
            repositoryName: gitRepository.repositoryName,
            rawRepoUrl: gitRepository.rawRepoUrl,
            srcFolder: gitRepository.srcFolder,
            hardwareArtifactUrl: gitRepository.hardwareArtifactUrl,
          },
        },
      });
    }
  }, [gitRepository, firmwareVersionData, fetchLuaScript, hasLuaScript]);

  return (
    <>
      {hasLuaScript
        && luaScriptResponse
        && luaScriptResponse.luaScript.fileLocation
        && luaScriptResponse.luaScript.fileLocation.length > 0 && (
        <Button
          sx={styles.button}
          color="primary"
          size="large"
          variant="contained"
          onClick={() => {
            const downloadFileRequestBody: DownloadFileRequestBody = {
              url: luaScriptResponse?.luaScript.fileLocation ?? '',
            };
            window.electron.ipcRenderer.sendMessage(
              IpcRequest.DownloadFile,
              downloadFileRequestBody,
            );
          }}
        >
          {t('ConfiguratorView.DownloadLUAScript')}
        </Button>
      )}
      {hasLuaScript && showErrors && (
        <ShowAlerts severity="error" messages={luaScriptResponseError} />
      )}
    </>
  );
};

export default LuaDownloadButton;
