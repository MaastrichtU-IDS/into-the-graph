const createExpoWebpackConfigAsync = require('@expo/webpack-config');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');


// var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = async function(env, argv) {
  const config = await createExpoWebpackConfigAsync(env, argv);
  // Customize the config before returning it (example here)
  
  // config.plugins = [new HtmlWebpackPlugin({
  //   favicon: "./web/favicon.ico"
  // })]
  // Don't display warning in asset size limit
  // config.performance = {
  //   hints : false,
  //   maxEntrypointSize: 512000,
  //   maxAssetSize: 512000
  // };
  // config.entry = [
  //   './settings.json',
  // ];

  config.mode = "production";

  // Enable sourcemaps for debugging webpack's output.
  config.devtool = "source-map";

  config.resolve = {
      // Add '.ts' and '.tsx' as resolvable extensions.
      extensions: [".ts", ".tsx", ".js"]
  };
  // config.include = __dirname + "/src/";

  config.module = {
    rules: [
      {
        test: /\.(ts|js)x?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        },
      },
      // {
      //   test: /\.ts(x?)$/,
      //   exclude: /node_modules/,
      //   use: [
      //     {
      //       loader: "ts-loader"
      //     }
      //   ]
      // },
      // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
      // {
      //   enforce: "pre",
      //   test: /\.js$/,
      //   loader: "source-map-loader"
      // },
      { test: /\.css$/, use: [
          { loader: 'style-loader' },
          { loader: 'css-loader' }
        ] 
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif|ico)$/,
        // exclude: /node_modules/,
        use: ['file-loader?name=[name].[ext]'] // ?name=[name].[ext] is only necessary to preserve the original file name
      }
    ]
  };

  // When importing a module whose path matches one of the following, just
  // assume a corresponding global variable exists and use that instead.
  // This is important because it allows us to avoid bundling all of our
  // dependencies, which allows browsers to cache those libraries between builds.
  const production = true;
  config.externals = {
    'Config': JSON.stringify(production ? require('./settings.json') : require('./settings.dev.json')),
    // 'react': 'React',
    // 'react-dom': 'ReactDOM'
  }

  return config;
};
