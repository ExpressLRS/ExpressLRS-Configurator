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
// import SettingsIcon from '@material-ui/icons/Settings';
import ListIcon from '@material-ui/icons/List';
import { matchPath, useLocation, Link } from 'react-router-dom';

const drawerWidth = 205;
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

const Sidebar: FunctionComponent = () => {
  const styles = useStyles();

  const location = useLocation();
  const configuratorActive =
    matchPath(location.pathname, '/configurator') !== null;
  // const settingsActive = matchPath(location.pathname, '/settings') !== null;
  const logsActive = matchPath(location.pathname, '/logs') !== null;

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
          >
            <ListItemIcon>
              <ListIcon />
            </ListItemIcon>
            <ListItemText primary="Logs" />
          </ListItem>
        </List>
      </div>
    </Drawer>
  );
};

export default Sidebar;
