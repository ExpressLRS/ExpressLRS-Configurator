import React, { FunctionComponent } from 'react';
import { Box, Button, Typography } from '@mui/material';
import { SxProps, Theme } from '@mui/system';
import { useTranslation } from 'react-i18next';
import { useClearFirmwareFilesMutation } from '../../../../gql/generated/types';
import Loader from '../../../../components/Loader';
import ShowAlerts from '../../../../components/ShowAlerts';

const styles: Record<string, SxProps<Theme>> = {
  actions: {
    marginBottom: 2,
  },
};

const ClearFirmwareFiles: FunctionComponent = () => {
  const { t } = useTranslation();
  const [clearFirmwareFiles, { loading, data, error }] =
    useClearFirmwareFilesMutation();
  const onSubmit = () => {
    clearFirmwareFiles().catch((err) => {
      console.error('clearFirmwareFiles err: ', err);
    });
  };
  return (
    <>
      <Typography variant="h6">
        {t('SupportView.CorruptedFirmwareFiles')}
      </Typography>
      <p>{t('SupportView.YouCanManuallyClearAllFiles')}</p>
      <Box sx={styles.actions}>
        <Button variant="contained" onClick={onSubmit}>
          {t('SupportView.ClearFirmwareFiles')}
        </Button>
      </Box>
      <Loader loading={loading} />
      <ShowAlerts severity="error" messages={error} />
      {data?.clearFirmwareFiles?.success === true && (
        <ShowAlerts
          severity="success"
          messages={t('SupportView.CorruptedFirmwareFilesDeleted')}
        />
      )}
      {data?.clearFirmwareFiles?.success === false && (
        <ShowAlerts
          severity="error"
          messages={data?.clearFirmwareFiles?.message}
        />
      )}
    </>
  );
};
export default ClearFirmwareFiles;
