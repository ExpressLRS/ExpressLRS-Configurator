import React, { FunctionComponent } from 'react';
import semver from 'semver';
import {
  FirmwareSource,
  FirmwareVersionDataInput,
} from '../../gql/generated/types';

const toUrl = (
  firmwareVersion: FirmwareVersionDataInput | null,
  url: string
): string => {
  if (
    firmwareVersion &&
    firmwareVersion.source === FirmwareSource.GitTag &&
    firmwareVersion.gitTag &&
    semver.major(firmwareVersion.gitTag) > 0
  ) {
    const majorVersion = semver.major(firmwareVersion.gitTag);
    return url.replace('{version}', `${majorVersion}.0`);
  }
  return url.replace('{version}', 'release');
};

interface DocumentationLinkProps {
  url: string;
  firmwareVersion: FirmwareVersionDataInput | null;
}

const DocumentationLink: FunctionComponent<DocumentationLinkProps> = ({
  children,
  url,
  firmwareVersion,
}) => {
  const href = toUrl(firmwareVersion, url);
  return (
    <a target="_blank" rel="noreferrer noreferrer" href={href}>
      {children}
    </a>
  );
};

export default DocumentationLink;
