import { useState, useEffect } from 'react';
import ApplicationStorage from '../storage';

export default function useDeveloperMode() {
  const [isDeveloperModeEnabled, setDeveloperModeEnabled] = useState(false);

  useEffect(() => {
    (async () => {
      const storage = new ApplicationStorage();
      setDeveloperModeEnabled(
        (await storage.getDeveloperModeEnabled()) ?? false
      );
    })();
  }, []);

  const setDeveloperMode = () => {
    setDeveloperModeEnabled(() => {
      const storage = new ApplicationStorage();
      storage.setDeveloperModeEnabled(!isDeveloperModeEnabled);
      return !isDeveloperModeEnabled;
    });
  };

  return {
    isDeveloperModeEnabled,
    setDeveloperMode,
  };
}
