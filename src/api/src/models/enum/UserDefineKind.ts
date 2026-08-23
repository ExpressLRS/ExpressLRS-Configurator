import { registerEnumType } from 'type-graphql';

enum UserDefineKind {
  Boolean = 'Boolean',
  Text = 'Text',
  Enum = 'Enum',
  Number = 'Number',
}

registerEnumType(UserDefineKind, {
  name: 'UserDefineKind',
});

export default UserDefineKind;
