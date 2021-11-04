import React, {FunctionComponent, memo, useEffect, useRef} from 'react';
import { Box } from '@mui/material'
import { SxProps, Theme } from '@mui/system';

const styles: SxProps<Theme> = {
  root: {
    minHeight: '500px',
    maxHeight: '500px',
    overflowY: 'auto',
    overflowX: 'hidden',
  },
  logs: {
    whiteSpace: 'pre-wrap',
    wordWrap: 'break-word',
  },
};

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
    <Box ref={container} sx={styles.root}>
      <Box component='pre' sx={styles.logs}>
        <code>{data}</code>
      </Box>
    </Box>
  );
});

export default Logs;
