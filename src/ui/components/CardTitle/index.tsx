import { CardContent, Grid, Typography } from '@mui/material';
import React, { FunctionComponent, memo, ReactNode } from 'react';

interface CardTitleProps {
  icon: ReactNode;
  title: string | React.ReactElement;
}

const CardTitle: FunctionComponent<CardTitleProps> = memo(({ icon, title }) => {
  return (
    <CardContent>
      <Grid container spacing={1} alignItems="center">
        <Grid item>{icon}</Grid>
        <Grid item flexGrow={1} style={{paddingTop: 2}}>
          <Typography variant="h6">{title}</Typography>
        </Grid>
      </Grid>
    </CardContent>
  );
});

export default CardTitle;
