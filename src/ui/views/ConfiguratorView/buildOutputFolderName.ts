import {
  FirmwareSource,
  FirmwareVersionDataInput,
  Target,
} from '../../gql/generated/types';

/**
 * Folder the firmware of a build is saved into, ie.
 * "Happymodel_EP_2400_RX_via_WIFI-3.5.6". Build artefacts are not always named
 * after the device target, so the folder keeps that information visible.
 */
export default function buildOutputFolderName(
  target: Target | null,
  firmwareVersion: FirmwareVersionDataInput | null,
): string {
  const targetName = target?.name ?? '';
  if (targetName.length === 0) {
    return '';
  }
  switch (firmwareVersion?.source) {
    case FirmwareSource.GitTag:
      return `${targetName}-${firmwareVersion.gitTag}`;
    case FirmwareSource.GitBranch:
      return `${targetName}-${firmwareVersion.gitBranch}`;
    case FirmwareSource.GitCommit:
      return `${targetName}-${firmwareVersion.gitCommit}`;
    case FirmwareSource.GitPullRequest:
      return `${targetName}-PR_${firmwareVersion.gitPullRequest?.number}`;
    default:
      return targetName;
  }
}
