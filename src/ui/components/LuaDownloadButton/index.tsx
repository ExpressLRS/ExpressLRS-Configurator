import { Button } from '@mui/material';
import { FunctionComponent, useEffect, useState } from 'react';
import { useLazyQuery } from '@apollo/client/react';
import { SxProps, Theme } from '@mui/system';
import { useTranslation } from 'react-i18next';
import {
  FirmwareSource,
  FirmwareVersionDataInput,
  LuaScriptDocument,
} from '../../gql/generated/types';
import { DownloadFileRequestBody, IpcRequest } from '../../../ipc';
import { Config } from '../../config';
import LuaDownloadDialog from '../LuaDownloadDialog';
import ShowAlerts from '../ShowAlerts';

const styles: Record<string, SxProps<Theme>> = {
  button: {
    marginRight: 2,
  },
};

interface LuaDownloadButtonProps {
  hasLuaScript: boolean;
  firmwareVersionData: FirmwareVersionDataInput | null;
  showErrors?: boolean;
}

const LuaDownloadButton: FunctionComponent<LuaDownloadButtonProps> = ({
  hasLuaScript,
  firmwareVersionData,
  showErrors = false,
}) => {
  const { t } = useTranslation();
  const [dialogOpen, setDialogOpen] = useState(false);

  const [
    fetchLuaScript,
    { data: luaScriptResponse, error: luaScriptResponseError },
  ] = useLazyQuery(LuaScriptDocument);

  useEffect(() => {
    if (firmwareVersionData && hasLuaScript) {
      fetchLuaScript({
        variables: {
          source: firmwareVersionData.source as FirmwareSource,
          gitTag: firmwareVersionData.gitTag ?? '',
        },
      });
    }
  }, [firmwareVersionData, fetchLuaScript, hasLuaScript]);

  const onDownload = (url: string) => {
    const downloadFileRequestBody: DownloadFileRequestBody = { url };
    window.electron.ipcRenderer.sendMessage(
      IpcRequest.DownloadFile,
      downloadFileRequestBody,
    );
  };

  return (
    <>
      {hasLuaScript && luaScriptResponse && (
        <>
          <Button
            sx={styles.button}
            color="primary"
            size="large"
            variant="contained"
            onClick={() => setDialogOpen(true)}
          >
            {t('ConfiguratorView.DownloadLUAScript')}
          </Button>
          <LuaDownloadDialog
            open={dialogOpen}
            luaScript={luaScriptResponse.luaScript}
            releasesUrl={Config.luaScriptsUrl}
            onDownload={onDownload}
            onClose={() => setDialogOpen(false)}
          />
        </>
      )}
      {hasLuaScript && showErrors && (
        <ShowAlerts severity="error" messages={luaScriptResponseError} />
      )}
    </>
  );
};

export default LuaDownloadButton;
