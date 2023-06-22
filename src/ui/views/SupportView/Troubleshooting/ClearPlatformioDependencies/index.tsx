import React, { FunctionComponent } from 'react';
import { Box, Button, Typography } from '@mui/material';
import { SxProps, Theme } from '@mui/system';
import { useTranslation } from 'react-i18next';
import { useClearPlatformioCoreDirMutation } from '../../../../gql/generated/types';
import Loader from '../../../../components/Loader';
import ShowAlerts from '../../../../components/ShowAlerts';

const styles: Record<string, SxProps<Theme>> = {
  actions: {
    marginBottom: 2,
  },
};

const ClearPlatformioDependencies: FunctionComponent = () => {
  const { t } = useTranslation();

  const [clearPlatformioCoreDirMutation, { loading, data, error }] =
    useClearPlatformioCoreDirMutation();
  const onClearPlatformioDependencies = () => {
    clearPlatformioCoreDirMutation().catch((err) => {
      console.error('clearPlatformioCoreDirMutation err: ', err);
    });
  };
  return (
    <>
      <Typography variant="h6">
        {t('SupportView.CorruptedPlatformioDependencies')}
      </Typography>
      <p>{t('SupportView.YouCanManuallyClearAllDependencies')}</p>
      <Box sx={styles.actions}>
        <Button variant="contained" onClick={onClearPlatformioDependencies}>
          {t('SupportView.ClearPlatformioDependencies')}
        </Button>
      </Box>
      <Loader loading={loading} />
      <ShowAlerts severity="error" messages={error} />
      {data?.clearPlatformioCoreDir?.success === true && (
        <ShowAlerts
          severity="success"
          messages={t('SupportView.CorruptedPlatformioDependenciesDeleted')}
        />
      )}
      {data?.clearPlatformioCoreDir?.success === false && (
        <ShowAlerts
          severity="error"
          messages={data?.clearPlatformioCoreDir?.message}
        />
      )}
    </>
  );
};
export default ClearPlatformioDependencies;
