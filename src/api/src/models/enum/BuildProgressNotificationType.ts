import { registerEnumType } from 'type-graphql';

enum BuildProgressNotificationType {
  Success = 'SUCCESS',
  Info = 'INFO',
  Error = 'ERROR',
}

registerEnumType(BuildProgressNotificationType, {
  name: 'BuildProgressNotificationType',
});

export default BuildProgressNotificationType;
