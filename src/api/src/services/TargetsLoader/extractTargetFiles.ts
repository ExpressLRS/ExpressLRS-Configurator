const extractTargetFiles = (platformioFileContents: string): string[] => {
  const extraConfigsRegex = /(targets\/.*?.ini)/g;
  const extraTargetFiles = [
    ...platformioFileContents.matchAll(extraConfigsRegex),
  ];

  return extraTargetFiles.map((item) => {
    return item[1];
  });
};

export default extractTargetFiles;
