import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Divider,
} from '@mui/material';
import React, { FunctionComponent } from 'react';
import SettingsIcon from '@mui/icons-material/Settings';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
import CardTitle from '../../components/CardTitle';
import ClearPlatformioDependencies from './Troubleshooting/ClearPlatformioDependencies';
import ClearFirmwareFiles from './Troubleshooting/ClearFirmwareFiles';

const styles = {
  root: {
    display: 'flex',
  },
  main: {
    marginY: 4,
    '& .linksList': {
      paddingLeft: 0,
      marginBottom: 0,
      '& > li': {
        display: 'inline-block',
        listStyleType: 'none',
        marginBottom: 3,
        marginRight: 2,
      },
    },
  },
  content: {
    flexGrow: 1,
  },
};

const SupportView: FunctionComponent = () => {
  return (
    <Box component="main" sx={styles.root}>
      <Sidebar navigationEnabled />
      <Box sx={styles.content}>
        <Header />
        <Container sx={styles.main}>
          <Card>
            <CardTitle icon={<SettingsIcon />} title="Support" />
            <Divider />
            <CardContent>
              <p>Need help? Confused? Join the Community!</p>
              <ul className="linksList">
                <li>
                  <Button
                    target="_blank"
                    variant="contained"
                    rel="noreferrer noreferrer"
                    href="https://www.expresslrs.org/"
                  >
                    ExpressLRS Documentation
                  </Button>
                </li>
                <li>
                  <Button
                    target="_blank"
                    variant="contained"
                    rel="noreferrer noreferrer"
                    href="https://discord.gg/dS6ReFY"
                  >
                    Discord Chat
                  </Button>
                </li>
                <li>
                  <Button
                    target="_blank"
                    variant="contained"
                    rel="noreferrer noreferrer"
                    href="https://www.facebook.com/groups/636441730280366"
                  >
                    Facebook Group
                  </Button>
                </li>
              </ul>
            </CardContent>
            <Divider />
            <CardTitle icon={<SettingsIcon />} title="Troubleshooting" />
            <Divider />
            <CardContent>
              <ClearPlatformioDependencies />
              <ClearFirmwareFiles />
            </CardContent>
            <Divider />
            <CardTitle icon={<SettingsIcon />} title="Legal disclaimer" />
            <Divider />
            <CardContent>
              <p>
                The use and operation of this type of device may require a
                license, and some countries may forbid its use. It is entirely
                up to the end user to ensure compliance with local regulations.
                This is experimental software / hardware and there is no
                guarantee of stability or reliability. USE AT YOUR OWN RISK.
              </p>
            </CardContent>
          </Card>
        </Container>
      </Box>
    </Box>
  );
};

export default SupportView;
