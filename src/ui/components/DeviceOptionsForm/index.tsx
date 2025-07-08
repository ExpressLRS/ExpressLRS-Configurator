import { Grid, Typography } from '@mui/material';
import React, { FunctionComponent } from 'react';
import { SxProps, Theme } from '@mui/system';
import { useTranslation } from 'react-i18next';
import UserDefinesList from '../UserDefinesList';
import { UserDefine, UserDefineKey } from '../../gql/generated/types';
import useAppState from '../../hooks/useAppState';

const styles: Record<string, SxProps<Theme>> = {
  categoryTitle: {
    marginBottom: 1,
  },
};

export interface DeviceOptionsFormData {
  userDefineOptions: UserDefine[];
}

interface DeviceOptionsFormProps {
  target: string | null;
  deviceOptions: DeviceOptionsFormData;
  onChange: (data: DeviceOptionsFormData) => void;
}

enum UserDefineCategory {
  RegulatoryDomainsISM = 'REGULATORY_DOMAINS_ISM',
  RegulatoryDomains900 = 'REGULATORY_DOMAINS_900',
  RegulatoryDomains433 = 'REGULATORY_DOMAINS_433',
  BindingPhrase = 'BINDING_PHRASE',
  ExtraData = 'EXTRA_DATA',
  PerformanceOptions = 'PERFORMANCE_OPTIONS',
  CompatibilityOptions = 'COMPATIBILITY_OPTIONS',
  OtherOptions = 'OTHER_OPTIONS',
  NetworkOptions = 'NETWORK_OPTIONS',
}

export type UserDefinesByCategory = {
  [key in UserDefineCategory]: UserDefine[];
};

export type UserDefinesKeysByCategory = {
  [key in UserDefineCategory]: UserDefineKey[];
};

const EXPERT_MODE_USER_DEFINES: UserDefineKey[] = [
  UserDefineKey.RX_AS_TX,
  UserDefineKey.LOCK_ON_FIRST_CONNECTION,
  UserDefineKey.MY_STARTUP_MELODY,
  UserDefineKey.AUTO_WIFI_ON_INTERVAL,
  UserDefineKey.DISABLE_ALL_BEEPS,
  UserDefineKey.DISABLE_STARTUP_BEEP,
  UserDefineKey.DEVICE_NAME,
  UserDefineKey.RCVR_INVERT_TX,
  UserDefineKey.RCVR_UART_BAUD,
  UserDefineKey.RX_AS_TX,
  UserDefineKey.TLM_REPORT_INTERVAL_MS,
  UserDefineKey.UART_INVERTED,
  UserDefineKey.UNLOCK_HIGHER_POWER,
  UserDefineKey.USE_R9MM_R9MINI_SBUS,
];

const userDefinesToCategories = (
  userDefines: UserDefine[],
  isExpertModeEnabled: boolean
): UserDefinesByCategory => {
  const result: UserDefinesByCategory = {
    [UserDefineCategory.RegulatoryDomainsISM]: [],
    [UserDefineCategory.RegulatoryDomains900]: [],
    [UserDefineCategory.RegulatoryDomains433]: [],
    [UserDefineCategory.BindingPhrase]: [],
    [UserDefineCategory.ExtraData]: [],
    [UserDefineCategory.PerformanceOptions]: [],
    [UserDefineCategory.CompatibilityOptions]: [],
    [UserDefineCategory.NetworkOptions]: [],
    [UserDefineCategory.OtherOptions]: [],
  };

  const keysToCategories: UserDefinesKeysByCategory = {
    [UserDefineCategory.RegulatoryDomainsISM]: [
      UserDefineKey.REGULATORY_DOMAIN_ISM_2400,
      UserDefineKey.REGULATORY_DOMAIN_EU_CE_2400,
    ],
    [UserDefineCategory.RegulatoryDomains900]: [
      UserDefineKey.REGULATORY_DOMAIN_AU_915,
      UserDefineKey.REGULATORY_DOMAIN_EU_868,
      UserDefineKey.REGULATORY_DOMAIN_FCC_915,
      UserDefineKey.REGULATORY_DOMAIN_IN_866,
    ],
    [UserDefineCategory.RegulatoryDomains433]: [
      UserDefineKey.REGULATORY_DOMAIN_EU_433,
      UserDefineKey.REGULATORY_DOMAIN_AU_433,
    ],
    [UserDefineCategory.BindingPhrase]: [UserDefineKey.BINDING_PHRASE],
    [UserDefineCategory.ExtraData]: [UserDefineKey.TLM_REPORT_INTERVAL_MS],
    [UserDefineCategory.PerformanceOptions]: [
      UserDefineKey.LOCK_ON_FIRST_CONNECTION,
    ],
    [UserDefineCategory.CompatibilityOptions]: [
      UserDefineKey.UART_INVERTED,
      UserDefineKey.UNLOCK_HIGHER_POWER,
      UserDefineKey.USE_R9MM_R9MINI_SBUS,
      UserDefineKey.RCVR_UART_BAUD,
      UserDefineKey.RCVR_INVERT_TX,
      UserDefineKey.RX_AS_TX,
    ],
    [UserDefineCategory.NetworkOptions]: [
      UserDefineKey.AUTO_WIFI_ON_INTERVAL,
      UserDefineKey.HOME_WIFI_SSID,
      UserDefineKey.HOME_WIFI_PASSWORD,
    ],
    [UserDefineCategory.OtherOptions]: [
      UserDefineKey.JUST_BEEP_ONCE,
      UserDefineKey.DISABLE_STARTUP_BEEP,
      UserDefineKey.DISABLE_ALL_BEEPS,
      UserDefineKey.MY_STARTUP_MELODY,
    ],
  };

  const defineToCategory = (key: UserDefineKey): UserDefineCategory => {
    const cats: UserDefineCategory[] = Object.keys(
      keysToCategories
    ) as UserDefineCategory[];
    for (let i = 0; i < cats.length; i++) {
      const defineCategory = cats[i];
      if (keysToCategories[defineCategory].indexOf(key) > -1) {
        return cats[i];
      }
    }
    throw new Error(`failed to find category for ${key}`);
  };

  userDefines.forEach((userDefine) => {
    if (
      isExpertModeEnabled ||
      (!isExpertModeEnabled &&
        !EXPERT_MODE_USER_DEFINES.includes(userDefine.key))
    ) {
      result[defineToCategory(userDefine.key)].push(userDefine);
    }
  });

  return result;
};

export const cleanUserDefines = (userDefines: UserDefine[]): UserDefine[] => {
  return userDefines.map((item) => ({
    key: item.key,
    value: item.value,
    enabled: item.enabled,
    enumValues: item.enumValues,
    type: item.type,
  }));
};

const DeviceOptionsForm: FunctionComponent<DeviceOptionsFormProps> = (
  props
) => {
  const { target, deviceOptions, onChange } = props;
  const { isExpertModeEnabled } = useAppState();
  const categories = userDefinesToCategories(
    deviceOptions.userDefineOptions,
    isExpertModeEnabled
  );
  const { t } = useTranslation();

  const onOptionUpdate = (data: UserDefine) => {
    const updatedOptions = deviceOptions?.userDefineOptions.map((opt) => {
      if (opt.key === data.key) {
        return {
          ...data,
        };
      }
      // if part of the same optionGroup as the item being updated, disable it.
      if (
        data.enabled &&
        data.optionGroup &&
        data.optionGroup === opt.optionGroup
      ) {
        return {
          ...opt,
          enabled: false,
        };
      }

      return opt;
    });
    onChange({
      ...deviceOptions,
      userDefineOptions: updatedOptions,
    });
  };
  return (
    target !== null &&
    categories !== null && (
      <Grid container spacing={3}>
        <Grid item xs>
          {categories[UserDefineCategory.RegulatoryDomainsISM]?.length > 0 && (
            <>
              <Typography variant="h6" sx={styles.categoryTitle}>
                {t('DeviceOptionsForm.RegulatoryDomainsISM')}
              </Typography>
              <UserDefinesList
                options={categories[UserDefineCategory.RegulatoryDomainsISM]}
                onChange={onOptionUpdate}
              />
            </>
          )}
          {categories[UserDefineCategory.RegulatoryDomains900]?.length > 0 && (
            <>
              <Typography variant="h6" sx={styles.categoryTitle}>
                {t('DeviceOptionsForm.RegulatoryDomains900')}
              </Typography>
              <UserDefinesList
                options={categories[UserDefineCategory.RegulatoryDomains900]}
                onChange={onOptionUpdate}
              />
            </>
          )}
          {categories[UserDefineCategory.RegulatoryDomains433]?.length > 0 && (
            <>
              <Typography variant="h6" sx={styles.categoryTitle}>
                {t('DeviceOptionsForm.RegulatoryDomains433')}
              </Typography>
              <UserDefinesList
                options={categories[UserDefineCategory.RegulatoryDomains433]}
                onChange={onOptionUpdate}
              />
            </>
          )}
          {categories[UserDefineCategory.BindingPhrase]?.length > 0 && (
            <>
              <Typography variant="h6">
                {t('DeviceOptionsForm.BindingPhraseSetup')}
              </Typography>
              <UserDefinesList
                options={categories[UserDefineCategory.BindingPhrase]}
                onChange={onOptionUpdate}
              />
            </>
          )}
          {categories[UserDefineCategory.CompatibilityOptions]?.length > 0 && (
            <>
              <Typography variant="h6">
                {t('DeviceOptionsForm.CompatibilityOptions')}
              </Typography>
              <UserDefinesList
                options={categories[UserDefineCategory.CompatibilityOptions]}
                onChange={onOptionUpdate}
              />
            </>
          )}
        </Grid>

        <Grid item xs>
          {categories[UserDefineCategory.PerformanceOptions]?.length > 0 && (
            <>
              <Typography variant="h6">
                {t('DeviceOptionsForm.PerformanceOptions')}
              </Typography>
              <UserDefinesList
                options={categories[UserDefineCategory.PerformanceOptions]}
                onChange={onOptionUpdate}
              />
            </>
          )}
          {categories[UserDefineCategory.ExtraData]?.length > 0 && (
            <>
              <Typography variant="h6">
                {t('DeviceOptionsForm.ExtraData')}
              </Typography>
              <UserDefinesList
                options={categories[UserDefineCategory.ExtraData]}
                onChange={onOptionUpdate}
              />
            </>
          )}
          {categories[UserDefineCategory.NetworkOptions]?.length > 0 && (
            <>
              <Typography variant="h6">
                {t('DeviceOptionsForm.Network')}
              </Typography>
              <UserDefinesList
                options={categories[UserDefineCategory.NetworkOptions]}
                onChange={onOptionUpdate}
              />
            </>
          )}
          {categories[UserDefineCategory.OtherOptions]?.length > 0 && (
            <>
              <Typography variant="h6">
                {t('DeviceOptionsForm.OtherOptions')}
              </Typography>
              <UserDefinesList
                options={categories[UserDefineCategory.OtherOptions]}
                onChange={onOptionUpdate}
              />
            </>
          )}
        </Grid>
      </Grid>
    )
  );
};
export default DeviceOptionsForm;
