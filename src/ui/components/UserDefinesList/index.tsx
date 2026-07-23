import React, { FunctionComponent } from 'react';
import {
  Checkbox,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
  TextField,
} from '@mui/material';
import { SxProps, Theme } from '@mui/system';
import { useTranslation } from 'react-i18next';
import { TFunction } from 'i18next';
import {
  UserDefine,
  UserDefineKey,
  UserDefineKind,
} from '../../gql/generated/types';
import Omnibox from '../Omnibox';
import UserDefineDescription from '../UserDefineDescription';
import SensitiveTextField from '../SensitiveTextField';

const styles: Record<string, SxProps<Theme>> = {
  icon: {
    minWidth: 40,
  },
  complimentaryItem: {
    marginY: 1,
    '&:hover': {
      backgroundColor: 'transparent !important',
    },
  },
};

interface UserDefinesListProps {
  options: UserDefine[];
  onChange: (data: UserDefine) => void;
}

/*
  Numeric user defines carry their allowed range on the model (min/max), defined
  in TargetUserDefinesFactory. AUTO_WIFI_ON_INTERVAL is in seconds; the firmware
  keeps it in int32 milliseconds, hence the upper bound.
*/
const hasNumericRangeError = (item: UserDefine): boolean => {
  if (item.type !== UserDefineKind.Number || !item.enabled) {
    return false;
  }
  const value = (item.value ?? '').trim();
  if (!/^-?\d+$/.test(value)) {
    return true;
  }
  const parsed = Number(value);
  if (item.min != null && parsed < item.min) {
    return true;
  }
  if (item.max != null && parsed > item.max) {
    return true;
  }
  return false;
};

/*
  Helper text for numeric inputs: always show the allowed range so the user knows
  the bounds up front; switch to the out-of-range message when the value is invalid.
*/
const numericHelperText = (
  item: UserDefine,
  t: TFunction,
): string | undefined => {
  if (item.type !== UserDefineKind.Number) {
    return undefined;
  }
  const key = hasNumericRangeError(item)
    ? 'UserDefinesList.ValueOutOfRange'
    : 'UserDefinesList.AllowedRange';
  return t(key, { min: item.min, max: item.max });
};

const UserDefinesList: FunctionComponent<UserDefinesListProps> = (props) => {
  const { options, onChange } = props;
  const { t } = useTranslation();

  const onChecked = (data: UserDefineKey) => {
    const opt = options.find(({ key }) => key === data);
    if (opt !== undefined) {
      onChange({
        ...opt,
        enabled: !opt.enabled,
      });
    } else {
      throw new Error(`user define key ${data} not found`);
    }
  };

  const onUserDefineValueChange
    = (data: UserDefineKey) =>
      (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        const opt = options.find(({ key }) => key === data);
        if (opt !== undefined) {
          const update = {
            ...opt,
            value: event.target.value,
          };
          onChange(update);
        } else {
          throw new Error(`user define key ${data} not found`);
        }
      };

  const onEnumValueChange = (data: UserDefineKey) => (value: string | null) => {
    const opt = options.find(({ key }) => key === data);
    if (opt !== undefined) {
      const update = {
        ...opt,
        value,
      };
      onChange(update);
    } else {
      throw new Error(`user define key ${data} not found`);
    }
  };

  const inputLabel = (key: UserDefineKey): string => {
    switch (key) {
      case UserDefineKey.BINDING_PHRASE:
        return t('UserDefinesList.CustomBindingPhrase');
      case UserDefineKey.MY_STARTUP_MELODY:
        return t('UserDefinesList.MyStartupMelody');
      default:
        return t('UserDefinesList.Value');
    }
  };

  return (
    <List>
      {options.map((item) => {
        return (
          <React.Fragment key={item.key}>
            <ListItemButton
              dense
              selected={item.enabled}
              onClick={onChecked.bind(this, item.key)}
            >
              <ListItemIcon sx={styles.icon}>
                <Checkbox
                  edge="start"
                  checked={item.enabled}
                  tabIndex={-1}
                  disableRipple
                />
              </ListItemIcon>
              <ListItemText>{t(`UserDefineKey.${item.key}`)}</ListItemText>
              <ListItemSecondaryAction>
                <UserDefineDescription userDefine={item.key} />
              </ListItemSecondaryAction>
            </ListItemButton>
            {(item.type === UserDefineKind.Text
              || item.type === UserDefineKind.Number)
            && item.enabled && (
              <ListItem sx={styles.complimentaryItem}>
                {!item.sensitive && (
                  <TextField
                    size="small"
                    onChange={onUserDefineValueChange(item.key)}
                    value={item.value}
                    fullWidth
                    label={inputLabel(item.key)}
                    type={
                      item.type === UserDefineKind.Number ? 'number' : 'text'
                    }
                    inputProps={
                      item.type === UserDefineKind.Number
                        ? {
                            min: item.min ?? undefined,
                            max: item.max ?? undefined,
                            step: 1,
                          }
                        : undefined
                    }
                    error={hasNumericRangeError(item)}
                    helperText={numericHelperText(item, t)}
                  />
                )}
                {item.sensitive && (
                  <SensitiveTextField
                    name={item.key}
                    size="small"
                    onChange={onUserDefineValueChange(item.key)}
                    value={item.value}
                    fullWidth
                    label={inputLabel(item.key)}
                  />
                )}
              </ListItem>
            )}
            {item.type === UserDefineKind.Enum && item.enabled && (
              <ListItem sx={styles.complimentaryItem}>
                <Omnibox
                  title={inputLabel(item.key)}
                  currentValue={{
                    value: item.value ?? '',
                    label: item.value ?? '',
                  }}
                  onChange={onEnumValueChange(item.key)}
                  options={
                    item?.enumValues?.map((opt) => ({
                      value: opt,
                      label: opt,
                    })) ?? []
                  }
                />
              </ListItem>
            )}
          </React.Fragment>
        );
      })}
    </List>
  );
};

export default UserDefinesList;
