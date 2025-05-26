import path from 'path';

export const resolveFromRoot = (relativePath: string): string => {
  return path.resolve(__dirname, '..', relativePath);
};

export default { resolveFromRoot };
