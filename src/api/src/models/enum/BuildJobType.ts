import { registerEnumType } from 'type-graphql';

enum BuildJobType {
  Build = 'Build',
  BuildAndFlash = 'BuildAndFlash',
  ForceFlash = 'ForceFlash',
}

registerEnumType(BuildJobType, {
  name: 'BuildJobType',
});

export default BuildJobType;
