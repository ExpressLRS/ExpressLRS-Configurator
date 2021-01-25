import {
  Alert,
  AlertTitle,
  FormControl,
  FormControlLabel,
  Grid,
  makeStyles,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from '@material-ui/core';
import React, { FunctionComponent } from 'react';
import { DeviceTarget } from '../../../library/FirmwareBuilder/Enum/DeviceTarget';
import { UserDefineCategory } from '../../../library/FirmwareBuilder/Enum/UserDefineCategory';
import UserDefinesList, { UserDefineOption } from '../UserDefinesList';
import { UserDefinesMode } from '../../../main/handlers/BuildFirmwareHandler';
import { UserDefinesByCategory } from '../../../library/FirmwareBuilder/UserDefineConstraints';

const useStyles = makeStyles((theme) => ({
  categoryTitle: {
    marginBottom: theme.spacing(1),
  },
  option: {
    padding: `${theme.spacing(1, 2)} !important`,
  },
  icon: {
    minWidth: 40,
  },
  userDefinesMode: {
    marginTop: theme.spacing(1),
    padding: theme.spacing(0, 0, 2, 1),
  },
  radioControl: {
    marginRight: `${theme.spacing(4)} !important`,
  },
  radio: {
    marginRight: `${theme.spacing(1)} !important`,
  },
  textarea: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
}));

export interface DeviceOptionsFormData {
  userDefinesMode: UserDefinesMode;
  userDefineOptions: UserDefineOption[];
  userDefinesTxt: string;
}

interface DeviceOptionsFormProps {
  target: DeviceTarget | null;
  categories: UserDefinesByCategory | null;
  deviceOptions: DeviceOptionsFormData;
  onChange: (data: DeviceOptionsFormData) => void;
}

const DeviceOptionsForm: FunctionComponent<DeviceOptionsFormProps> = (
  props
) => {
  const { target, categories, deviceOptions, onChange } = props;
  const styles = useStyles();
  const onOptionUpdate = (data: UserDefineOption) => {
    const updatedOptions = deviceOptions?.userDefineOptions.map((opt) => {
      if (opt.key === data.key) {
        return {
          ...data,
        };
      }
      return opt;
    });
    // TODO: to force only one regulatory option
    // if (categories[UserDefineCategory.RegulatoryDomains].indexOf(data.key) > -1) {
    //   updatedOptions = updatedOptions.map((opt) => {
    //     if (opt.key !== data.key) {
    //       return {
    //         ...opt,
    //         checked: false,
    //       };
    //     } else {
    //       return opt;
    //     }
    //   });
    // }
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

  return (
    <div>
      <FormControl component="fieldset" className={styles.userDefinesMode}>
        <RadioGroup
          row
          value={deviceOptions.userDefinesMode}
          onChange={onUserDefinesMode}
          defaultValue="top"
        >
          <FormControlLabel
            value={UserDefinesMode.UserInterface}
            className={styles.radioControl}
            control={<Radio className={styles.radio} color="primary" />}
            label="Standard mode"
          />
          <FormControlLabel
            value={UserDefinesMode.Manual}
            className={styles.radioControl}
            control={<Radio className={styles.radio} color="primary" />}
            label="Manual mode"
          />
        </RadioGroup>
      </FormControl>
      {target === null &&
        deviceOptions.userDefinesMode === UserDefinesMode.UserInterface && (
          <Alert severity="info">
            <AlertTitle>Notice</AlertTitle>
            Please select a device target first
          </Alert>
        )}
      {deviceOptions.userDefinesMode === UserDefinesMode.Manual && (
        <>
          <TextField
            className={styles.textarea}
            multiline
            label="user_defines.txt"
            onChange={onUserDefinesTxt}
            value={deviceOptions.userDefinesTxt}
            fullWidth
            rows={10}
          />
        </>
      )}
      {target !== null &&
        categories !== null &&
        deviceOptions.userDefinesMode === UserDefinesMode.UserInterface && (
          <>
            <Grid container spacing={3}>
              <Grid item xs>
                {categories[UserDefineCategory.RegulatoryDomains]?.length >
                  0 && (
                  <>
                    <Typography variant="h6" className={styles.categoryTitle}>
                      Regulatory domains
                    </Typography>
                    <UserDefinesList
                      options={deviceOptions.userDefineOptions}
                      onChange={onOptionUpdate}
                      whitelistKeys={
                        categories[UserDefineCategory.RegulatoryDomains]
                      }
                    />
                  </>
                )}
                {categories[UserDefineCategory.BindingPhrase]?.length > 0 && (
                  <>
                    <Typography variant="h6">Binding phrase setup</Typography>
                    <UserDefinesList
                      options={deviceOptions.userDefineOptions}
                      onChange={onOptionUpdate}
                      whitelistKeys={
                        categories[UserDefineCategory.BindingPhrase]
                      }
                    />
                  </>
                )}
                {categories[UserDefineCategory.HybridSwitches]?.length > 0 && (
                  <>
                    <Typography variant="h6">Hybrid switches</Typography>
                    <UserDefinesList
                      options={deviceOptions.userDefineOptions}
                      onChange={onOptionUpdate}
                      whitelistKeys={
                        categories[UserDefineCategory.HybridSwitches]
                      }
                    />
                  </>
                )}
                {categories[UserDefineCategory.CompatibilityOptions]?.length >
                  0 && (
                  <>
                    <Typography variant="h6">Compat options</Typography>
                    <UserDefinesList
                      options={deviceOptions.userDefineOptions}
                      onChange={onOptionUpdate}
                      whitelistKeys={
                        categories[UserDefineCategory.CompatibilityOptions]
                      }
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
                      options={deviceOptions.userDefineOptions}
                      onChange={onOptionUpdate}
                      whitelistKeys={
                        categories[UserDefineCategory.PerformanceOptions]
                      }
                    />
                  </>
                )}
                {categories[UserDefineCategory.OtherOptions]?.length > 0 && (
                  <>
                    <Typography variant="h6">Other options</Typography>
                    <UserDefinesList
                      options={deviceOptions.userDefineOptions}
                      onChange={onOptionUpdate}
                      whitelistKeys={
                        categories[UserDefineCategory.OtherOptions]
                      }
                    />
                  </>
                )}
              </Grid>
            </Grid>
          </>
        )}
    </div>
  );
};
export default DeviceOptionsForm;
