import { registerEnumType } from 'type-graphql';

enum UserDefineOptionGroup {
  RegulatoryDomain900,
}

registerEnumType(UserDefineOptionGroup, {
  name: 'UserDefineOptionGroup',
});

export default UserDefineOptionGroup;
