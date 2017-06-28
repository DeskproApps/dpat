const path = require('path');
const fs = require('fs');

const dpat = require('@deskproapps/dpat');

module.exports = function (env)
{
  const PROJECT_ROOT_PATH = env && env.DP_PROJECT_ROOT ? env.DP_PROJECT_ROOT : path.resolve(__dirname, '../../');

  const buildManifest = new dpat.BuildManifest(
    PROJECT_ROOT_PATH,
    { distributionType: 'development', packagingType: 'local' }
  );

  const resources = dpat.Resources.copyDescriptors(buildManifest, PROJECT_ROOT_PATH);
  const bundlePackages = dpat.BuildUtils.bundlePackages(PROJECT_ROOT_PATH, 'devDependencies');
  const babelOptions = dpat.Babel.resolveOptions(PROJECT_ROOT_PATH, { babelrc: false });

  // emulate the Files API path which is used by deskpro to fetch the app files
  const FILES_API_PATH = `v${buildManifest.getAppVersion()}/files`;
  // the relative path of the assets inside the distribution bundle
  const DISTRIBUTION_ASSET_PATH = 'assets';

  const extractCssPlugin = new dpat.Webpack.ExtractTextPlugin({
    filename: '[name].css',
    publicPath: `/${FILES_API_PATH}/${DISTRIBUTION_ASSET_PATH}/`,
    allChunks: true
  });

  const configParts = [{}];
  configParts.push({
    devServer: {
      contentBase: path.resolve(PROJECT_ROOT_PATH, 'target'),
      clientLogLevel: 'warning',
      hot: true,
      historyApiFallback: true,
      port: 31080,
      publicPath: `/${FILES_API_PATH}/${DISTRIBUTION_ASSET_PATH}/`,
      watchContentBase: true,
      headers : {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PATCH, PUT, DELETE, CONNECT, OPTIONS, TRACE',
        'Access-Control-Allow-Headers': 'Origin, X-Agent-Request'
      }
    },
    externals: {
      'react': 'React',
      'react-dom': 'ReactDOM',
    },
    devtool: 'inline-source-map',
    entry: {
      main: [
        `webpack-dev-server/client?http://localhost:31080`,
        path.resolve(PROJECT_ROOT_PATH, 'src/webpack/entrypoint.js')
      ],
      vendor: bundlePackages
    },
    module: {
      loaders: [
        {
          test: /\.jsx?$/,
          loader: 'babel-loader',
          include: [
            path.resolve(PROJECT_ROOT_PATH, 'src/main/javascript'),
            path.resolve(PROJECT_ROOT_PATH, 'node_modules', '@deskproapps', 'deskproapps-sdk-core'),
            path.resolve(PROJECT_ROOT_PATH, 'node_modules', '@deskproapps', 'deskproapps-sdk-react')
          ],
          options: babelOptions
        },
        {
          test: /\.css$/,
          use: extractCssPlugin.extract({use: ['style-loader', 'css-loader']})
        },
        {
          include: [path.resolve(PROJECT_ROOT_PATH, 'src/main/sass')],
          loader: extractCssPlugin.extract({use: ['css-loader', 'sass-loader']}),
          test: /\.scss$/
        }
      ],
    },
    output: {
      chunkFilename: `${FILES_API_PATH}/${DISTRIBUTION_ASSET_PATH}/[name].js`,
      filename: '[name].js',
      path: path.resolve(PROJECT_ROOT_PATH, 'target'),
      publicPath: `/${FILES_API_PATH}/${DISTRIBUTION_ASSET_PATH}/`
    },
    plugins: [
      extractCssPlugin,

      new dpat.Webpack.optimize.CommonsChunkPlugin({name: ['vendor'], minChunks: Infinity}),
      new dpat.Webpack.NamedModulesPlugin(),

      new dpat.Webpack.CopyWebpackPlugin(resources, { debug: true, copyUnmodified: true }),
      new dpat.Webpack.WriteFilePlugin({
        test: /\html\/|assets\/|dist\/|README\.md|manifest\.json/,
        useHashIndex: false
      }),

      new dpat.Webpack.HotModuleReplacementPlugin(),
      new dpat.Webpack.NoEmitOnErrorsPlugin(),
    ],
    resolve: {
      extensions: ['*', '.js', '.jsx', '.scss', '.css'],
      modules: [ "node_modules", dpat.path("node_modules"), path.join(PROJECT_ROOT_PATH, "node_modules") ],
    },
    resolveLoader: {
      modules: [ "node_modules", dpat.path("node_modules"), path.join(PROJECT_ROOT_PATH, "node_modules") ]
    },
    node: {fs: 'empty'},
    bail: true
  });

  return Object.assign.apply(Object, configParts);
};
