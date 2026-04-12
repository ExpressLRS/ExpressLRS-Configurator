import {
  Card,
  CardContent,
  Checkbox,
  Divider,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
} from '@mui/material';
import { ChangeEvent, FunctionComponent } from 'react';
import SettingsIcon from '@mui/icons-material/Settings';
import LanguageIcon from '@mui/icons-material/Language';
import DeveloperModeIcon from '@mui/icons-material/DeveloperMode';
import Brightness6Icon from '@mui/icons-material/Brightness6';
import { useTranslation } from 'react-i18next';
import CardTitle from '../../components/CardTitle';
import MainLayout from '../../layouts/MainLayout';
import Omnibox, { Option } from '../../components/Omnibox';
import locales from '../../../i18n/locales.json';
import useAppState from '../../hooks/useAppState';
import ThemeMode from '../../models/enum/ThemeMode';

const SettingsView: FunctionComponent = () => {
  const { t, i18n } = useTranslation();

  // Sort language labels in "()" alphabetically except English, because English has no "()".
  const languages: Option[] = [...locales].sort((a, b) => {
    const labelA
      = a.label.match(/\(([^)]+)\)/)?.[1].toLowerCase() || a.label.toLowerCase();
    const labelB
      = b.label.match(/\(([^)]+)\)/)?.[1].toLowerCase() || b.label.toLowerCase();
    return labelA.localeCompare(labelB);
  });

  const defaultLanguage = languages[0];

  const onLocaleChange = (locale: string | null) => {
    if (locale === null) {
      i18n.changeLanguage(defaultLanguage.value);
    } else {
      i18n.changeLanguage(locale);
    }
  };
  let currentLanguage: Option = defaultLanguage;
  if (i18n.resolvedLanguage !== undefined) {
    currentLanguage = {
      value: i18n.resolvedLanguage,
      label:
        languages.find((locale) => locale.value === i18n.resolvedLanguage)
          ?.label ?? '',
    };
  }

  const { appState, setAppState } = useAppState();
  const setExpertMode = () => {
    setAppState({
      ...appState,
      isExpertModeEnabled: !appState.isExpertModeEnabled,
    });
  };

  const onThemeModeChange = (event: ChangeEvent<HTMLInputElement>) => {
    setAppState({
      ...appState,
      themeMode: event.target.value as ThemeMode,
    });
  };

  return (
    <MainLayout>
      <Card>
        <CardTitle icon={<SettingsIcon />} title={t('SettingsView.Settings')} />
        <Divider />
        <CardTitle
          icon={<LanguageIcon />}
          title={t('SettingsView.LanguageSelector')}
        />
        <CardContent style={{ paddingLeft: 26, marginTop: -18 }}>
          <Omnibox
            title={t('SettingsView.CurrentLanguage')}
            currentValue={currentLanguage}
            onChange={onLocaleChange}
            options={languages}
          />
        </CardContent>
        <Divider />
        <CardTitle
          icon={<Brightness6Icon />}
          title={t('SettingsView.ThemeSelector')}
        />
        <CardContent style={{ paddingLeft: 26, marginTop: -18 }}>
          <FormControl>
            <RadioGroup
              value={appState.themeMode}
              onChange={onThemeModeChange}
            >
              <FormControlLabel
                value={ThemeMode.System}
                control={<Radio />}
                label={t('SettingsView.ThemeSystem')}
              />
              <FormControlLabel
                value={ThemeMode.Light}
                control={<Radio />}
                label={t('SettingsView.ThemeLight')}
              />
              <FormControlLabel
                value={ThemeMode.Dark}
                control={<Radio />}
                label={t('SettingsView.ThemeDark')}
              />
            </RadioGroup>
          </FormControl>
        </CardContent>
        <Divider />
        <CardTitle
          icon={<DeveloperModeIcon />}
          title={t('SettingsView.ApplicationOptions')}
        />
        <CardContent style={{ paddingLeft: 26, marginTop: -18 }}>
          <FormControlLabel
            control={(
              <Checkbox
                checked={appState.isExpertModeEnabled}
                onChange={() => {
                  setExpertMode();
                }}
              />
            )}
            label={<>{t('SettingsView.ExpertMode')}</>}
          />
          <p>{t('SettingsView.ExpertModeDescription')}</p>
        </CardContent>
      </Card>
    </MainLayout>
  );
};

export default SettingsView;
