import { registerEnumType } from 'type-graphql';

enum BuildJobType {
  Build = 'Build',
  BuildAndFlash = 'BuildAndFlash',
  ForceFlash = 'ForceFlash',
  CheckTarget = 'CheckTarget',
}

registerEnumType(BuildJobType, {
  name: 'BuildJobType',
});

export default BuildJobType;
