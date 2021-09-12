import { makeStyles } from '@material-ui/core';
import React, { FunctionComponent, useEffect, useState } from 'react';
import Omnibox, { Option } from '../Omnibox';
import { Device } from '../../gql/generated/types';
import FlashingMethodOptions from '../FlashingMethodOptions';

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
  currentTarget: string | null;
  onChange: (data: string | null) => void;
  targetOptions: Device[] | null;
}

const DeviceTargetForm: FunctionComponent<FirmwareVersionCardProps> = (
  props
) => {
  const { onChange, currentTarget, targetOptions } = props;

  const currentDevice: Device | undefined = targetOptions?.find((device) => {
    if (device.targets.find((target) => target.name === currentTarget)) {
      return device;
    }
    return undefined;
  });

  const styles = useStyles();

  const [targetsByCategoryAndDevice, setTargetsByCategoryAndDevice] = useState<
    Dictionary<Dictionary<Device>>
  >();

  interface Dictionary<T> {
    [Key: string]: T;
  }

  useEffect(() => {
    const targetsByCategoryAndDeviceLocal = targetOptions?.reduce<
      Dictionary<Dictionary<Device>>
    >((accumulator, currentValue) => {
      if (!accumulator[currentValue.category]) {
        accumulator[currentValue.category] = {};
      }
      const category = accumulator[currentValue.category];
      category[currentValue.name] = currentValue;

      return accumulator;
    }, {});

    setTargetsByCategoryAndDevice(targetsByCategoryAndDeviceLocal);
  }, [targetOptions]);

  const [
    currentCategoryValue,
    setCurrentCategoryValue,
  ] = useState<Option | null>(
    currentTarget && currentDevice
      ? {
          label: currentDevice.category,
          value: currentDevice.category,
        }
      : null
  );

  const [currentDeviceValue, setCurrentDeviceValue] = useState<Option | null>(
    currentTarget && currentDevice
      ? {
          label: currentDevice.name,
          value: currentDevice.name,
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
    setCurrentDeviceValue(null);
    onChange(null);
  };

  const onDeviceChange = (value: string | null) => {
    if (value === null) {
      setCurrentDeviceValue(null);
    } else {
      setCurrentDeviceValue({
        label: value,
        value,
      });
    }
    onChange(null);
  };

  // verify that the currently selected category and device exist
  useEffect(() => {
    if (targetsByCategoryAndDevice && currentCategoryValue) {
      if (!targetsByCategoryAndDevice[currentCategoryValue.value]) {
        onCategoryChange(null);
      } else if (
        currentDeviceValue &&
        !targetsByCategoryAndDevice[currentCategoryValue.value][
          currentDeviceValue.value
        ]
      ) {
        onDeviceChange(null);
      }
    }
  }, [targetsByCategoryAndDevice, currentCategoryValue, currentDeviceValue]);

  const onFlashingMethodChange = (value: string | null) => {
    onChange(value);
  };

  return (
    <div>
      <div className={styles.root}>
        <Omnibox
          title="Device category"
          currentValue={currentCategoryValue}
          onChange={onCategoryChange}
          options={Object.keys(targetsByCategoryAndDevice ?? {})
            .sort()
            .map((category) => ({
              label: category,
              value: category,
            }))}
        />
      </div>
      <div className={styles.root}>
        <Omnibox
          title="Device"
          currentValue={currentDeviceValue}
          onChange={onDeviceChange}
          options={
            currentCategoryValue === null ||
            !targetsByCategoryAndDevice ||
            !targetsByCategoryAndDevice[currentCategoryValue.value]
              ? []
              : Object.keys(
                  targetsByCategoryAndDevice[currentCategoryValue.value]
                )
                  .sort()
                  .map((device) => ({
                    label: device,
                    value: device,
                  }))
          }
          // if no category has been selected, disable the target select box
          disabled={currentCategoryValue === null}
        />
      </div>

      {currentCategoryValue &&
        currentDeviceValue &&
        targetsByCategoryAndDevice &&
        targetsByCategoryAndDevice[currentCategoryValue.value] && (
          <FlashingMethodOptions
            onChange={onFlashingMethodChange}
            targetMappings={
              targetsByCategoryAndDevice[currentCategoryValue.value][
                currentDeviceValue.value
              ].targets.slice() ?? []
            }
            currentTarget={currentTarget}
          />
        )}
    </div>
  );
};

export default DeviceTargetForm;
