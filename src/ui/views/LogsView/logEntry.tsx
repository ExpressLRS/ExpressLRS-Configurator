import { Box, Typography } from '@mui/material';
import React, { FunctionComponent } from 'react';
import theme from '../../theme';
import LogEntryContext from './logEntryContext';

export type Log = {
  level: string;
  message: string;
  timestamp: string;
  context?: object;
};

const LogEntry: FunctionComponent<Log> = ({
  level,
  message,
  timestamp,
  context,
}: Log) => {
  const levelLabelColor = (lvl: string): string => {
    switch (lvl) {
      case 'error':
        return theme.palette.error.main;
      default:
        return theme.palette.primary.main;
    }
  };
  return (
    <Box>
      <Box display="flex">
        <Typography mr={1} color={theme.palette.info.main}>
          [
          {Intl.DateTimeFormat('en-US', {
            dateStyle: 'short',
            timeStyle: 'medium',
          }).format(new Date(timestamp))}
          ]
        </Typography>
        <Typography mr={1} color={levelLabelColor(level)}>
          [{level.toUpperCase()}]
        </Typography>
        <Typography>{message}</Typography>
      </Box>
      {context && <LogEntryContext {...context} />}
    </Box>
  );
};

export default LogEntry;
