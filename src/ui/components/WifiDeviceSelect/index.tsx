import { Box, Tab, Tabs, TextField } from '@mui/material';
import React, {
  FunctionComponent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { SxProps, Theme } from '@mui/system';
import { useTranslation } from 'react-i18next';
import Omnibox, { Option } from '../Omnibox';
import { MulticastDnsInformation } from '../../gql/generated/types';

const styles: Record<string, SxProps<Theme>> = {
  root: {
    marginBottom: 2,
  },
  tabs: {
    marginBottom: 2,
  },
  inner: {
    display: 'flex',
    alignItems: 'center',
  },
};

interface WifiDeviceSelectProps {
  wifiDevice: string | null;
  wifiDevices: MulticastDnsInformation[];
  onChange: (wifiDevice: string | null) => void;
}

enum WifiSourceType {
  LIST,
  MANUAL,
}

const WifiDeviceSelect: FunctionComponent<WifiDeviceSelectProps> = (props) => {
  const { wifiDevice, wifiDevices, onChange } = props;
  const { t } = useTranslation();

  const options = useMemo(() => {
    const result = wifiDevices.map((target) => {
      return {
        label: `${target.name} - ${
          target.deviceName ? target.deviceName : target.target
        } (${target.ip})`,
        value: target.ip,
      };
    });

    if (result.length === 0) {
      result.push({
        label: t('WifiDeviceSelect.DefaultWifiIp'),
        value: `10.0.0.1`,
      });
    }

    return result;
  }, [wifiDevices]);

  const [currentlySelectedValue, setCurrentlySelectedValue] =
    useState<Option | null>(
      wifiDevice
        ? options.find((item) => item.value === wifiDevice) ?? null
        : null
    );

  useEffect(() => {
    setCurrentlySelectedValue(
      options.find((item) => item.value === wifiDevice) ??
        options[0] ??
        currentlySelectedValue
    );
  }, [currentlySelectedValue, options, wifiDevice]);

  const [currentTextBoxValue, setCurrentTextBoxValue] = useState<string | null>(
    wifiDevice
  );

  const onDeviceSelectChange = useCallback(
    (value: string | null) => {
      if (value === null) {
        setCurrentlySelectedValue(null);
      } else {
        setCurrentlySelectedValue(
          options.find((item) => item.value === value) ?? null
        );
        onChange(value);
      }
    },
    [onChange, options]
  );

  const onTextFieldValueChange = useCallback(
    (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
      setCurrentTextBoxValue(event.target.value);
      onChange(event.target.value);
    },
    [onChange]
  );

  const [wifiSource, setWifiSource] = useState<WifiSourceType>(
    WifiSourceType.LIST
  );

  const handleWifiSourceChange = useCallback(
    (_event: React.SyntheticEvent, value: WifiSourceType) => {
      setWifiSource(value);
      if (value === WifiSourceType.LIST) {
        onChange(currentlySelectedValue?.value ?? null);
      } else if (value === WifiSourceType.MANUAL) {
        onChange(currentTextBoxValue);
      }
    },
    [currentTextBoxValue, currentlySelectedValue, onChange]
  );

  return (
    <Box sx={styles.root}>
      <Tabs
        sx={styles.tabs}
        defaultValue={WifiSourceType.LIST}
        value={wifiSource}
        onChange={handleWifiSourceChange}
      >
        <Tab
          label={t('WifiDeviceSelect.WiFiDevices')}
          value={WifiSourceType.LIST}
        />
        <Tab
          label={t('WifiDeviceSelect.Manual')}
          value={WifiSourceType.MANUAL}
        />
      </Tabs>
      {wifiSource === WifiSourceType.LIST && (
        <Box sx={styles.inner}>
          <Omnibox
            title={t('WifiDeviceSelect.WiFiDeviceSelection')}
            currentValue={
              options.find(
                (item) => item.value === currentlySelectedValue?.value
              ) ?? null
            }
            onChange={onDeviceSelectChange}
            options={options}
          />
        </Box>
      )}

      {wifiSource === WifiSourceType.MANUAL && (
        <div>
          <TextField
            onChange={onTextFieldValueChange}
            fullWidth
            label={t('WifiDeviceSelect.IPAddress')}
            value={currentTextBoxValue}
          />
        </div>
      )}
    </Box>
  );
};

export default WifiDeviceSelect;
