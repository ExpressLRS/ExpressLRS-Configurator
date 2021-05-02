/* eslint-disable react/jsx-no-bind */
import React, { FunctionComponent } from 'react';
import {
  Checkbox,
  List,
  ListItem,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
  makeStyles,
  TextField,
} from '@material-ui/core';
import {
  UserDefine,
  UserDefineKey,
  UserDefineKind,
} from '../../gql/generated/types';
import Omnibox from '../Omnibox';
import UserDefineDescription from '../UserDefineDescription';

const useStyles = makeStyles((theme) => ({
  option: {
    padding: `${theme.spacing(1, 2)} !important`,
  },
  icon: {
    minWidth: 40,
  },
  complimentaryItem: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
    '&:hover': {
      backgroundColor: 'transparent !important',
    },
  },
}));

interface UserDefinesListProps {
  options: UserDefine[];
  onChange: (data: UserDefine) => void;
}

const UserDefinesList: FunctionComponent<UserDefinesListProps> = (props) => {
  const styles = useStyles();
  const { options, onChange } = props;
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
              className={styles.option}
              selected={item.enabled}
              button
              onClick={onChecked.bind(this, item.key)}
            >
              <ListItemIcon className={styles.icon}>
                <Checkbox
                  edge="start"
                  checked={item.enabled}
                  tabIndex={-1}
                  disableRipple
                />
              </ListItemIcon>
              <ListItemText>{item.key}</ListItemText>
              <ListItemSecondaryAction>
                <UserDefineDescription userDefine={item.key} />
              </ListItemSecondaryAction>
            </ListItem>
            {item.type === UserDefineKind.Text && item.enabled && (
              <>
                <ListItem className={styles.complimentaryItem}>
                  <TextField
                    size="small"
                    onBlur={onUserDefineValueChange(item.key)}
                    defaultValue={item.value}
                    fullWidth
                    label={inputLabel(item.key)}
                  />
                </ListItem>
              </>
            )}
            {item.type === UserDefineKind.Enum && item.enabled && (
              <ListItem className={styles.complimentaryItem}>
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
