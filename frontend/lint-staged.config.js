export default {
  '**/*.{ts,tsx}': (stagedFiles) => [`eslint .`, `prettier --write ${stagedFiles.join(' ')}`]
};
