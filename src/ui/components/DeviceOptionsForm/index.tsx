import {
  Button,
  FormControl,
  FormControlLabel,
  Grid,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from '@mui/material';
import React, { FunctionComponent, useRef } from 'react';
import { SxProps, Theme } from '@mui/system';
import UserDefinesList from '../UserDefinesList';
import {
  FirmwareVersionDataInput,
  useBuildUserDefinesTxtMutation,
  UserDefine,
  UserDefineKey,
  UserDefinesMode,
} from '../../gql/generated/types';
import ShowAlerts from '../ShowAlerts';
import Loader from '../Loader';

const styles: Record<string, SxProps<Theme>> = {
  categoryTitle: {
    marginBottom: 1,
  },
  userDefinesMode: {
    marginTop: 1,
    paddingTop: 0,
    paddingRight: 0,
    paddingBottom: 2,
    paddingLeft: 1,
  },
  radioControl: {
    marginRight: 4,
  },
  radio: {
    marginRight: 1,
  },
  textarea: {
    marginY: 1,
  },
};

export interface DeviceOptionsFormData {
  userDefinesMode: UserDefinesMode;
  userDefineOptions: UserDefine[];
  userDefinesTxt: string;
}

interface DeviceOptionsFormProps {
  target: string | null;
  deviceOptions: DeviceOptionsFormData;
  onChange: (data: DeviceOptionsFormData) => void;
  firmwareVersionData: FirmwareVersionDataInput | null;
}

enum UserDefineCategory {
  RegulatoryDomains = 'REGULATORY_DOMAINS',
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

const userDefinesToCategories = (
  userDefines: UserDefine[]
): UserDefinesByCategory => {
  const result: UserDefinesByCategory = {
    [UserDefineCategory.RegulatoryDomains]: [],
    [UserDefineCategory.BindingPhrase]: [],
    [UserDefineCategory.ExtraData]: [],
    [UserDefineCategory.PerformanceOptions]: [],
    [UserDefineCategory.CompatibilityOptions]: [],
    [UserDefineCategory.NetworkOptions]: [],
    [UserDefineCategory.OtherOptions]: [],
  };

  const keysToCategories: UserDefinesKeysByCategory = {
    [UserDefineCategory.RegulatoryDomains]: [
      UserDefineKey.REGULATORY_DOMAIN_AU_915,
      UserDefineKey.REGULATORY_DOMAIN_EU_868,
      UserDefineKey.REGULATORY_DOMAIN_FCC_915,
      UserDefineKey.REGULATORY_DOMAIN_IN_866,
      UserDefineKey.REGULATORY_DOMAIN_ISM_2400,
      UserDefineKey.REGULATORY_DOMAIN_EU_CE_2400,
    ],
    [UserDefineCategory.BindingPhrase]: [UserDefineKey.BINDING_PHRASE],
    [UserDefineCategory.ExtraData]: [
      UserDefineKey.HYBRID_SWITCHES_8,
      UserDefineKey.ENABLE_TELEMETRY,
      UserDefineKey.TLM_REPORT_INTERVAL_MS,
    ],
    [UserDefineCategory.PerformanceOptions]: [
      UserDefineKey.FAST_SYNC,
      UserDefineKey.NO_SYNC_ON_ARM,
      UserDefineKey.ARM_CHANNEL,
      UserDefineKey.FEATURE_OPENTX_SYNC,
      UserDefineKey.FEATURE_OPENTX_SYNC_AUTOTUNE,
      UserDefineKey.LOCK_ON_FIRST_CONNECTION,
      UserDefineKey.LOCK_ON_50HZ,
      UserDefineKey.USE_500HZ,
      UserDefineKey.USE_DIVERSITY,
    ],
    [UserDefineCategory.CompatibilityOptions]: [
      UserDefineKey.UART_INVERTED,
      UserDefineKey.USE_UART2,
      UserDefineKey.R9M_UNLOCK_HIGHER_POWER, // deprecated
      UserDefineKey.UNLOCK_HIGHER_POWER,
      UserDefineKey.USE_R9MM_R9MINI_SBUS,
      UserDefineKey.RCVR_UART_BAUD,
      UserDefineKey.RCVR_INVERT_TX,
    ],
    [UserDefineCategory.NetworkOptions]: [
      UserDefineKey.AUTO_WIFI_ON_BOOT,
      UserDefineKey.AUTO_WIFI_ON_INTERVAL,
      UserDefineKey.HOME_WIFI_SSID,
      UserDefineKey.HOME_WIFI_PASSWORD,
    ],
    [UserDefineCategory.OtherOptions]: [
      UserDefineKey.BLE_HID_JOYSTICK,
      UserDefineKey.USE_ESP8266_BACKPACK,
      UserDefineKey.USE_TX_BACKPACK,
      UserDefineKey.JUST_BEEP_ONCE,
      UserDefineKey.DISABLE_STARTUP_BEEP,
      UserDefineKey.DISABLE_ALL_BEEPS,
      UserDefineKey.MY_STARTUP_MELODY,
      UserDefineKey.USE_DYNAMIC_POWER,
      UserDefineKey.WS2812_IS_GRB,
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
    result[defineToCategory(userDefine.key)].push(userDefine);
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
  const { target, deviceOptions, onChange, firmwareVersionData } = props;
  const categories = userDefinesToCategories(deviceOptions.userDefineOptions);

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

  const onUserDefinesTxt = (
    event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    onChange({
      ...deviceOptions,
      userDefinesTxt: event.currentTarget.value,
    });
  };

  const onUserDefinesMode = (
    _event: React.ChangeEvent<HTMLInputElement>,
    value: string
  ) => {
    onChange({
      ...deviceOptions,
      userDefinesMode: value as UserDefinesMode,
    });
  };

  const userDefinesTxtRef = useRef<HTMLInputElement>();
  const [
    buildUserDefinesTxtMutation,
    { error: buildError, loading: buildLoading },
  ] = useBuildUserDefinesTxtMutation();
  const onCopyFromStandardMode = () => {
    buildUserDefinesTxtMutation({
      variables: {
        input: {
          userDefines: cleanUserDefines(deviceOptions.userDefineOptions),
        },
      },
    })
      .then((result) => {
        if (
          result.data?.buildUserDefinesTxt === undefined ||
          result.data?.buildUserDefinesTxt === null
        ) {
          return;
        }
        const userDefinesTxt =
          result.data?.buildUserDefinesTxt.userDefinesTxt || '';
        onChange({
          ...deviceOptions,
          userDefinesTxt,
        });
        if (
          userDefinesTxtRef.current !== undefined &&
          userDefinesTxtRef.current.value !== undefined
        ) {
          userDefinesTxtRef.current.value = userDefinesTxt;
          userDefinesTxtRef.current?.blur();
        }
      })
      .catch((err) => {
        console.error(err);
      });
  };

  return (
    <>
      <FormControl component="fieldset" sx={styles.userDefinesMode}>
        <RadioGroup
          row
          value={deviceOptions.userDefinesMode}
          onChange={onUserDefinesMode}
          defaultValue="top"
        >
          <FormControlLabel
            value={UserDefinesMode.UserInterface}
            sx={styles.radioControl}
            control={<Radio sx={styles.radio} color="primary" />}
            label="Standard mode"
          />
          <FormControlLabel
            value={UserDefinesMode.Manual}
            sx={styles.radioControl}
            control={<Radio sx={styles.radio} color="primary" />}
            label="Manual mode"
          />
        </RadioGroup>
      </FormControl>
      {deviceOptions.userDefinesMode === UserDefinesMode.Manual && (
        <Grid container spacing={3}>
          <Grid item xs>
            <TextField
              sx={styles.textarea}
              multiline
              InputLabelProps={{ shrink: true }}
              inputRef={userDefinesTxtRef}
              label="user_defines.txt"
              onBlur={onUserDefinesTxt}
              defaultValue={deviceOptions.userDefinesTxt}
              fullWidth
              rows={10}
            />
            <Loader loading={buildLoading} />
            <ShowAlerts severity="error" messages={buildError} />
            <Button onClick={onCopyFromStandardMode} size="small">
              Copy from Standard mode
            </Button>
          </Grid>
        </Grid>
      )}
      {target !== null &&
        categories !== null &&
        deviceOptions.userDefinesMode === UserDefinesMode.UserInterface && (
          <Grid container spacing={3}>
            <Grid item xs>
              {categories[UserDefineCategory.RegulatoryDomains]?.length > 0 && (
                <>
                  <Typography variant="h6" sx={styles.categoryTitle}>
                    Regulatory domains
                  </Typography>
                  <UserDefinesList
                    options={categories[UserDefineCategory.RegulatoryDomains]}
                    onChange={onOptionUpdate}
                    firmwareVersionData={firmwareVersionData}
                  />
                </>
              )}
              {categories[UserDefineCategory.BindingPhrase]?.length > 0 && (
                <>
                  <Typography variant="h6">Binding phrase setup</Typography>
                  <UserDefinesList
                    options={categories[UserDefineCategory.BindingPhrase]}
                    onChange={onOptionUpdate}
                    firmwareVersionData={firmwareVersionData}
                  />
                </>
              )}
              {categories[UserDefineCategory.CompatibilityOptions]?.length >
                0 && (
                <>
                  <Typography variant="h6">Compatibility options</Typography>
                  <UserDefinesList
                    options={
                      categories[UserDefineCategory.CompatibilityOptions]
                    }
                    onChange={onOptionUpdate}
                    firmwareVersionData={firmwareVersionData}
                  />
                </>
              )}
            </Grid>

            <Grid item xs>
              {categories[UserDefineCategory.PerformanceOptions]?.length >
                0 && (
                <>
                  <Typography variant="h6">Performance options</Typography>
                  <UserDefinesList
                    options={categories[UserDefineCategory.PerformanceOptions]}
                    onChange={onOptionUpdate}
                    firmwareVersionData={firmwareVersionData}
                  />
                </>
              )}
              {categories[UserDefineCategory.ExtraData]?.length > 0 && (
                <>
                  <Typography variant="h6">Extra data</Typography>
                  <UserDefinesList
                    options={categories[UserDefineCategory.ExtraData]}
                    onChange={onOptionUpdate}
                    firmwareVersionData={firmwareVersionData}
                  />
                </>
              )}
              {categories[UserDefineCategory.NetworkOptions]?.length > 0 && (
                <>
                  <Typography variant="h6">Network</Typography>
                  <UserDefinesList
                    options={categories[UserDefineCategory.NetworkOptions]}
                    onChange={onOptionUpdate}
                    firmwareVersionData={firmwareVersionData}
                  />
                </>
              )}
              {categories[UserDefineCategory.OtherOptions]?.length > 0 && (
                <>
                  <Typography variant="h6">Other options</Typography>
                  <UserDefinesList
                    options={categories[UserDefineCategory.OtherOptions]}
                    onChange={onOptionUpdate}
                    firmwareVersionData={firmwareVersionData}
                  />
                </>
              )}
            </Grid>
          </Grid>
        )}
    </>
  );
};
export default DeviceOptionsForm;
