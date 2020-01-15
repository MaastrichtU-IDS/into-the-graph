const createExpoWebpackConfigAsync = require('@expo/webpack-config');

// var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = async function(env, argv) {
  const config = await createExpoWebpackConfigAsync(env, argv);
  // Customize the config before returning it (example here)
  
  // config.plugins = [new HtmlWebpackPlugin({
  //   favicon: "./web/favicon.ico"
  // })]
  return config;
};
