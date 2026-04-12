import { useEffect, useState } from 'react';
import useAppState from './useAppState';
import ThemeMode from '../models/enum/ThemeMode';
import { ResolvedThemeMode } from '../theme';

const getSystemMode = (): ResolvedThemeMode => {
  if (typeof window !== 'undefined' && window.matchMedia) {
    return window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
  }
  return 'dark';
};

export default function useResolvedThemeMode(): ResolvedThemeMode {
  const { themeMode } = useAppState();

  const [resolved, setResolved] = useState<ResolvedThemeMode>(() => {
    if (themeMode === ThemeMode.System) {
      return getSystemMode();
    }
    return themeMode === ThemeMode.Light ? 'light' : 'dark';
  });

  useEffect(() => {
    if (themeMode !== ThemeMode.System) {
      setResolved(themeMode === ThemeMode.Light ? 'light' : 'dark');
      return undefined;
    }

    const mql = window.matchMedia('(prefers-color-scheme: dark)');
    setResolved(mql.matches ? 'dark' : 'light');

    const handler = (e: MediaQueryListEvent) => {
      setResolved(e.matches ? 'dark' : 'light');
    };
    mql.addEventListener('change', handler);
    return () => {
      mql.removeEventListener('change', handler);
    };
  }, [themeMode]);

  return resolved;
}
