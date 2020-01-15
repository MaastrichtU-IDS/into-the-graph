const createExpoWebpackConfigAsync = require('@expo/webpack-config');

// var HtmlWebpackPlugin = require('html-webpack-plugin');
// const FaviconsWebpackPlugin = require('favicons-webpack-plugin')
// var CopyWebpackPlugin = require('copy-webpack-plugin');

// See https://stackoverflow.com/questions/37298215/add-favicon-with-react-and-webpack

module.exports = async function(env, argv) {
  const config = await createExpoWebpackConfigAsync(env, argv);
  // Customize the config before returning it.
  // config.plugins = [new HtmlWebpackPlugin({
  //   favicon: "../../../../public/favicon.ico"
  //   // template: [__dirname, 'public', 'favicon.ico'].join('/')
  // })]
  
  // config.plugins = [
  //   new FaviconsWebpackPlugin('../../../../public/favicon.ico')
  // ]

  // config.plugins = [new CopyWebpackPlugin([
  //   // relative path is from src
  //   { from: './public/favicon.ico' }, // <- your path to favicon
  // ])]
  return config;
};
