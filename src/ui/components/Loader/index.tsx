import { CircularProgress } from '@mui/material';
import { styled } from '@mui/material/styles';
import React, { FunctionComponent } from 'react';

const PREFIX = 'Loader';

const classes = {
  root: `${PREFIX}-root`,
};

// TODO jss-to-styled codemod: The Fragment root was replaced by div. Change the tag if needed.
const Root = styled('div')(({ theme }) => ({
  [`& .${classes.root}`]: {
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
  return (
    <Root>
      {loading && (
        <div className={`${classes.root} ${className}`}>
          <CircularProgress />
        </div>
      )}
    </Root>
  );
};

export default Loader;
