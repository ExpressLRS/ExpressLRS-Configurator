import { PaletteOptions } from '@mui/material';

// ExpressLRS brand gradient (green -> teal -> blue), matching the firmware web UI header
export const BRAND_APPBAR_GRADIENT
  = 'linear-gradient(45deg, #9dc66b 5%, #4fa49a 30%, #4361c2)';

export const darkPalette: PaletteOptions = {
  mode: 'dark',
  primary: {
    main: '#a6cf74', // ELRS brand green accent - matches docs dark accent
    light: '#c4e0a0',
    dark: '#7da34e',
    contrastText: '#000000',
  },
  secondary: {
    main: '#5f8bf3', // ELRS brand blue
    light: '#90aff5',
    dark: '#4361AA',
    contrastText: '#ffffff',
  },
  background: {
    default: '#1e2129', // hsl(225, 15%, 14%) - website slate scheme
    paper: '#272a35', // hsl(225, 15%, 18%) - slightly elevated
  },
  error: {
    main: '#f44336',
  },
  warning: {
    main: '#ffa726',
  },
  info: {
    main: '#29b6f6',
  },
  success: {
    main: '#66bb6a',
  },
  text: {
    primary: '#ffffff',
    secondary: 'rgba(255,255,255,0.7)',
  },
  custom: {
    linkColor: '#5f8bf3', // Brand blue for links
    updateAvailableColor: '#9FC76F',
    appBarGradient: BRAND_APPBAR_GRADIENT,
    appBarTextColor: '#ffffff',
    alertError: { bg: 'rgb(156 40 34)', text: '#ffffff' },
    alertWarning: { bg: 'rgb(173 110 17)', text: '#ffffff' },
    alertInfo: { bg: 'rgb(44 104 158)', text: '#ffffff' },
    alertSuccess: { bg: 'rgb(27 84 27)', text: '#ffffff' },
  },
};

export const lightPalette: PaletteOptions = {
  mode: 'light',
  primary: {
    main: '#5d8a3a', // Dark green for contrast on white backgrounds
    light: '#7da34e',
    dark: '#3d6320',
    contrastText: '#ffffff',
  },
  secondary: {
    main: '#4361AA', // Brand blue
    light: '#6b83c2',
    dark: '#2e4377',
    contrastText: '#ffffff',
  },
  background: {
    default: '#fafafa', // Near-white, matching website's white-dominant light theme
    paper: '#ffffff',
  },
  error: {
    main: '#d32f2f',
  },
  warning: {
    main: '#ed6c02',
  },
  info: {
    main: '#0288d1',
  },
  success: {
    main: '#2e7d32',
  },
  text: {
    primary: '#343434', // Brand dark gray
    secondary: 'rgba(52,52,52,0.6)',
  },
  custom: {
    linkColor: '#4361AA', // Brand blue for links
    updateAvailableColor: '#2e7d32', // Dark green - accessible on light bg
    appBarGradient: BRAND_APPBAR_GRADIENT,
    appBarTextColor: '#ffffff',
    alertError: { bg: '#fdeded', text: '#5f2120' },
    alertWarning: { bg: '#fff4e5', text: '#663c00' },
    alertInfo: { bg: '#e5f6fd', text: '#014361' },
    alertSuccess: { bg: '#edf7ed', text: '#1e4620' },
  },
};
