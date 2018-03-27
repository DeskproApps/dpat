const path = require("path");
const fs = require("fs");

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
  resolveBinWebpackDevServer: function (moduleName) {
    "use strict";
    const relativePath = path.join('bin', 'webpack-dev-server.js');
    return resolvePath(moduleName, relativePath);
  },
  resolveBinWebpack: function (moduleName) {
    "use strict";
    const relativePath = path.join('bin', 'webpack.js');
    return resolvePath(moduleName, relativePath);
  },
};