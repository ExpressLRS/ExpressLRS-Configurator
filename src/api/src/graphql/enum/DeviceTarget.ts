import { registerEnumType } from 'type-graphql';
import DeviceTarget from '../../library/FirmwareBuilder/Enum/DeviceTarget';

/*
  Export library based enum to Graphql
 */
registerEnumType(DeviceTarget, {
  name: 'DeviceTarget',
});
