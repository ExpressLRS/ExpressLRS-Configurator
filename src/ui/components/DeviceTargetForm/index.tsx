import { makeStyles } from '@material-ui/core';
import React, { FunctionComponent, useState } from 'react';
import Omnibox, { Option } from '../Omnibox';
import {
  DeviceTarget,
  useAvailableFirmwareTargetsQuery,
} from '../../gql/generated/types';
import Loader from '../Loader';

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  loader: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
}));

interface FirmwareVersionCardProps {
  currentTarget: DeviceTarget | null;
  onChange: (data: DeviceTarget) => void;
}

export type DeviceCategoryByDeviceTarget = {
  [key in DeviceTarget]: string;
};

const deviceTargetToCategory = (deviceTarget: DeviceTarget): string => {
  const data: DeviceCategoryByDeviceTarget = {
    // R9M TX
    [DeviceTarget.Frsky_TX_R9M_via_STLINK]: 'Frsky R9',
    [DeviceTarget.Frsky_TX_R9M_via_stock_BL]: 'Frsky R9',
    [DeviceTarget.Frsky_TX_R9M_via_WIFI]: 'Frsky R9',
    // R9M Lite TX
    [DeviceTarget.Frsky_TX_R9M_LITE_via_STLINK]: 'Frsky R9',
    [DeviceTarget.Frsky_TX_R9M_LITE_via_stock_BL]: 'Frsky R9',
    // R9M Lite Pro
    [DeviceTarget.Frsky_TX_R9M_LITE_PRO_via_STLINK]: 'Frsky R9',
    // R9MM RX / R9Mini RX
    [DeviceTarget.Frsky_RX_R9MM_R9MINI_via_STLINK]: 'Frsky R9',
    [DeviceTarget.Frsky_RX_R9MM_R9MINI_via_BetaflightPassthrough]: 'Frsky R9',

    // R9SlimPlus RX
    [DeviceTarget.Frsky_RX_R9SLIMPLUS_via_STLINK]: 'Frsky R9',
    [DeviceTarget.Frsky_RX_R9SLIMPLUS_via_BetaflightPassthrough]: 'Frsky R9',
    [DeviceTarget.Frsky_RX_R9SLIMPLUS_OTA_via_STLINK]: 'Frsky R9',
    [DeviceTarget.Frsky_RX_R9SLIMPLUS_OTA_via_BetaflightPassthrough]:
      'Frsky R9',

    // Happymodel 915 Mhz
    [DeviceTarget.HappyModel_TX_ES915TX_via_STLINK]: 'Happymodel 915 Mhz',
    [DeviceTarget.HappyModel_TX_ES915TX_via_stock_BL]: 'Happymodel 915 Mhz',
    [DeviceTarget.HappyModel_RX_ES915RX_via_STLINK]: 'Happymodel 915 Mhz',
    [DeviceTarget.HappyModel_RX_ES915RX_via_BetaflightPassthrough]:
      'Happymodel 915 Mhz',

    // NamimnoRC VOYAGER 900
    [DeviceTarget.NamimnoRC_VOYAGER_900_TX_via_STLINK]: 'NamimnoRC VOYAGER 900',
    [DeviceTarget.NamimnoRC_VOYAGER_900_TX_via_WIFI]: 'NamimnoRC VOYAGER 900',
    [DeviceTarget.NamimnoRC_VOYAGER_900_RX_via_STLINK]: 'NamimnoRC VOYAGER 900',
    [DeviceTarget.NamimnoRC_VOYAGER_900_RX_via_BetaflightPassthrough]:
      'NamimnoRC VOYAGER 900',

    // NamimnoRC 2.4 Ghz
    [DeviceTarget.NamimnoRC_FLASH_2400_TX_via_STLINK]: 'NamimnoRC 2.4 Ghz',
    [DeviceTarget.NamimnoRC_FLASH_2400_TX_via_WIFI]: 'NamimnoRC 2.4 Ghz',
    [DeviceTarget.NamimnoRC_FLASH_2400_RX_via_STLINK]: 'NamimnoRC 2.4 Ghz',
    [DeviceTarget.NamimnoRC_FLASH_2400_RX_via_BetaflightPassthrough]:
      'NamimnoRC 2.4 Ghz',

    // FM30 TX
    [DeviceTarget.FM30_TX_via_STLINK]: 'SIYI 2.4 Ghz',
    [DeviceTarget.FM30_TX_via_DFU]: 'SIYI 2.4 Ghz',

    // R9MX RX
    [DeviceTarget.Frsky_RX_R9MX_via_STLINK]: 'Frsky R9',
    [DeviceTarget.Frsky_RX_R9MX_via_BetaflightPassthrough]: 'Frsky R9',

    // Jumper R900 Mini RX
    [DeviceTarget.Jumper_RX_R900MINI_via_STLINK]: 'Jumper R900',
    [DeviceTarget.Jumper_RX_R900MINI_via_BetaflightPassthrough]: 'Jumper R900',

    // 900Mhz TTGO V1 TX
    [DeviceTarget.DIY_900_TX_TTGO_V1_SX127x_via_UART]: 'DIY 900 Mhz',

    // 900 TTGO V2 TX
    [DeviceTarget.DIY_900_TX_TTGO_V2_SX127x_via_UART]: 'DIY 900 Mhz',

    // DIY 900Mhz Mhz TXs
    [DeviceTarget.DIY_900_TX_ESP32_SX127x_E19_via_UART]: 'DIY 900 Mhz',
    [DeviceTarget.DIY_900_TX_ESP32_SX127x_RFM95_via_UART]: 'DIY 900 Mhz',
    [DeviceTarget.DIY_900_RX_ESP8285_SX127x_via_UART]: 'DIY 900 Mhz',
    [DeviceTarget.DIY_900_RX_ESP8285_SX127x_via_BetaflightPassthrough]:
      'DIY 900 Mhz',

    // DIY 2400 Mhz TXs
    [DeviceTarget.DIY_2400_TX_ESP32_SX1280_Mini_via_UART]: 'DIY 2.4 Ghz',
    [DeviceTarget.DIY_2400_TX_ESP32_SX1280_E28_via_UART]: 'DIY 2.4 Ghz',
    [DeviceTarget.DIY_2400_TX_ESP32_SX1280_LORA1280F27_via_UART]: 'DIY 2.4 Ghz',

    [DeviceTarget.GHOST_2400_TX_via_STLINK]: 'ImmersionRC Ghost',
    [DeviceTarget.GHOST_2400_TX_LITE_via_STLINK]: 'ImmersionRC Ghost',

    // GHOST_ATTO_2400_RX
    [DeviceTarget.GHOST_ATTO_2400_RX_via_STLINK]: 'ImmersionRC Ghost',
    [DeviceTarget.GHOST_ATTO_2400_RX_via_BetaflightPassthrough]:
      'ImmersionRC Ghost',

    // DIY_2400_RX_ESP8285_SX1280
    [DeviceTarget.DIY_2400_RX_ESP8285_SX1280_via_UART]: 'DIY 2.4 Ghz',
    [DeviceTarget.DIY_2400_RX_ESP8285_SX1280_via_BetaflightPassthrough]:
      'DIY 2.4 Ghz',

    // DIY_2400_RX_STM32_CCG_Nano_v0_5
    [DeviceTarget.DIY_2400_RX_STM32_CCG_Nano_v0_5_via_STLINK]: 'DIY 2.4 Ghz',
    [DeviceTarget.DIY_2400_RX_STM32_CCG_Nano_v0_5_via_BetaflightPassthrough]:
      'DIY 2.4 Ghz',
  };
  return data[deviceTarget];
};

const DeviceTargetForm: FunctionComponent<FirmwareVersionCardProps> = (
  props
) => {
  const { onChange, currentTarget } = props;
  const styles = useStyles();

  const { loading, data } = useAvailableFirmwareTargetsQuery();
  const options: Option[] =
    data?.availableFirmwareTargets?.map((target) => ({
      label: target,
      value: target,
    })) ?? [];

  const [currentValue, setCurrentValue] = useState<Option | null>(
    currentTarget
      ? {
          label: currentTarget,
          value: currentTarget,
        }
      : null
  );
  const onDeviceChange = (value: string | null) => {
    if (value === null) {
      setCurrentValue(null);
    } else {
      setCurrentValue({
        label: value,
        value,
      });
    }
    onChange(value as DeviceTarget);
  };

  return (
    <div className={styles.root}>
      <Omnibox
        title="Device target"
        currentValue={currentValue}
        onChange={onDeviceChange}
        options={options}
        loading={loading}
        groupBy={(opt) => deviceTargetToCategory(opt.value as DeviceTarget)}
      />
      <Loader className={styles.loader} loading={loading} />
    </div>
  );
};

export default DeviceTargetForm;
