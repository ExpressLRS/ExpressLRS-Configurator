import { useCallback, useEffect, useState } from 'react';
import {
  MulticastDnsEventType,
  MulticastDnsInformation,
  useAvailableMulticastDnsDevicesListQuery,
  useMulticastDnsMonitorUpdatesSubscription,
} from '../gql/generated/types';
import client from '../gql';

export default function useNetworkDevices() {
  const [networkDevices, setNetworkDevices] = useState<
    Map<string, MulticastDnsInformation>
  >(new Map<string, MulticastDnsInformation>());

  const {
    loading: multicastDnsDevicesListLoading,
    data: multicastDnsDevicesListData,
    error: multicastDnsDevicesListError,
  } = useAvailableMulticastDnsDevicesListQuery({
    fetchPolicy: 'network-only',
    client,
  });

  useEffect(() => {
    if (multicastDnsDevicesListData) {
      const multicastDnsDevicesCopy = new Map<string, MulticastDnsInformation>(
        networkDevices
      );
      multicastDnsDevicesListData.availableMulticastDnsDevicesList.forEach(
        (item) => {
          multicastDnsDevicesCopy.set(item.name, item);
        }
      );
      setNetworkDevices(multicastDnsDevicesCopy);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [multicastDnsDevicesListData]);

  const [newNetworkDevices, setNewNetworkDevices] = useState<
    MulticastDnsInformation[]
  >([]);

  useMulticastDnsMonitorUpdatesSubscription({
    fetchPolicy: 'network-only',
    client,
    onSubscriptionData: (options) => {
      const data = options.subscriptionData.data?.multicastDnsMonitorUpdates;
      if (data) {
        const multicastDnsDevicesCopy = new Map<
          string,
          MulticastDnsInformation
        >(networkDevices);

        if (data?.type === MulticastDnsEventType.DeviceAdded) {
          multicastDnsDevicesCopy.set(data.data.name, data.data);

          const newDevices = newNetworkDevices.map((item) => item);
          newDevices.push(data.data);
          setNewNetworkDevices(newDevices);
        } else if (data?.type === MulticastDnsEventType.DeviceUpdated) {
          multicastDnsDevicesCopy.set(data.data.name, data.data);
        } else if (data?.type === MulticastDnsEventType.DeviceRemoved) {
          multicastDnsDevicesCopy.delete(data.data.name);
        }

        setNetworkDevices(multicastDnsDevicesCopy);
      }
    },
  });

  const removeDeviceFromNewList = useCallback(
    (deviceName: string) => {
      setNewNetworkDevices(
        newNetworkDevices.filter((d) => d.name !== deviceName)
      );
    },
    [newNetworkDevices]
  );

  return {
    networkDevices,
    newNetworkDevices,
    removeDeviceFromNewList,
  };
}
