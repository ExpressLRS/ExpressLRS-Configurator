import React, {
  FunctionComponent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { Box } from '@mui/material';
import Omnibox from '../Omnibox';
import {
  Device,
  FirmwareVersionDataInput,
  Target,
} from '../../gql/generated/types';
import FlashingMethodOptions from '../FlashingMethodOptions';

const styles = {
  root: {
    marginY: 2,
  },
};

interface FirmwareVersionCardProps {
  currentTarget: Target | null;
  onChange: (data: Target | null) => void;
  targetOptions: Device[] | null;
  firmwareVersionData: FirmwareVersionDataInput | null;
}

const DeviceTargetForm: FunctionComponent<FirmwareVersionCardProps> = ({
  onChange,
  currentTarget,
  targetOptions,
  firmwareVersionData,
}) => {
  const [currentDevice, setCurrentDevice] = useState<Device | null>(null);

  const [currentCategory, setCurrentCategory] = useState<string | null>(null);

  const categorySelectOptions = useMemo(() => {
    if (targetOptions === null) {
      return [];
    }
    return targetOptions
      .map((item) => item.category)
      .filter((value, index, array) => array.indexOf(value) === index) // unique values
      .map((category) => {
        return {
          label: category,
          value: category,
        };
      });
  }, [targetOptions]);

  const deviceSelectOptions = useMemo(() => {
    if (targetOptions === null || currentCategory === null) {
      return [];
    }

    return targetOptions
      .filter((item) => item.category === currentCategory)
      .map((item) => {
        return {
          label: item.name,
          value: item.name,
        };
      });
  }, [targetOptions, currentCategory]);

  // Used when currentTarget is changed from Network devices popup
  useEffect(() => {
    const device = targetOptions?.find((item) =>
      item.targets.find((target) => target.id === currentTarget?.id)
    );

    // verify that if there is a currentTarget that the category and device values match that target
    if (device) {
      if (currentCategory !== device.category) {
        setCurrentCategory(device.category);
      }
      if (currentDevice?.name !== device.name) {
        setCurrentDevice(device);
      }
    }
  }, [currentTarget, targetOptions]);

  const onCategoryChange = useCallback(
    (value: string | null) => {
      if (value === null) {
        setCurrentCategory(null);
      } else {
        setCurrentCategory(value);
      }
      // When category changes, set the current target to null
      setCurrentDevice(null);
      onChange(null);
    },
    [onChange]
  );

  const onDeviceChange = useCallback(
    (value: string | null) => {
      if (value === null) {
        setCurrentDevice(null);
        onChange(null);
      } else {
        const device =
          targetOptions?.find((item) => item.name === value) ?? null;
        setCurrentDevice(device);
        onChange(device?.targets[0] ?? null);
      }
    },
    [onChange, currentCategory, targetOptions]
  );

  /*
    Check if current device & category is present in targetOptions. If not - reset to default state.
   */
  useEffect(() => {
    const category = targetOptions?.find(
      (item) => item.category === currentCategory
    );
    const device = targetOptions?.find(
      (item) => item.name === currentDevice?.name
    );
    if (!category && !device) {
      onCategoryChange(null);
      onDeviceChange(null);
      onChange(null);
    } else if (category && !device) {
      onDeviceChange(null);
      onChange(null);
    }
  }, [onCategoryChange, onDeviceChange, currentCategory, currentDevice]);

  const onFlashingMethodChange = (value: Target | null) => {
    onChange(value);
  };

  return (
    <>
      <Box sx={styles.root}>
        <Omnibox
          title="Device category"
          currentValue={
            categorySelectOptions.find(
              (item) => item.value === currentCategory
            ) ?? null
          }
          onChange={onCategoryChange}
          options={categorySelectOptions}
        />
      </Box>
      <Box sx={styles.root}>
        <Omnibox
          title="Device"
          currentValue={
            deviceSelectOptions.find(
              (item) => item.value === currentDevice?.name
            ) ?? null
          }
          onChange={onDeviceChange}
          options={deviceSelectOptions}
          // if no category has been selected, disable the target select box
          disabled={currentCategory === null}
        />
      </Box>

      {currentCategory && currentDevice && targetOptions && (
        <FlashingMethodOptions
          onChange={onFlashingMethodChange}
          currentTarget={currentTarget}
          currentDevice={currentDevice}
          firmwareVersionData={firmwareVersionData}
        />
      )}
    </>
  );
};

export default DeviceTargetForm;
