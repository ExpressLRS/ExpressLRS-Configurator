/* eslint-disable react/jsx-no-bind */
import React, { FunctionComponent } from 'react';
import {
  Autocomplete,
  Checkbox,
  List,
  ListItem,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
  TextField,
} from '@mui/material';
import {
  FirmwareVersionDataInput,
  UserDefine,
  UserDefineKey,
  UserDefineKind,
} from '../../gql/generated/types';
import Omnibox from '../Omnibox';
import UserDefineDescription from '../UserDefineDescription';
import SensitiveTextField from '../SensitiveTextField';

const styles = {
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
  firmwareVersionData: FirmwareVersionDataInput | null;
}

const UserDefinesList: FunctionComponent<UserDefinesListProps> = (props) => {
  const { options, onChange, firmwareVersionData } = props;
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

  const onUserDefineValueChange = (data: UserDefineKey) => (
    event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
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
      case UserDefineKey.ARM_CHANNEL:
        return 'Arm channel';
      case UserDefineKey.BINDING_PHRASE:
        return 'Custom binding phrase';
      case UserDefineKey.MY_STARTUP_MELODY:
        return 'My startup melody';
      default:
        return 'Value';
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
              <ListItemText>{item.key}</ListItemText>
              <ListItemSecondaryAction>
                <UserDefineDescription
                  userDefine={item.key}
                  firmwareVersionData={firmwareVersionData}
                />
              </ListItemSecondaryAction>
            </ListItem>
            {item.type === UserDefineKind.Text && item.enabled && (
              <>
                <ListItem sx={styles.complimentaryItem}>
                  {!item.sensitive && !item.historyEnabled && (
                    <TextField
                      size="small"
                      onChange={onUserDefineValueChange(item.key)}
                      value={item.value}
                      fullWidth
                      label={inputLabel(item.key)}
                    />
                  )}
                  {item.sensitive && !item.historyEnabled && (
                    <SensitiveTextField
                      name={item.key}
                      size="small"
                      onChange={onUserDefineValueChange(item.key)}
                      value={item.value}
                      fullWidth
                      label={inputLabel(item.key)}
                    />
                  )}
                  {item.historyEnabled && (
                    <Autocomplete
                      freeSolo
                      fullWidth
                      size="small"
                      options={item.history || []}
                      defaultValue={item.value}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label={inputLabel(item.key)}
                          onChange={onUserDefineValueChange(item.key)}
                        />
                      )}
                    />
                  )}
                </ListItem>
              </>
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
