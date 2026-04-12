import { createTheme, Theme } from '@mui/material';
import { darkPalette, lightPalette } from './palette';
import getComponentOverrides from './overrides';

export type ResolvedThemeMode = 'dark' | 'light';

export function createAppTheme(mode: ResolvedThemeMode): Theme {
  const palette = mode === 'dark' ? darkPalette : lightPalette;

  // First pass: build theme with palette
  const baseTheme = createTheme({
    shape: {
      borderRadius: 0,
    },
    palette,
  });

  // Second pass: build theme with component overrides that reference resolved tokens
  return createTheme(baseTheme, {
    components: getComponentOverrides(baseTheme),
  });
}

export default createAppTheme('dark');
