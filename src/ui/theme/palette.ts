import { PaletteOptions } from '@mui/material';

// ExpressLRS brand gradient (green -> teal -> blue), matching the firmware web UI header
export const BRAND_APPBAR_GRADIENT
  = 'linear-gradient(45deg, #9dc66b 5%, #4fa49a 30%, #4361c2)';

export const darkPalette: PaletteOptions = {
  mode: 'dark',
  primary: {
    main: '#5f8bf3', // ELRS docs dark primary - accessible on dark backgrounds
    light: '#90aff5',
    dark: '#4361AA', // Brand blue
    contrastText: '#ffffff',
  },
  secondary: {
    main: '#9FC76F', // Brand sage/lime green
    light: '#b8d694',
    dark: '#7da34e',
    contrastText: '#000000',
  },
  background: {
    default: '#303030',
    paper: '#424242',
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
    linkColor: '#90caf9',
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
    main: '#4361AA', // Brand blue
    light: '#6b83c2',
    dark: '#2e4377',
    contrastText: '#ffffff',
  },
  secondary: {
    main: '#7da34e', // Slightly darker brand green for contrast on white
    light: '#9FC76F', // Brand sage
    dark: '#5d7e35',
    contrastText: '#ffffff',
  },
  background: {
    default: '#f5f5f5',
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
