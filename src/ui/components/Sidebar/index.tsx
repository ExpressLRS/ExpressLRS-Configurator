import { FunctionComponent } from 'react';
import {
  Box,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Tooltip,
} from '@mui/material';
import SettingsInputAntennaIcon from '@mui/icons-material/SettingsInputAntenna';
import HelpIcon from '@mui/icons-material/Help';
import HomeIcon from '@mui/icons-material/Home';
import DvrIcon from '@mui/icons-material/Dvr';
import SettingsIcon from '@mui/icons-material/Settings';
import ListIcon from '@mui/icons-material/List';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import { matchPath, useLocation, Link } from 'react-router';
import BackpackIcon from '@mui/icons-material/Backpack';
import { SxProps, Theme } from '@mui/system';
import { useTranslation } from 'react-i18next';
import useAppState from '../../hooks/useAppState';
import useResolvedThemeMode from '../../hooks/useResolvedThemeMode';
import AppStatus from '../../models/enum/AppStatus';
import ThemeMode from '../../models/enum/ThemeMode';

const drawerWidth = 215;

const styles: Record<string, SxProps<Theme>> = {
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    '& .MuiDrawer-paper': {
      width: drawerWidth,
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
      height: '100%',
    },
  },
  drawerContainer: {
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
    overflow: 'auto',
  },
  navList: {
    flexGrow: 1,
  },
  menuItem: {
    paddingY: 1,
    paddingX: 3,
  },
  themeToggleContainer: {
    display: 'flex',
    justifyContent: 'center',
    paddingY: 1,
  },
};

const Sidebar: FunctionComponent = () => {
  const location = useLocation();
  const homeActive = matchPath(location.pathname, '/home') !== null;
  const configuratorActive
    = matchPath(location.pathname, '/configurator') !== null;
  const backpackActive = matchPath(location.pathname, '/backpack') !== null;
  const logsActive = matchPath(location.pathname, '/logs') !== null;
  const serialMonitorActive
    = matchPath(location.pathname, '/serial-monitor') !== null;
  const settingsActive = matchPath(location.pathname, '/settings') !== null;
  const supportActive = matchPath(location.pathname, '/support') !== null;
  const { appStatus, isExpertModeEnabled, appState, setAppState } = useAppState();
  const resolvedMode = useResolvedThemeMode();

  const navigationEnabled = appStatus !== AppStatus.Busy;

  const { t } = useTranslation();

  const toggleThemeMode = () => {
    // Toggle between light and dark based on currently resolved mode.
    // System mode is only available via the Settings page.
    const nextMode
      = resolvedMode === 'dark' ? ThemeMode.Light : ThemeMode.Dark;
    setAppState({ ...appState, themeMode: nextMode });
  };

  const toggleLabel
    = resolvedMode === 'dark'
      ? t('Sidebar.SwitchToLightTheme')
      : t('Sidebar.SwitchToDarkTheme');

  return (
    <Drawer sx={styles.drawer} variant="permanent">
      <Box sx={styles.drawerContainer}>
        <Box sx={styles.navList}>
          <List>
            <ListItemButton
              component={Link}
              to="/home"
              selected={homeActive}
              sx={styles.menuItem}
              disabled={!navigationEnabled}
            >
              <ListItemIcon>
                <HomeIcon />
              </ListItemIcon>
              <ListItemText primary={t('Sidebar.Home')} />
            </ListItemButton>
            <ListItemButton
              component={Link}
              to="/configurator"
              selected={configuratorActive}
              sx={styles.menuItem}
              disabled={!navigationEnabled}
            >
              <ListItemIcon>
                <SettingsInputAntennaIcon />
              </ListItemIcon>
              <ListItemText primary={t('Sidebar.Configurator')} />
            </ListItemButton>
            <ListItemButton
              component={Link}
              to="/backpack"
              selected={backpackActive}
              sx={styles.menuItem}
              disabled={!navigationEnabled}
            >
              <ListItemIcon>
                <BackpackIcon />
              </ListItemIcon>
              <ListItemText primary={t('Sidebar.Backpack')} />
            </ListItemButton>

            <ListItemButton
              component={Link}
              to="/logs"
              selected={logsActive}
              sx={styles.menuItem}
              disabled={!navigationEnabled}
            >
              <ListItemIcon>
                <ListIcon />
              </ListItemIcon>
              <ListItemText primary={t('Sidebar.Logs')} />
            </ListItemButton>

            {isExpertModeEnabled && (
              <ListItemButton
                component={Link}
                to="/serial-monitor"
                selected={serialMonitorActive}
                sx={styles.menuItem}
                disabled={!navigationEnabled}
              >
                <ListItemIcon>
                  <DvrIcon />
                </ListItemIcon>
                <ListItemText primary={t('Sidebar.SerialMonitor')} />
              </ListItemButton>
            )}

            <ListItemButton
              component={Link}
              to="/settings"
              selected={settingsActive}
              sx={styles.menuItem}
              disabled={!navigationEnabled}
            >
              <ListItemIcon>
                <SettingsIcon />
              </ListItemIcon>
              <ListItemText primary={t('Sidebar.Settings')} />
            </ListItemButton>

            <ListItemButton
              component={Link}
              to="/support"
              selected={supportActive}
              sx={styles.menuItem}
              disabled={!navigationEnabled}
            >
              <ListItemIcon>
                <HelpIcon />
              </ListItemIcon>
              <ListItemText primary={t('Sidebar.Support')} />
            </ListItemButton>
          </List>
        </Box>
        <Divider />
        <Box sx={styles.themeToggleContainer}>
          <Tooltip title={toggleLabel}>
            <IconButton
              onClick={toggleThemeMode}
              aria-label={toggleLabel}
              size="large"
            >
              {resolvedMode === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
            </IconButton>
          </Tooltip>
        </Box>
      </Box>
    </Drawer>
  );
};

export default Sidebar;
