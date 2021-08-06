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
  onChange: (data: DeviceTarget | null) => void;
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
    // R9 Slim RX
    [DeviceTarget.Frsky_RX_R9SLIM_via_STLINK]: 'Frsky R9',
    [DeviceTarget.Frsky_RX_R9SLIM_via_BetaflightPassthrough]: 'Frsky R9',

    // R9SlimPlus RX
    [DeviceTarget.Frsky_RX_R9SLIMPLUS_via_STLINK]: 'Frsky R9',
    [DeviceTarget.Frsky_RX_R9SLIMPLUS_via_BetaflightPassthrough]: 'Frsky R9',
    [DeviceTarget.Frsky_RX_R9SLIMPLUS_OTA_via_STLINK]: 'Frsky R9',
    [DeviceTarget.Frsky_RX_R9SLIMPLUS_OTA_via_BetaflightPassthrough]:
      'Frsky R9',

    // Happymodel 915 Mhz
    [DeviceTarget.HappyModel_TX_ES915TX_via_STLINK]: 'Happymodel 915 Mhz',
    [DeviceTarget.HappyModel_TX_ES915TX_via_WIFI]: 'Happymodel 915 Mhz',
    [DeviceTarget.HappyModel_TX_ES915TX_via_stock_BL]: 'Happymodel 915 Mhz',
    [DeviceTarget.HappyModel_RX_ES915RX_via_STLINK]: 'Happymodel 915 Mhz',
    [DeviceTarget.HappyModel_RX_ES915RX_via_BetaflightPassthrough]:
      'Happymodel 915 Mhz',

    // Happymodel ES900
    [DeviceTarget.HappyModel_TX_ES900TX_via_UART]: 'HappyModel ES900',
    [DeviceTarget.HappyModel_TX_ES900TX_via_WIFI]: 'HappyModel ES900',
    [DeviceTarget.HappyModel_RX_ES900RX_via_BetaflightPassthrough]:
      'HappyModel ES900',
    [DeviceTarget.HappyModel_RX_ES900RX_via_WIFI]: 'HappyModel ES900',

    // Happymodel 2.4 Ghz
    [DeviceTarget.HappyModel_ES24TX_2400_TX_via_UART]: 'Happymodel 2.4 Ghz',
    [DeviceTarget.HappyModel_ES24TX_2400_TX_via_WIFI]: 'Happymodel 2.4 Ghz',
    [DeviceTarget.HappyModel_EP_2400_RX_via_UART]: 'Happymodel 2.4 Ghz',
    [DeviceTarget.HappyModel_EP_2400_RX_via_BetaflightPassthrough]:
      'Happymodel 2.4 Ghz',
    [DeviceTarget.HappyModel_EP_2400_RX_via_WIFI]: 'Happymodel 2.4 Ghz',
    [DeviceTarget.HappyModel_PP_2400_RX_via_STLINK]: 'Happymodel 2.4 Ghz',
    [DeviceTarget.HappyModel_PP_2400_RX_via_BetaflightPassthrough]:
      'Happymodel 2.4 Ghz',

    // NamimnoRC VOYAGER 900
    [DeviceTarget.NamimnoRC_VOYAGER_900_TX_via_STLINK]: 'NamimnoRC VOYAGER 900',
    [DeviceTarget.NamimnoRC_VOYAGER_900_TX_via_WIFI]: 'NamimnoRC VOYAGER 900',
    [DeviceTarget.NamimnoRC_VOYAGER_900_RX_via_STLINK]: 'NamimnoRC VOYAGER 900',
    [DeviceTarget.NamimnoRC_VOYAGER_900_RX_via_BetaflightPassthrough]:
      'NamimnoRC VOYAGER 900',
    [DeviceTarget.NamimnoRC_VOYAGER_900_ESP_RX_via_UART]:
      'NamimnoRC VOYAGER 900',
    [DeviceTarget.NamimnoRC_VOYAGER_900_ESP_RX_via_BetaflightPassthrough]:
      'NamimnoRC VOYAGER 900',
    [DeviceTarget.NamimnoRC_VOYAGER_900_ESP_RX_via_WIFI]:
      'NamimnoRC VOYAGER 900',

    // NamimnoRC FLASH 2.4 Ghz
    [DeviceTarget.NamimnoRC_FLASH_2400_TX_via_STLINK]:
      'NamimnoRC FLASH 2.4 Ghz',
    [DeviceTarget.NamimnoRC_FLASH_2400_TX_via_WIFI]: 'NamimnoRC FLASH 2.4 Ghz',
    [DeviceTarget.NamimnoRC_FLASH_2400_RX_via_STLINK]:
      'NamimnoRC FLASH 2.4 Ghz',
    [DeviceTarget.NamimnoRC_FLASH_2400_RX_via_BetaflightPassthrough]:
      'NamimnoRC FLASH 2.4 Ghz',
    [DeviceTarget.NamimnoRC_FLASH_2400_ESP_RX_via_UART]:
      'NamimnoRC FLASH 2.4 Ghz',
    [DeviceTarget.NamimnoRC_FLASH_2400_ESP_RX_via_BetaflightPassthrough]:
      'NamimnoRC FLASH 2.4 Ghz',
    [DeviceTarget.NamimnoRC_FLASH_2400_ESP_RX_via_WIFI]:
      'NamimnoRC FLASH 2.4 Ghz',

    // FM30 TX
    [DeviceTarget.FM30_TX_via_STLINK]: 'SIYI 2.4 Ghz',
    [DeviceTarget.FM30_TX_via_DFU]: 'SIYI 2.4 Ghz',
    [DeviceTarget.FM30_RX_MINI_via_STLINK]: 'SIYI 2.4 Ghz',
    [DeviceTarget.FM30_RX_MINI_via_BetaflightPassthrough]: 'SIYI 2.4 Ghz',

    // NeutronRC 900 Mhz
    [DeviceTarget.NeutronRC_900_RX_via_UART]: 'NeutronRC 900 Mhz',
    [DeviceTarget.NeutronRC_900_RX_via_BetaflightPassthrough]:
      'NeutronRC 900 Mhz',
    [DeviceTarget.NeutronRC_900_RX_via_WIFI]: 'NeutronRC 900 Mhz',

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
    [DeviceTarget.DIY_2400_RX_ESP8285_SX1280_via_WIFI]: 'DIY 2.4 Ghz',
    [DeviceTarget.DIY_2400_RX_ESP8285_SX1280_via_BetaflightPassthrough]:
      'DIY 2.4 Ghz',

    // DIY_2400_RX_STM32_CCG_Nano_v0_5
    [DeviceTarget.DIY_2400_RX_STM32_CCG_Nano_v0_5_via_STLINK]: 'DIY 2.4 Ghz',
    [DeviceTarget.DIY_2400_RX_STM32_CCG_Nano_v0_5_via_BetaflightPassthrough]:
      'DIY 2.4 Ghz',

    // BETAFPV 900 Mhz
    [DeviceTarget.BETAFPV_900_TX_via_UART]: 'BETAFPV 900 Mhz',
    [DeviceTarget.BETAFPV_900_TX_via_WIFI]: 'BETAFPV 900 Mhz',
    [DeviceTarget.BETAFPV_900_RX_via_UART]: 'BETAFPV 900 Mhz',
    [DeviceTarget.BETAFPV_900_RX_via_WIFI]: 'BETAFPV 900 Mhz',
    [DeviceTarget.BETAFPV_900_RX_via_BetaflightPassthrough]: 'BETAFPV 900 Mhz',

    // BETAFPV 2.4 Ghz
    [DeviceTarget.BETAFPV_2400_TX_via_UART]: 'BETAFPV 2.4 Ghz',
    [DeviceTarget.BETAFPV_2400_TX_via_WIFI]: 'BETAFPV 2.4 Ghz',
    [DeviceTarget.BETAFPV_2400_RX_via_UART]: 'BETAFPV 2.4 Ghz',
    [DeviceTarget.BETAFPV_2400_RX_via_WIFI]: 'BETAFPV 2.4 Ghz',
    [DeviceTarget.BETAFPV_2400_RX_via_BetaflightPassthrough]: 'BETAFPV 2.4 Ghz',

    // HGLRC Hermes 900 Mhz
    [DeviceTarget.HGLRC_Hermes_900_RX_via_UART]: 'HGLRC 900 Mhz',
    [DeviceTarget.HGLRC_Hermes_900_RX_via_BetaflightPassthrough]:
      'HGLRC 900 Mhz',
    [DeviceTarget.HGLRC_Hermes_900_RX_via_WIFI]: 'HGLRC 900 Mhz',

    // HGLRC Hermes 2.4 Ghz
    [DeviceTarget.HGLRC_Hermes_2400_TX_via_UART]: 'HGLRC 2.4 Ghz',
    [DeviceTarget.HGLRC_Hermes_2400_TX_via_WIFI]: 'HGLRC 2.4 Ghz',
    [DeviceTarget.HGLRC_Hermes_2400_RX_via_UART]: 'HGLRC 2.4 Ghz',
    [DeviceTarget.HGLRC_Hermes_2400_RX_via_BetaflightPassthrough]:
      'HGLRC 2.4 Ghz',
    [DeviceTarget.HGLRC_Hermes_2400_RX_via_WIFI]: 'HGLRC 2.4 Ghz',
  };
  return data[deviceTarget];
};

const DeviceTargetForm: FunctionComponent<FirmwareVersionCardProps> = (
  props
) => {
  const { onChange, currentTarget } = props;
  const currentTargetCategory: string = deviceTargetToCategory(
    currentTarget as DeviceTarget
  );
  const styles = useStyles();

  const { loading, data } = useAvailableFirmwareTargetsQuery();

  const targetOptionsByCategory: { [key: string]: Option[] } = {};

  data?.availableFirmwareTargets?.forEach((target) => {
    const category = deviceTargetToCategory(target);
    if (!targetOptionsByCategory[category]) {
      targetOptionsByCategory[category] = [];
    }
    targetOptionsByCategory[category].push({
      label: target,
      value: target,
    });
  });

  const categoryOptions: Option[] =
    Object.keys(targetOptionsByCategory)
      .sort()
      .map((target) => ({
        label: target,
        value: target,
      })) ?? [];

  const [
    currentCategoryValue,
    setCurrentCategoryValue,
  ] = useState<Option | null>(
    currentTarget
      ? {
          label: currentTargetCategory,
          value: currentTargetCategory,
        }
      : null
  );

  const [currentTargetValue, setCurrentTargetValue] = useState<Option | null>(
    currentTarget
      ? {
          label: currentTarget,
          value: currentTarget,
        }
      : null
  );

  const onCategoryChange = (value: string | null) => {
    if (value === null) {
      setCurrentCategoryValue(null);
    } else {
      setCurrentCategoryValue({
        label: value,
        value,
      });
    }
    // When category changes, set the current target to null
    setCurrentTargetValue(null);
    onChange(null);
  };

  const onTargetChange = (value: string | null) => {
    if (value === null) {
      setCurrentTargetValue(null);
    } else {
      setCurrentTargetValue({
        label: value,
        value,
      });
    }
    onChange(value as DeviceTarget);
  };

  return (
    <div>
      <div className={styles.root}>
        <Omnibox
          title="Device category"
          currentValue={currentCategoryValue}
          onChange={onCategoryChange}
          options={categoryOptions}
          loading={loading}
        />
      </div>
      <div className={styles.root}>
        <Omnibox
          title="Device target"
          currentValue={currentTargetValue}
          onChange={onTargetChange}
          options={
            currentCategoryValue === null
              ? []
              : targetOptionsByCategory[currentCategoryValue.value]
          }
          loading={loading}
          // if no category has been selected, disable the target select box
          disabled={currentCategoryValue === null}
        />
      </div>
      <Loader className={styles.loader} loading={loading} />
    </div>
  );
};

export default DeviceTargetForm;
