import { createMuiTheme, ThemeOptions, Theme } from '@material-ui/core';

export const defaultTheme: Theme = createMuiTheme();

export const themeConfig: ThemeOptions = {
  // shadows: Array(25).fill('none') as Shadows,
  shape: {
    borderRadius: 0,
  },
  palette: {
    mode: 'dark',
    primary: {
      main: '#90caf9',
    },
    secondary: {
      main: '#f48fb1',
    },
  },
  components: {
    MuiAlert: {
      styleOverrides: {
        standardError: {
          backgroundColor: 'rgb(156 40 34) !important',
        },
        standardWarning: {
          backgroundColor: 'rgb(173 110 17) !important',
        },
        standardInfo: {
          backgroundColor: 'rgb(44 104 158) !important',
        },
        standardSuccess: {
          backgroundColor: 'rgb(27 84 27) !important',
        },
      },
    },
    MuiListItem: {
      styleOverrides: {
        root: {
          '&:hover': {
            backgroundColor: 'rgba(144, 202, 249, 0.50) !important',
          },
          // '&$focusVisible': {
          //   backgroundColor: 'rgba(144, 202, 249, 0.40) !important',
          // },
          '&$selected': {
            backgroundColor: 'rgba(144, 202, 249, 0.40)',
          },
        },
      },
    },
    MuiAutocomplete: {
      styleOverrides: {
        option: {
          // I think this is a temporary material-ui bug
          '&[data-focus="true"]': {
            backgroundColor: 'rgba(144, 202, 249, 0.50) !important',
          },
        },
      },
    },
  },
};

export default createMuiTheme(themeConfig);
