import {
  Box,
  Card,
  CardContent,
  Container,
  Divider,
  Typography,
} from '@mui/material';
import React, { FunctionComponent } from 'react';
import SettingsIcon from '@mui/icons-material/Settings';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
import CardTitle from '../../components/CardTitle';

const styles = {
  root: {
    display: 'flex',
  },
  main: {
    marginY: 4,
  },
  content: {
    flexGrow: 1,
  },
};

const SettingsView: FunctionComponent = () => {
  return (
    <Box component="main" sx={styles.root}>
      <Sidebar />
      <Box sx={styles.content}>
        <Header />
        <Container sx={styles.main}>
          <Card>
            <CardTitle icon={<SettingsIcon />} title="Settings" />
            <Divider />
            <CardContent>
              <Typography variant="h6">Todo:</Typography>
              <ul>
                <li>Display configurator version</li>
                <li>Language selector</li>
              </ul>
            </CardContent>
          </Card>
        </Container>
      </Box>
    </Box>
  );
};

export default SettingsView;
