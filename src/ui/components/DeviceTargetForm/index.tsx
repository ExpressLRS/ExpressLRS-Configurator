import React, {
  FunctionComponent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { Box } from '@mui/material';
import Omnibox from '../Omnibox';
import { Device, Target } from '../../gql/generated/types';
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
}

const DeviceTargetForm: FunctionComponent<FirmwareVersionCardProps> = (
  props
) => {
  const { onChange, currentTarget, targetOptions } = props;

  interface Dictionary<T> {
    [Key: string]: T;
  }

  // create a dictionary for Category -> Device -> Targets
  const targetsByCategoryAndDevice = useMemo(() => {
    return targetOptions?.reduce<Dictionary<Dictionary<Device>>>(
      (accumulator, currentValue) => {
        if (!accumulator[currentValue.category]) {
          accumulator[currentValue.category] = {};
        }
        const category = accumulator[currentValue.category];
        category[currentValue.name] = currentValue;

        return accumulator;
      },
      {}
    );
  }, [targetOptions]);

  const [currentTargetValue, setCurrentTargetValue] = useState<Target | null>(
    null
  );

  const [selectedCategoryValue, setSelectedCategoryValue] = useState<
    string | null
  >(null);

  const [selectedDeviceValue, setSelectedDeviceValue] = useState<string | null>(
    null
  );

  useEffect(() => {
    const device = targetOptions?.find((item) =>
      item.targets.find((target) => target.id === currentTarget?.id)
    );

    // verify that if there is a currentTarget that the category and device values match that target
    if (device) {
      if (selectedCategoryValue !== device.category) {
        setSelectedCategoryValue(device.category);
      }
      if (selectedDeviceValue !== device.name) {
        setSelectedDeviceValue(device.name);
      }
    }
    setCurrentTargetValue(currentTarget);
  }, [currentTarget, targetOptions]);

  const onCategoryChange = useCallback(
    (value: string | null) => {
      if (value === null) {
        setSelectedCategoryValue(null);
      } else {
        setSelectedCategoryValue(value);
      }
      // When category changes, set the current target to null
      setSelectedDeviceValue(null);
      onChange(null);
    },
    [onChange]
  );

  const onDeviceChange = useCallback(
    (value: string | null) => {
      if (value === null) {
        setSelectedDeviceValue(null);
      } else {
        setSelectedDeviceValue(value);
      }
      onChange(null);
    },
    [onChange]
  );

  useEffect(() => {
    // verify that the currently selected category and device exist
    if (targetsByCategoryAndDevice && selectedCategoryValue) {
      if (!targetsByCategoryAndDevice[selectedCategoryValue]) {
        onCategoryChange(null);
      } else if (
        selectedDeviceValue &&
        targetsByCategoryAndDevice &&
        !targetsByCategoryAndDevice[selectedCategoryValue][selectedDeviceValue]
      ) {
        onDeviceChange(null);
      }
    }
  }, [
    onCategoryChange,
    onDeviceChange,
    selectedCategoryValue,
    selectedDeviceValue,
    targetsByCategoryAndDevice,
  ]);

  const onFlashingMethodChange = useCallback(
    (value: Target | null) => {
      onChange(value);
    },
    [onChange]
  );

  const categorySelectOptions = useMemo(() => {
    return Object.keys(targetsByCategoryAndDevice ?? {})
      .sort()
      .map((category) => ({
        label: category,
        value: category,
      }));
  }, [targetsByCategoryAndDevice]);

  const deviceSelectOptions = useMemo(() => {
    return !targetsByCategoryAndDevice ||
      !selectedCategoryValue ||
      !targetsByCategoryAndDevice[selectedCategoryValue]
      ? []
      : Object.keys(targetsByCategoryAndDevice[selectedCategoryValue])
          .sort()
          .map((device) => ({
            label: device,
            value: device,
          }));
  }, [targetsByCategoryAndDevice, selectedCategoryValue]);

  return (
    <>
      <Box sx={styles.root}>
        <Omnibox
          title="Device category"
          currentValue={
            categorySelectOptions.find(
              (item) => item.value === selectedCategoryValue
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
              (item) => item.value === selectedDeviceValue
            ) ?? null
          }
          onChange={onDeviceChange}
          options={deviceSelectOptions}
          // if no category has been selected, disable the target select box
          disabled={selectedCategoryValue === null}
        />
      </Box>

      {selectedCategoryValue &&
        selectedDeviceValue &&
        targetsByCategoryAndDevice &&
        targetsByCategoryAndDevice[selectedCategoryValue] && (
          <FlashingMethodOptions
            onChange={onFlashingMethodChange}
            currentTarget={currentTargetValue}
            currentDevice={
              targetsByCategoryAndDevice[selectedCategoryValue][
                selectedDeviceValue
              ] ?? null
            }
          />
        )}
    </>
  );
};

export default DeviceTargetForm;
