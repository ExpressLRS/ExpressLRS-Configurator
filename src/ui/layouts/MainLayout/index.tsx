import React, { FunctionComponent } from 'react';
import { Box, Container } from '@mui/material';
import { SxProps, Theme } from '@mui/system';
import Header from '../../components/Header';
import Sidebar from '../../components/Sidebar';

const styles: Record<string, SxProps<Theme>> = {
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

interface MainLayoutProps {
  children?: React.ReactNode;
}

const MainLayout: FunctionComponent<MainLayoutProps> = (props) => {
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
