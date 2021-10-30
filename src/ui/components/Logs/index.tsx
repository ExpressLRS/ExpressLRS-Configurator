import React, {FunctionComponent, memo, useEffect, useRef} from 'react';
import { styled } from '@mui/material/styles';

const PREFIX = 'Logs';

const classes = {
  root: `${PREFIX}-root`,
  logs: `${PREFIX}-logs`
};

const Root = styled('div')(() => ({
  [`&.${classes.root}`]: {
    minHeight: '500px',
    maxHeight: '500px',
    overflowY: 'auto',
    overflowX: 'hidden',
  },

  [`& .${classes.logs}`]: {
    whiteSpace: 'pre-wrap',
    wordWrap: 'break-word',
  }
}));

interface LogsProps {
  data: string;
}

const Logs: FunctionComponent<LogsProps> = memo(({data}) => {

  const container = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (container.current !== null) {
      container.current.scrollTop = container.current.scrollHeight;
    }
  }, [data]);
  return (
    <Root ref={container} className={classes.root}>
      <pre className={classes.logs}>
        <code>{data}</code>
      </pre>
    </Root>
  );
});

export default Logs;
