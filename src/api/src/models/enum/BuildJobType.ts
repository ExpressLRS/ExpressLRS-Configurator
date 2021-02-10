import { registerEnumType } from 'type-graphql';

enum BuildJobType {
  Build = 'Build',
  BuildAndFlash = 'BuildAndFlash',
}

registerEnumType(BuildJobType, {
  name: 'BuildJobType',
});

export default BuildJobType;
