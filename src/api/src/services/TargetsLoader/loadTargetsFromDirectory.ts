import fs from 'fs';
import path from 'path';
import extractTargets from './extractTargets';

const loadTargetsFromDirectory = async (
  localPath: string
): Promise<string[]> => {
  if (!fs.existsSync(localPath)) {
    const errorMessage = `directory ${localPath} does not exist`;
    throw new Error(errorMessage);
  }

  const files = await fs.promises.readdir(localPath);
  const targetFiles: string[] = files
    .map((file) => {
      if (file.endsWith('ini')) {
        return file;
      }
      return '';
    })
    .filter((file) => file !== '');

  const values = await Promise.all(
    targetFiles.map(async (file) => {
      const filePath = path.join(localPath, file);
      const stat = await fs.promises.stat(filePath);
      if (stat.isFile()) {
        const data = await fs.promises.readFile(filePath, 'utf8');
        return extractTargets(data);
      }
      return [];
    })
  );
  return values.reduce<string[]>((prev, curr) => {
    return prev.concat(curr);
  }, []);
};

export default loadTargetsFromDirectory;
