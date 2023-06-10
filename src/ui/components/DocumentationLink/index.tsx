import React, { FunctionComponent } from 'react';

interface DocumentationLinkProps {
  url: string;
  children?: React.ReactNode;
}

const DocumentationLink: FunctionComponent<DocumentationLinkProps> = ({
  children,
  url,
}) => {
  return (
    <a target="_blank" rel="noreferrer noreferrer" href={url}>
      {children}
    </a>
  );
};

export default DocumentationLink;
