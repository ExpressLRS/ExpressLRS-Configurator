import {
  FirmwareSource,
  FlashingMethod,
  Target,
} from '../../gql/generated/types';
import buildOutputFolderName from './buildOutputFolderName';

const target: Target = {
  __typename: 'Target',
  id: 'Happymodel_EP_2400_RX_via_WIFI',
  name: 'Happymodel_EP_2400_RX_via_WIFI',
  flashingMethod: FlashingMethod.WIFI,
};

describe('buildOutputFolderName', () => {
  it('adds the firmware tag to the device target', () => {
    expect(
      buildOutputFolderName(target, {
        source: FirmwareSource.GitTag,
        gitTag: '3.5.6',
      }),
    ).toEqual('Happymodel_EP_2400_RX_via_WIFI-3.5.6');
  });

  it('adds the branch name to the device target', () => {
    expect(
      buildOutputFolderName(target, {
        source: FirmwareSource.GitBranch,
        gitBranch: 'master',
      }),
    ).toEqual('Happymodel_EP_2400_RX_via_WIFI-master');
  });

  it('adds the pull request number to the device target', () => {
    expect(
      buildOutputFolderName(target, {
        source: FirmwareSource.GitPullRequest,
        gitPullRequest: {
          id: 1,
          number: 2810,
          title: 'a pull request',
          headCommitHash: '8a4b0c1',
        },
      }),
    ).toEqual('Happymodel_EP_2400_RX_via_WIFI-PR_2810');
  });

  it('falls back to the device target alone', () => {
    expect(
      buildOutputFolderName(target, {
        source: FirmwareSource.Local,
        localPath: '/home/user/ExpressLRS',
      }),
    ).toEqual('Happymodel_EP_2400_RX_via_WIFI');
  });

  it('returns nothing without a device target', () => {
    expect(
      buildOutputFolderName(null, {
        source: FirmwareSource.GitTag,
        gitTag: '3.5.6',
      }),
    ).toEqual('');
  });
});
