import { Components, Theme } from '@mui/material';
import darkScrollbar from '@mui/material/darkScrollbar';

export default function getComponentOverrides(
  theme: Theme,
): Components<Theme> {
  const { custom } = theme.palette;
  const isDark = theme.palette.mode === 'dark';

  return {
    MuiCssBaseline: {
      styleOverrides: {
        body: isDark ? darkScrollbar() : {},
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: custom.appBarGradient,
          color: custom.appBarTextColor,
          backgroundImage: `${custom.appBarGradient} !important`,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none !important',
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        standardError: {
          backgroundColor: custom.alertError.bg,
          color: custom.alertError.text,
        },
        standardWarning: {
          backgroundColor: custom.alertWarning.bg,
          color: custom.alertWarning.text,
        },
        standardInfo: {
          backgroundColor: custom.alertInfo.bg,
          color: custom.alertInfo.text,
        },
        standardSuccess: {
          backgroundColor: custom.alertSuccess.bg,
          color: custom.alertSuccess.text,
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
            color: custom.linkColor,
          },
          maxWidth: '700px',
        },
        popper: {
          maxWidth: '700px',
        },
      },
    },
  };
}
