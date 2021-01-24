import {CircularProgress, makeStyles} from '@material-ui/core';
import React, {FunctionComponent} from 'react';

const useStyles = makeStyles((theme) => ({
  root: {
    marginBottom: theme.spacing(3),
    display: 'flex',
    justifyContent: 'space-evenly',
  },
}));

interface LoaderProps {
  loading: boolean;
}

export const Loader: FunctionComponent<LoaderProps> = ({loading}) => {
  const styles = useStyles();
  return (
    <>
      {loading && <div className={styles.root}>
        <CircularProgress/>
      </div>}
    </>
  );
};
