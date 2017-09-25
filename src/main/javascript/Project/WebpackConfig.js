const path = require("path");

const defaultWebpackConfig = require.resolve('../webpack/webpack.config-distribution');
const webpackPath = path.resolve(__dirname, '../../../../node_modules/.bin/webpack');
const dpatModules = path.resolve(__dirname, '../../../../node_modules');

class WebpackConfig
{
  static buildCompileConfig()
  {
    return {
      webpack: webpackPath,
      webpackConfig: defaultWebpackConfig,
      modulePaths: [ dpatModules ]
    }
  }
}

module.exports = WebpackConfig;