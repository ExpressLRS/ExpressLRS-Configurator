import { registerEnumType } from 'type-graphql';

enum UserDefineKind {
  Boolean = 'Boolean',
  Text = 'Text',
  Enum = 'Enum',
}

registerEnumType(UserDefineKind, {
  name: 'UserDefineKind',
});

export default UserDefineKind;
