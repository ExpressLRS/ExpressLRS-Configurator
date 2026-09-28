import { createTheme, Theme } from '@mui/material';
import { arSD, Localization } from '@mui/material/locale';
import { darkPalette, lightPalette } from './palette';
import getComponentOverrides from './overrides';

export type ResolvedThemeMode = 'dark' | 'light';

export type ThemeDirection = 'ltr' | 'rtl';

// MUI built-in component strings (Alert close label, Autocomplete "No options", etc.)
const muiLocales: Record<string, Localization> = {
  ar: arSD,
};

export function createAppTheme(
  mode: ResolvedThemeMode,
  direction: ThemeDirection = 'ltr',
  language = 'en',
): Theme {
  const palette = mode === 'dark' ? darkPalette : lightPalette;

  // First pass: build theme with palette
  const baseTheme = createTheme({
    direction,
    shape: {
      borderRadius: 0,
    },
    palette,
  });

  // Second pass: build theme with component overrides that reference resolved tokens
  return createTheme(
    baseTheme,
    {
      components: getComponentOverrides(baseTheme),
    },
    muiLocales[language] ?? {},
  );
}

export default createAppTheme('dark');
