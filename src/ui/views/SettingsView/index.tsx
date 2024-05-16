import {
  Card,
  CardContent,
  Checkbox,
  Divider,
  FormControlLabel,
} from '@mui/material';
import React, { FunctionComponent } from 'react';
import SettingsIcon from '@mui/icons-material/Settings';
import LanguageIcon from '@mui/icons-material/Language';
import DeveloperModeIcon from '@mui/icons-material/DeveloperMode';
import { useTranslation } from 'react-i18next';
import CardTitle from '../../components/CardTitle';
import MainLayout from '../../layouts/MainLayout';
import Omnibox, { Option } from '../../components/Omnibox';
import locales from '../../../i18n/locales.json';
import useDeveloperMode from '../../hooks/useDeveloperMode';

const SettingsView: FunctionComponent = () => {
  const { t, i18n } = useTranslation();

  // Sort language labels in "()" alphabetically except English, because English has no "()".
  const languages: Option[] = [...locales].sort((a, b) => {
    const labelA =
      a.label.match(/\(([^)]+)\)/)?.[1].toLowerCase() || a.label.toLowerCase();
    const labelB =
      b.label.match(/\(([^)]+)\)/)?.[1].toLowerCase() || b.label.toLowerCase();
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

  const { isDeveloperModeEnabled, setDeveloperMode } = useDeveloperMode();

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
          icon={<DeveloperModeIcon />}
          title={t('SettingsView.DeveloperOptions')}
        />
        <CardContent style={{ paddingLeft: 26, marginTop: -18 }}>
          <FormControlLabel
            control={
              <Checkbox
                checked={isDeveloperModeEnabled}
                onChange={() => {
                  setDeveloperMode();
                }}
              />
            }
            label={t('SettingsView.DeveloperMode')}
          />
        </CardContent>
      </Card>
    </MainLayout>
  );
};

export default SettingsView;
