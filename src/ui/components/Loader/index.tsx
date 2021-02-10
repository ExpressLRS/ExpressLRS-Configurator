import { CircularProgress, makeStyles } from '@material-ui/core';
import React, { FunctionComponent } from 'react';

const useStyles = makeStyles((theme) => ({
  root: {
    marginBottom: theme.spacing(3),
    display: 'flex',
    justifyContent: 'space-evenly',
  },
}));

interface LoaderProps {
  loading: boolean;
  className?: string;
}

const Loader: FunctionComponent<LoaderProps> = ({
  loading,
  className = '',
}) => {
  const styles = useStyles();
  return (
    <>
      {loading && (
        <div className={`${styles.root} ${className}`}>
          <CircularProgress />
        </div>
      )}
    </>
  );
};

export default Loader;
