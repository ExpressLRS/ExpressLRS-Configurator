import { CardContent, Grid, Typography } from '@material-ui/core';
import React, { FunctionComponent, memo } from 'react';

interface CardTitleProps {
  icon: any;
  title: string | React.ReactElement;
}

const CardTitle: FunctionComponent<CardTitleProps> = memo(({ icon, title }) => {
  return (
    <CardContent>
      <Grid container spacing={1} alignItems="center">
        <Grid item>{icon}</Grid>
        <Grid item>
          <Typography variant="h6">{title}</Typography>
        </Grid>
      </Grid>
    </CardContent>
  );
});

export default CardTitle;
