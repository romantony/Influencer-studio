module.exports = {
  extends: ['@influencerstudio/config/eslint.react.cjs'],
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: ['./tsconfig.json']
  }
};
