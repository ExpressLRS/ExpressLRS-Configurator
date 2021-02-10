import { registerEnumType } from 'type-graphql';

enum UserDefinesMode {
  UserInterface = 'UserInterface',
  Manual = 'Manual',
}

registerEnumType(UserDefinesMode, {
  name: 'UserDefinesMode',
});

export default UserDefinesMode;
