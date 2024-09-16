/* eslint-disable react/jsx-no-bind */
import React, { FunctionComponent } from 'react';
import {
  Checkbox,
  List,
  ListItem,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
  TextField,
} from '@mui/material';
import { SxProps, Theme } from '@mui/system';
import { useTranslation } from 'react-i18next';
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

  const onUserDefineValueChange =
    (data: UserDefineKey) =>
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
            <ListItem
              dense
              selected={item.enabled}
              button
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
            </ListItem>
            {item.type === UserDefineKind.Text && item.enabled && (
              <ListItem sx={styles.complimentaryItem}>
                {!item.sensitive && (
                  <TextField
                    size="small"
                    onChange={onUserDefineValueChange(item.key)}
                    value={item.value}
                    fullWidth
                    label={inputLabel(item.key)}
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
