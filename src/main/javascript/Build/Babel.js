"use strict";
const path = require('path');
const fs = require('fs');

function resolveOptions(babelOptions)
{
  const resolvePluginOrPreset = function (module) {
    if (typeof module === 'string') { return require.resolve(module); }
    return module;
  };

  if (babelOptions.presets) {
    babelOptions.presets = babelOptions.presets.map(resolvePluginOrPreset)
  }

  if (babelOptions.env) {
    Object.keys(babelOptions.env).forEach(function(env) {
      if (babelOptions.env[env].plugins) {
        babelOptions.env[env].plugins = babelOptions.env[env].plugins.map(resolvePluginOrPreset);
      }
    });
  }

  if (babelOptions.plugins) {
    babelOptions.plugins = babelOptions.plugins.map(resolvePluginOrPreset);
  }

  return babelOptions;
}

const DPBabel = {

  /**
   * Replaces plugin and presets short names with absolute paths
   *
   * @param {{}|String} options
   * @param {{}} overrides
   * @return {*}
   */
  resolveOptions: function (options, overrides) {
    let resolved = null;

    if (typeof options === 'string') { //we've been give a path to a project dir or babelrc
      let babelrcPath;
      const stats = fs.statSync(options);
      if (stats.isDirectory()) {
        babelrcPath = path.join(options, '.babelrc');
      } else if (stats.isFile()) {
        babelrcPath = options;
      }

      if (babelrcPath) {
        try {
          const babelOptions = JSON.parse(fs.readFileSync(babelrcPath));
          resolved = resolveOptions(babelOptions);
        } catch (e) {
          console.log(e);
        }
      }

    } else if (typeof options === 'object') {
      resolved = resolveOptions(options);
    }

    if (resolved) {
      Object.keys(overrides).forEach(function (key) {
        resolved[key] = overrides[key];
      });
      return resolved;
    }

    return null;
  }
};

module.exports = DPBabel;