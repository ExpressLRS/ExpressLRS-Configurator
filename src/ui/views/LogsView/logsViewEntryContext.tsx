import { Box, Typography } from '@mui/material';
import React, { FunctionComponent } from 'react';

const LogsViewEntryContext: FunctionComponent<{
  entryContext: object;
  paddings?: number;
}> = ({ entryContext, paddings = 1 }) => {
  return (
    <Box pl={paddings}>
      {Object.entries(entryContext).map(([key, value]) => (
        <Box key={key}>
          <Typography variant="body2" component="span" pr={1}>
            {key}:
          </Typography>
          {typeof value === 'object' && value !== null ? (
            <LogsViewEntryContext
              entryContext={value}
              paddings={paddings + 1}
            />
          ) : (
            <Typography
              variant="body2"
              component="span"
              style={{ wordBreak: 'break-all' }}
            >
              {String(value)}
            </Typography>
          )}
        </Box>
      ))}
    </Box>
  );
};

export default LogsViewEntryContext;
