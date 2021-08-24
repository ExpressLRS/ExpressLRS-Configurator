import { registerEnumType } from 'type-graphql';

enum FirmwareSource {
  GitTag = 'GitRelease',
  GitBranch = 'GitBranch',
  GitCommit = 'GitCommit',
  Local = 'Local',
  GitPullRequest = 'GitPullRequest',
}

registerEnumType(FirmwareSource, {
  name: 'FirmwareSource',
});

export default FirmwareSource;
