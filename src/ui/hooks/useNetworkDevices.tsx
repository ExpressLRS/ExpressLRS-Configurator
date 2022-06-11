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

  const { data: multicastDnsDevicesListData } =
    useAvailableMulticastDnsDevicesListQuery({
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
      const update = options.subscriptionData.data?.multicastDnsMonitorUpdates;

      if (update) {
        const multicastDnsDevicesCopy = new Map<
          string,
          MulticastDnsInformation
        >(networkDevices);
        if (update?.type === MulticastDnsEventType.DeviceAdded) {
          multicastDnsDevicesCopy.set(update.data.name, update.data);

          if (!newNetworkDevices.find((d) => d.name === update.data.name)) {
            const newDevices = newNetworkDevices.map((item) => item);
            newDevices.push(update.data);
            setNewNetworkDevices(newDevices);
          }
        } else if (update?.type === MulticastDnsEventType.DeviceUpdated) {
          multicastDnsDevicesCopy.set(update.data.name, update.data);
        } else if (update?.type === MulticastDnsEventType.DeviceRemoved) {
          multicastDnsDevicesCopy.delete(update.data.name);

          if (newNetworkDevices.find((d) => d.name === update.data.name)) {
            const newDevices = newNetworkDevices.filter(
              (d) => d.name !== update.data.name
            );
            setNewNetworkDevices(newDevices);
          }
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
