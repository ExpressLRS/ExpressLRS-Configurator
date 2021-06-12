import React, { FunctionComponent } from 'react';
import { Button, makeStyles, Typography } from '@material-ui/core';
import { useClearFirmwareFilesMutation } from '../../../../gql/generated/types';
import Loader from '../../../../components/Loader';
import ShowAlerts from '../../../../components/ShowAlerts';

const useStyles = makeStyles((theme) => ({
  actions: {
    marginBottom: theme.spacing(2),
  },
}));

const ClearFirmwareFiles: FunctionComponent = () => {
  const styles = useStyles();
  const [
    clearFirmwareFiles,
    { loading, data, error },
  ] = useClearFirmwareFilesMutation();
  const onSubmit = () => {
    clearFirmwareFiles().catch((err) => {
      console.error('clearFirmwareFiles err: ', err);
    });
  };
  return (
    <div>
      <Typography variant="h6">Corrupted firmware files</Typography>
      <p>
        If you close the Configurator while git downloads firmware files git
        repository state can get corrupted. You can manually clear all files and
        start the build process again.
      </p>
      <div className={styles.actions}>
        <Button variant="contained" onClick={onSubmit}>
          Clear firmware files
        </Button>
      </div>
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
    </div>
  );
};
export default ClearFirmwareFiles;
