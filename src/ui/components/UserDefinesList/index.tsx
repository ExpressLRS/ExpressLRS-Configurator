/* eslint-disable react/jsx-no-bind */
import React, { FunctionComponent } from 'react';
import {
  Checkbox,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  makeStyles,
  TextField,
} from '@material-ui/core';
import { UserDefineKey } from '../../../library/FirmwareBuilder/Enum/UserDefineKey';

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

export interface UserDefineOption {
  key: UserDefineKey;
  checked: boolean;
  label: string;
  value: string;
}

interface UserDefinesListProps {
  options: UserDefineOption[];
  whitelistKeys?: UserDefineKey[];
  onChange: (data: UserDefineOption) => void;
}

const UserDefinesList: FunctionComponent<UserDefinesListProps> = (props) => {
  const styles = useStyles();
  const { options, whitelistKeys, onChange } = props;
  const onChecked = (data: UserDefineKey) => {
    const opt = options.find(({ key }) => key === data);
    if (opt !== undefined) {
      onChange({
        ...opt,
        checked: !opt.checked,
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

  let opts = options;
  if (whitelistKeys && whitelistKeys?.length > 0) {
    opts = opts.filter(({ key }) => whitelistKeys.indexOf(key) > -1);
  }
  return (
    <List>
      {opts.map((item) => {
        return (
          <React.Fragment key={item.key}>
            <ListItem
              dense
              className={styles.option}
              selected={item.checked}
              button
              onClick={onChecked.bind(this, item.key)}
            >
              <ListItemIcon className={styles.icon}>
                <Checkbox
                  edge="start"
                  checked={item.checked}
                  tabIndex={-1}
                  disableRipple
                />
              </ListItemIcon>
              <ListItemText primary={item.label} />
              {/* this could be used to show helpful information */}
              {/* <ListItemSecondaryAction> */}
              {/*  <Tooltip title="tooltip" > */}
              {/*    <QuestionIcon/> */}
              {/*  </Tooltip> */}
              {/* </ListItemSecondaryAction> */}
            </ListItem>
            {item.key === UserDefineKey.BINDING_PHRASE && item.checked && (
              <ListItem className={styles.complimentaryItem}>
                <TextField
                  size="small"
                  onBlur={onUserDefineValueChange(item.key)}
                  fullWidth
                  label="Custom binding phrase"
                />
              </ListItem>
            )}

            {item.key === UserDefineKey.ARM_CHANNEL && item.checked && (
              <ListItem className={styles.complimentaryItem}>
                <TextField
                  size="small"
                  onBlur={onUserDefineValueChange(item.key)}
                  fullWidth
                  label="Arm channel"
                />
              </ListItem>
            )}

            {item.key === UserDefineKey.MY_STARTUP_MELODY && item.checked && (
              <ListItem className={styles.complimentaryItem}>
                <TextField
                  size="small"
                  onBlur={onUserDefineValueChange(item.key)}
                  fullWidth
                  label="Startup melody"
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
