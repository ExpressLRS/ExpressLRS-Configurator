import '@mui/material/styles';

declare module '@mui/material/styles' {
  interface AlertColorTokens {
    bg: string;
    text: string;
  }

  interface PaletteCustom {
    linkColor: string;
    updateAvailableColor: string;
    appBarGradient: string;
    appBarTextColor: string;
    alertError: AlertColorTokens;
    alertWarning: AlertColorTokens;
    alertInfo: AlertColorTokens;
    alertSuccess: AlertColorTokens;
  }

  interface Palette {
    custom: PaletteCustom;
  }

  interface PaletteOptions {
    custom?: PaletteCustom;
  }
}
