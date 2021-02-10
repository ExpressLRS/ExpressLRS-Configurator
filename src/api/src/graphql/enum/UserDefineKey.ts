import { registerEnumType } from 'type-graphql';
import UserDefineKey from '../../library/FirmwareBuilder/Enum/UserDefineKey';

/*
  Export library based enum to Graphql
 */
registerEnumType(UserDefineKey, {
  name: 'UserDefineKey',
});
