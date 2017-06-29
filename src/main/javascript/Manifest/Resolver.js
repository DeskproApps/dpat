"use strict";
const path = require('path');
const fs = require('fs');

class Resolver
{
  resolveSourceFromPath(manifestPath)
  {
    if (!fs.existsSync(manifestPath)) {
      return null;
    }

    let stats = fs.statSync(manifestPath);
    if (stats.isDirectory()) {
      return this.resolveSourceFromDirectory(manifestPath);
    }

    return {
      name: path.basename(manifestPath) === 'manifest.json' ? 'manifest.json' : 'file' ,
      path: manifestPath
    }
  }

  /**
   * @param {String|null} dir
   * @return {{name:String, path:String}}
   */
  resolveSourceFromDirectory(dir)
  {
    const source = [
      {
        name: 'manifest.json',
        path: path.join(dir, 'manifest.json'),
      },
      {
        name: 'package.json',
        path: path.join(dir, 'package.json'),
      },
    ].filter(function (src) {
      return fs.existsSync(src.path);
    }).pop();

    if (typeof source !== 'object') { return null; }
    return source;
  }
}

module.exports = Resolver;