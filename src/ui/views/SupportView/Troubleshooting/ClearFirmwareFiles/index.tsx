import React, { FunctionComponent } from 'react';
import { Box, Button, Typography } from '@mui/material';
import { SxProps, Theme } from '@mui/system';
import { useClearFirmwareFilesMutation } from '../../../../gql/generated/types';
import Loader from '../../../../components/Loader';
import ShowAlerts from '../../../../components/ShowAlerts';

const styles: Record<string, SxProps<Theme>> = {
  actions: {
    marginBottom: 2,
  },
};

const ClearFirmwareFiles: FunctionComponent = () => {
  const [clearFirmwareFiles, { loading, data, error }] =
    useClearFirmwareFilesMutation();
  const onSubmit = () => {
    clearFirmwareFiles().catch((err) => {
      console.error('clearFirmwareFiles err: ', err);
    });
  };
  return (
    <>
      <Typography variant="h6">Corrupted firmware files</Typography>
      <p>
        If you close the Configurator while git downloads firmware files git
        repository state can get corrupted. You can manually clear all files and
        start the build process again.
      </p>
      <Box sx={styles.actions}>
        <Button variant="contained" onClick={onSubmit}>
          Clear firmware files
        </Button>
      </Box>
      <Loader loading={loading} />
      <ShowAlerts severity="error" messages={error} />
      {data?.clearFirmwareFiles?.success === true && (
        <ShowAlerts
          severity="success"
          messages="Corrupted firmware files were deleted and git repository was cleaned. Try building again."
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
