import baseConfig from '../../packages/config/eslint.base.mjs';

export default baseConfig.map((config) => ({
  ...config,
  files: ['app/**/*.{ts,tsx}'],
}));
