import React, { FunctionComponent } from 'react';

import {
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  makeStyles,
  Toolbar,
} from '@material-ui/core';
import BuildIcon from '@material-ui/icons/Build';
import HelpIcon from '@material-ui/icons/Help';
import DvrIcon from '@material-ui/icons/Dvr';
// import SettingsIcon from '@material-ui/icons/Settings';
import ListIcon from '@material-ui/icons/List';
import { matchPath, useLocation, Link } from 'react-router-dom';

const drawerWidth = 215;
const useStyles = makeStyles((theme) => ({
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  drawerContainer: {
    overflow: 'auto',
  },
  menuItem: {
    padding: `${theme.spacing(1, 3)} !important`,
  },
}));

interface SidebarProps {
  navigationEnabled: boolean;
}

const Sidebar: FunctionComponent<SidebarProps> = ({ navigationEnabled }) => {
  const styles = useStyles();

  const location = useLocation();
  const configuratorActive =
    matchPath(location.pathname, '/configurator') !== null;
  // const settingsActive = matchPath(location.pathname, '/settings') !== null;
  const logsActive = matchPath(location.pathname, '/logs') !== null;
  const serialMonitorActive =
    matchPath(location.pathname, '/serial-monitor') !== null;
  const supportActive = matchPath(location.pathname, '/support') !== null;

  return (
    <Drawer
      className={styles.drawer}
      variant="permanent"
      classes={{
        paper: styles.drawerPaper,
      }}
    >
      <Toolbar />
      <Divider />
      <div className={styles.drawerContainer}>
        <List>
          <ListItem
            component={Link}
            to="/configurator"
            selected={configuratorActive}
            className={styles.menuItem}
            button
            disabled={!navigationEnabled}
          >
            <ListItemIcon>
              <BuildIcon />
            </ListItemIcon>
            <ListItemText primary="Configurator" />
          </ListItem>

          {/* <ListItem */}
          {/*  component={Link} */}
          {/*  to="/settings" */}
          {/*  selected={settingsActive} */}
          {/*  className={styles.menuItem} */}
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
            className={styles.menuItem}
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
            className={styles.menuItem}
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
            className={styles.menuItem}
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
    </Drawer>
  );
};

export default Sidebar;
