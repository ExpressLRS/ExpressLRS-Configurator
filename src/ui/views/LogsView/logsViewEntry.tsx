import { Box, Typography } from '@mui/material';
import { FunctionComponent } from 'react';
import theme from '../../theme';
import { LogEntry } from '../../gql/generated/types';
import LogsViewEntryContext from './logsViewEntryContext';

enum LogLevel {
  ERROR = 'error',
  WARN = 'warn',
  INFO = 'info',
  HTTP = 'http',
  VERBOSE = 'verbose',
  DEBUG = 'debug',
  SILLY = 'silly',
}

const LogLevelColor = new Map<string, string>([
  [LogLevel.ERROR, theme.palette.error.main],
  [LogLevel.WARN, theme.palette.warning.main],
  [LogLevel.INFO, theme.palette.info.light],
  [LogLevel.HTTP, theme.palette.info.main],
  [LogLevel.VERBOSE, theme.palette.text.secondary],
  [LogLevel.DEBUG, theme.palette.text.secondary],
  [LogLevel.SILLY, theme.palette.text.disabled],
]);

const LogEntryComponent: FunctionComponent<{ logEntry: LogEntry }> = ({
  logEntry,
}) => {
  const { timestamp, message, level, context } = logEntry;
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
        <Typography mr={1} color={LogLevelColor.get(level)}>
          [
          {level.toUpperCase()}
          ]
        </Typography>
        <Typography>{message}</Typography>
      </Box>
      {context && <LogsViewEntryContext entryContext={context} />}
    </Box>
  );
};

export default LogEntryComponent;
