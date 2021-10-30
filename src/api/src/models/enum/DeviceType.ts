import { registerEnumType } from 'type-graphql';

enum DeviceType {
  ExpressLRS = 'ExpressLRS',
  Backpack = 'Backpack',
}

registerEnumType(DeviceType, {
  name: 'DeviceType',
});

export default DeviceType;
