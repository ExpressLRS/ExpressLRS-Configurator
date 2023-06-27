import { Box, Typography } from '@mui/material';
import React, { FunctionComponent } from 'react';

const LogEntryContextComponent: FunctionComponent<object> = (context) => {
  const contextContent: { key: string; value: string | object }[] = [];
  Object.entries(context).map(([key, value]) =>
    contextContent.push({ key, value })
  );
  return (
    <Box>
      {contextContent.map((c) => (
        <Box key={c.key} overflow="hidden">
          <Typography variant="body2" component="span" pr={1}>
            {c.key}:
          </Typography>
          <Typography variant="body2" component="span">
            {typeof c.value === 'object' ? JSON.stringify(c.value) : c.value}
          </Typography>
        </Box>
      ))}
    </Box>
  );
};

export default LogEntryContextComponent;
