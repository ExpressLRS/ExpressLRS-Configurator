import { Box, Typography } from '@mui/material';
import React, { FunctionComponent } from 'react';
import theme from '../../theme';
import { LogEntry } from '../../gql/generated/types';
import LogEntryContextComponent from './logEntryContext';

const LogEntryComponent: FunctionComponent<LogEntry> = ({
  level,
  message,
  timestamp,
  context,
}: LogEntry) => {
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
      {context && <LogEntryContextComponent {...context} />}
    </Box>
  );
};

export default LogEntryComponent;
