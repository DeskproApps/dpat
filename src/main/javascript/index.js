const path = require('path');

const BuildUtils = require('./Build/BuildUtils');
const BuildManifest = require('./Build/BuildManifest');

const Webpack = require('./Build/Webpack');
const Babel = require('./Build/Babel');
const Resources = require('./Build/Resources');

const dpatRoot = path.resolve(__dirname, '../../../');
const resolvePath = function (relPath) {
  if (relPath) {
    return path.resolve(dpatRoot, relPath);
  }
  return dpatRoot;
};

const DPAT = {
  BuildManifest: BuildManifest,
  BuildUtils: BuildUtils,
  Webpack: Webpack,
  Babel: Babel,
  Resources: Resources,
  path: resolvePath
};

module.exports = DPAT;