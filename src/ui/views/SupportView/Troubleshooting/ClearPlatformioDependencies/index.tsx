import React, { FunctionComponent } from 'react';
import { Box, Button, Typography } from '@mui/material';
import { SxProps, Theme } from '@mui/system';
import { useClearPlatformioCoreDirMutation } from '../../../../gql/generated/types';
import Loader from '../../../../components/Loader';
import ShowAlerts from '../../../../components/ShowAlerts';

const styles: Record<string, SxProps<Theme>> = {
  actions: {
    marginBottom: 2,
  },
};

const ClearPlatformioDependencies: FunctionComponent = () => {
  const [clearPlatformioCoreDirMutation, { loading, data, error }] =
    useClearPlatformioCoreDirMutation();
  const onClearPlatformioDependencies = () => {
    clearPlatformioCoreDirMutation().catch((err) => {
      console.error('clearPlatformioCoreDirMutation err: ', err);
    });
  };
  return (
    <>
      <Typography variant="h6">Corrupted platformio dependencies</Typography>
      <p>
        If you close the Configurator while platformio installs the required
        dependencies their state might get corrupted. You can manually clear all
        dependencies and start the build process again.
      </p>
      <Box sx={styles.actions}>
        <Button variant="contained" onClick={onClearPlatformioDependencies}>
          Clear platformio dependencies
        </Button>
      </Box>
      <Loader loading={loading} />
      <ShowAlerts severity="error" messages={error} />
      {data?.clearPlatformioCoreDir?.success === true && (
        <ShowAlerts
          severity="success"
          messages="Corrupted platformio dependencies were deleted. Try building again."
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
