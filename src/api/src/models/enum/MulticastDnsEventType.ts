import { registerEnumType } from 'type-graphql';

enum MulticastDnsEventType {
  DeviceAdded = 'DEVICE_ADDED',
  DeviceRemoved = 'DEVICE_REMOVED',
  DeviceUpdated = 'DEVICE_UPDATED',
}

registerEnumType(MulticastDnsEventType, {
  name: 'MulticastDnsEventType',
});

export default MulticastDnsEventType;
