const path = require("path");
const fs = require("fs");

/**
 * Resolves a relative path in the context of a module into an absolute path
 *
 * @param {string} moduleName
 * @param {string} relativePath the relative path inside the module
 * @returns {string|null}
 */
function resolvePath (moduleName, relativePath)
{
  if (! moduleName) {
    return null;
  }

  if (! relativePath) {
    return null;
  }

  const mainPath = require.resolve(moduleName);
  if (! mainPath) {
    return null;
  }

  const rootLocations = [];
  const dirs = mainPath.split(path.sep);
  let lastSegment = dirs.pop();
  while (lastSegment) {
    const location = dirs.concat(['package.json']).join(path.sep);
    rootLocations.push(location);
    lastSegment = dirs.pop();
  }

  for(const location of rootLocations) {
    if (fs.existsSync(location)) {
      const cli = path.resolve(path.dirname(location), relativePath);
      if (fs.existsSync(cli)) {
        return cli;
      }
    }
  }

  return null;
}

module.exports = {

  /**
   * Resolves the path to the webpack-dev-server.js executable
   *
   * @param {string} [moduleName] the webpack dev server package name, defaults to webpack-dev-server
   * @returns {string|null}
   */
  resolveBinWebpackDevServer: function (moduleName) {
    "use strict";
    const relativePath = path.join('bin', 'webpack-dev-server.js');
    return resolvePath(moduleName || 'webpack-dev-server' , relativePath);
  },

  /**
   * Resolves the path to the webpack.js executable
   *
   * @param {string} [moduleName] the webpack package name, defaults to webpack
   * @returns {string|null}
   */
  resolveBinWebpack: function (moduleName) {
    "use strict";
    const relativePath = path.join('bin', 'webpack.js');
    return resolvePath(moduleName || 'webpack', relativePath);
  }
};