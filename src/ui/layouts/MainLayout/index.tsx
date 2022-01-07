import React, { FunctionComponent } from 'react';
import { Box, Container } from '@mui/material';
import Header from '../../components/Header';
import Sidebar from '../../components/Sidebar';

const styles = {
  root: {
    display: 'flex',
  },
  main: {
    marginY: 4,
  },
  content: {
    flexGrow: 1,
    '& .MuiCard-root': {
      marginBottom: 4,
    },
  },
};

const MainLayout: FunctionComponent = (props) => {
  const { children } = props;
  return (
    <Box component="main" sx={styles.root}>
      <Sidebar />
      <Box sx={styles.content}>
        <Header />
        <Container sx={styles.main}>{children}</Container>
      </Box>
    </Box>
  );
};

export default MainLayout;
