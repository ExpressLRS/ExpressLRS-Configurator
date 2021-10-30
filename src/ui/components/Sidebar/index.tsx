import React, { FunctionComponent } from 'react';

import { styled } from '@mui/material/styles';

import {
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Toolbar,
} from '@mui/material';
import BuildIcon from '@mui/icons-material/Build';
import HelpIcon from '@mui/icons-material/Help';
import DvrIcon from '@mui/icons-material/Dvr';
// import SettingsIcon from '@mui/icons-material/Settings';
import ListIcon from '@mui/icons-material/List';
import { matchPath, useLocation, Link } from 'react-router-dom';
import BackpackIcon from '@mui/icons-material/Backpack';

const PREFIX = 'Sidebar';

const classes = {
  drawer: `${PREFIX}-drawer`,
  drawerPaper: `${PREFIX}-drawerPaper`,
  drawerContainer: `${PREFIX}-drawerContainer`,
  menuItem: `${PREFIX}-menuItem`,
};

const drawerWidth = 215;

const StyledDrawer = styled(Drawer)(({ theme }) => ({
  [`&.${classes.drawer}`]: {
    width: drawerWidth,
    flexShrink: 0,
  },

  [`& .${classes.drawerPaper}`]: {
    width: drawerWidth,
  },

  [`& .${classes.drawerContainer}`]: {
    overflow: 'auto',
  },

  [`& .${classes.menuItem}`]: {
    padding: `${theme.spacing(1, 3)} !important`,
  },
}));

interface SidebarProps {
  navigationEnabled: boolean;
}

const Sidebar: FunctionComponent<SidebarProps> = ({ navigationEnabled }) => {
  const location = useLocation();
  const configuratorActive =
    matchPath(location.pathname, '/configurator') !== null;
  const backpackActive = matchPath(location.pathname, '/backpack') !== null;
  // const settingsActive = matchPath(location.pathname, '/settings') !== null;
  const logsActive = matchPath(location.pathname, '/logs') !== null;
  const serialMonitorActive =
    matchPath(location.pathname, '/serial-monitor') !== null;
  const supportActive = matchPath(location.pathname, '/support') !== null;

  return (
    <StyledDrawer
      className={classes.drawer}
      variant="permanent"
      classes={{
        paper: classes.drawerPaper,
      }}
    >
      <Toolbar />
      <Divider />
      <div className={classes.drawerContainer}>
        <List>
          <ListItem
            component={Link}
            to="/configurator"
            selected={configuratorActive}
            className={classes.menuItem}
            button
            disabled={!navigationEnabled}
          >
            <ListItemIcon>
              <BuildIcon />
            </ListItemIcon>
            <ListItemText primary="Configurator" />
          </ListItem>
          <ListItem
            component={Link}
            to="/backpack"
            selected={backpackActive}
            className={classes.menuItem}
            button
            disabled={!navigationEnabled}
          >
            <ListItemIcon>
              <BackpackIcon />
            </ListItemIcon>
            <ListItemText primary="Backpack" />
          </ListItem>

          {/* <ListItem */}
          {/*  component={Link} */}
          {/*  to="/settings" */}
          {/*  selected={settingsActive} */}
          {/*  className={classes.menuItem} */}
          {/*  button */}
          {/* > */}
          {/*  <ListItemIcon> */}
          {/*    <SettingsIcon /> */}
          {/*  </ListItemIcon> */}
          {/*  <ListItemText primary="Settings" /> */}
          {/* </ListItem> */}

          <ListItem
            component={Link}
            to="/logs"
            selected={logsActive}
            className={classes.menuItem}
            button
            disabled={!navigationEnabled}
          >
            <ListItemIcon>
              <ListIcon />
            </ListItemIcon>
            <ListItemText primary="Logs" />
          </ListItem>

          <ListItem
            component={Link}
            to="/serial-monitor"
            selected={serialMonitorActive}
            className={classes.menuItem}
            button
            disabled={!navigationEnabled}
          >
            <ListItemIcon>
              <DvrIcon />
            </ListItemIcon>
            <ListItemText primary="Serial Monitor" />
          </ListItem>

          <ListItem
            component={Link}
            to="/support"
            selected={supportActive}
            className={classes.menuItem}
            button
            disabled={!navigationEnabled}
          >
            <ListItemIcon>
              <HelpIcon />
            </ListItemIcon>
            <ListItemText primary="Support" />
          </ListItem>
        </List>
      </div>
    </StyledDrawer>
  );
};

export default Sidebar;
