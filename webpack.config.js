const createExpoWebpackConfigAsync = require('@expo/webpack-config');

// var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = async function(env, argv) {
  const config = await createExpoWebpackConfigAsync(env, argv);
  // Customize the config before returning it (example here)
  // config.entry = [
  //   './src/index.j',
  // ];

  // config.plugins = [new HtmlWebpackPlugin({
  //   favicon: "./web/favicon.ico"
  // })]
  // Don't display warning in asset size limit
  // config.performance = {
  //   hints : false,
  //   maxEntrypointSize: 512000,
  //   maxAssetSize: 512000
  // };
  const production = true;
  config.externals = {
    'Config': JSON.stringify(production ? require('./settings.json') : require('./settings.dev.json'))
  }
  return config;
};
