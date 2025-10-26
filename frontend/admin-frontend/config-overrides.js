module.exports = function override(config, env) {
  // Deshabilitar fork-ts-checker-webpack-plugin que consume mucha memoria
  config.plugins = config.plugins.filter(
    (plugin) => plugin.constructor.name !== "ForkTsCheckerWebpackPlugin"
  );

  // Deshabilitar ESLint plugin
  config.plugins = config.plugins.filter(
    (plugin) => plugin.constructor.name !== "ESLintWebpackPlugin"
  );

  return config;
};
