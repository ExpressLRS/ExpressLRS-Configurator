import { registerEnumType } from 'type-graphql';

enum BuildJobType {
  Build = 'Build',
  Flash = 'Flash',
}

registerEnumType(BuildJobType, {
  name: 'BuildJobType',
});

export default BuildJobType;
