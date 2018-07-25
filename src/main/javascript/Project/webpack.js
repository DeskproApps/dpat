const path = require("path");

const defaultWebpackConfig = require.resolve('../webpack/webpack.config-development');
const webpackResolvers = require('../webpack/resolvers');

const webpackPath = webpackResolvers.resolveBinWebpack();
if (! webpackPath) {
  console.error('could not determine the path the webpack-dev-server executable');
  process.exit(1);
}

const dpatModules = path.resolve(__dirname, '../../../../node_modules');

function getCompileConfig(projectDir) {

  return {
    webpack:        webpackPath,
    webpackConfig:  defaultWebpackConfig,
    modulePaths:    [ path.join(projectDir, 'node_modules'), dpatModules ]
  };

}

module.exports = {
  getCompileConfig: getCompileConfig
};

