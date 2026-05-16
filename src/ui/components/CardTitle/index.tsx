import { CardContent, Grid, Typography } from '@mui/material';
import { FunctionComponent, memo, ReactElement, ReactNode } from 'react';

interface CardTitleProps {
  icon: ReactNode;
  title: string | ReactElement;
}

const CardTitle: FunctionComponent<CardTitleProps> = memo(({ icon, title }) => {
  return (
    <CardContent>
      <Grid container spacing={1} alignItems="center">
        <Grid sx={{ display: 'flex' }}>{icon}</Grid>
        <Grid flexGrow={1}>
          <Typography variant="h6">{title}</Typography>
        </Grid>
      </Grid>
    </CardContent>
  );
});

export default CardTitle;
