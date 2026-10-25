import React, { FunctionComponent, useEffect, useState } from 'react';
import {
  Checkbox,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
  Menu,
  MenuItem,
  TextField,
  Tooltip,
} from '@mui/material';
import { Close, History } from '@mui/icons-material';
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
import ApplicationStorage from '../../storage';
import UserDefinesValidator from '../../views/ConfiguratorView/UserDefinesValidator';

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
  historyPhrase: {
    marginRight: 2,
  },
};

const maskPhrase = (phrase: string): string => {
  if (phrase.length <= 8) {
    return `${phrase.slice(0, 1)}•••`;
  }
  return `${phrase.slice(0, 3)}•••${phrase.slice(-3)}`;
};

interface UserDefinesListProps {
  options: UserDefine[];
  onChange: (data: UserDefine) => void;
}

/*
  Numeric user defines carry their allowed range on the model (min/max), defined
  in TargetUserDefinesFactory.

  The field uses the same check that blocks the build, so the error shown here and
  the build validation can't disagree.
*/
const hasNumericRangeError = (item: UserDefine): boolean =>
  new UserDefinesValidator().validateNumericRanges([item]).length > 0;

// Helper text for numeric inputs, only shown when the value is invalid
const numericHelperText = (
  item: UserDefine,
  t: TFunction,
): string | undefined => {
  if (!hasNumericRangeError(item)) {
    return undefined;
  }
  return t('UserDefinesList.ValueOutOfRange', { min: item.min, max: item.max });
};

const UserDefinesList: FunctionComponent<UserDefinesListProps> = (props) => {
  const { options, onChange } = props;
  const { t } = useTranslation();

  const [bindingPhraseHistory, setBindingPhraseHistory] = useState<string[]>(
    [],
  );
  const [historyAnchorEl, setHistoryAnchorEl] = useState<HTMLElement | null>(
    null,
  );
  const [showHistoryPhrases, setShowHistoryPhrases] = useState(false);

  useEffect(() => {
    (async () => {
      const storage = new ApplicationStorage();
      setBindingPhraseHistory(await storage.getBindingPhraseHistory());
    })();
  }, []);

  const onHistoryOpen
    = (fieldName: string) =>
      async (event: React.MouseEvent<HTMLElement>) => {
        const anchor = event.currentTarget;
        const storage = new ApplicationStorage();
        const showData = await storage.getShowSensitiveFieldData(fieldName);
        setShowHistoryPhrases(showData ?? false);
        setHistoryAnchorEl(anchor);
      };

  const onHistoryClose = () => {
    setHistoryAnchorEl(null);
  };

  const onRemoveBindingPhraseFromHistory = async (phrase: string) => {
    const storage = new ApplicationStorage();
    await storage.removeBindingPhraseFromHistory(phrase);
    const updated = await storage.getBindingPhraseHistory();
    setBindingPhraseHistory(updated);
    if (updated.length === 0) {
      onHistoryClose();
    }
  };

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
                {item.key === UserDefineKey.BINDING_PHRASE
                  && bindingPhraseHistory.length > 0 && (
                  <>
                    <Tooltip
                      title={t('UserDefinesList.BindingPhraseHistory')}
                    >
                      <IconButton
                        aria-label={t('UserDefinesList.BindingPhraseHistory')}
                        onClick={onHistoryOpen(item.key)}
                      >
                        <History />
                      </IconButton>
                    </Tooltip>
                    <Menu
                      anchorEl={historyAnchorEl}
                      open={historyAnchorEl !== null}
                      onClose={onHistoryClose}
                    >
                      {bindingPhraseHistory.map((phrase) => (
                        <MenuItem
                          key={phrase}
                          onClick={() => {
                            onChange({
                              ...item,
                              value: phrase,
                            });
                            onHistoryClose();
                          }}
                        >
                          <ListItemText sx={styles.historyPhrase}>
                            {showHistoryPhrases ? phrase : maskPhrase(phrase)}
                          </ListItemText>
                          <IconButton
                            size="small"
                            edge="end"
                            aria-label={t(
                              'UserDefinesList.BindingPhraseHistoryRemove',
                            )}
                            onClick={(event) => {
                              event.stopPropagation();
                              onRemoveBindingPhraseFromHistory(phrase);
                            }}
                          >
                            <Close fontSize="small" />
                          </IconButton>
                        </MenuItem>
                      ))}
                    </Menu>
                  </>
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
