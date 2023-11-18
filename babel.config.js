// eslint-disable-next-line fp/no-mutation
module.exports = function makeBabelConfig(api) {
  api.cache(true);

  const presets = [
    '@babel/preset-env',
    '@babel/preset-typescript',
  ];

  return {
    presets,
  };
};
