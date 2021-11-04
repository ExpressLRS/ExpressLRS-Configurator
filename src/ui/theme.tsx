import { createTheme, Theme, ThemeOptions } from '@mui/material';
import { grey } from '@mui/material/colors';

export const defaultTheme: Theme = createTheme();

export const themeConfig: ThemeOptions = {
  shape: {
    borderRadius: 0,
  },
  palette: {
    mode: 'dark',
    background: {
      paper: grey[800],
    },
  },
  components: {
    MuiAlert: {
      styleOverrides: {
        standardError: {
          backgroundColor: 'rgb(156 40 34) !important',
          color: 'rgb(255 255 255) !important',
        },
        standardWarning: {
          backgroundColor: 'rgb(173 110 17) !important',
          color: 'rgb(255 255 255) !important',
        },
        standardInfo: {
          backgroundColor: 'rgb(44 104 158) !important',
          color: 'rgb(255 255 255) !important',
        },
        standardSuccess: {
          backgroundColor: 'rgb(27 84 27) !important',
          color: 'rgb(255 255 255) !important',
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          paddingLeft: '1em',
          paddingRight: '1em',
          fontSize: '1em !important',
          '& a': {
            color: '#90caf9',
          },
          maxWidth: '700px',
        },
        popper: {
          maxWidth: '700px',
        },
      },
    },
  },
};

export default createTheme(themeConfig);
