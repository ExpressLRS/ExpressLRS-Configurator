import React, { FunctionComponent } from 'react';
import { Box, Container } from '@mui/material';
import { SxProps, Theme } from '@mui/system';
import Header from '../../components/Header';
import Sidebar from '../../components/Sidebar';

const styles: Record<string, SxProps<Theme>> = {
  root: {
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    overflow: 'hidden',
  },
  body: {
    display: 'flex',
    flex: 1,
    minHeight: 0,
  },
  main: {
    marginY: 4,
  },
  content: {
    flexGrow: 1,
    overflowY: 'auto',
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
      <Header />
      <Box sx={styles.body}>
        <Sidebar />
        <Box sx={styles.content}>
          <Container sx={styles.main}>{children}</Container>
        </Box>
      </Box>
    </Box>
  );
};

export default MainLayout;
