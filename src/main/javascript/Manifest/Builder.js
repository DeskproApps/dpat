"use strict";
const path = require('path');
const fs = require('fs');

const Manifest = require('./Manifest');

const mapProperties = function (target, source, mappings)
{
  Object.keys(mappings).forEach(function (targetProp){
    const sourceProp = mappings[targetProp];
    if (source.hasOwnProperty(sourceProp)) {
      target[targetProp] = source[sourceProp];
    }
  });
};

const copyProperties = function (target, source, exclusions)
{
  Object.keys(source).forEach(function (targetProp) {
    if (exclusions.indexOf(targetProp) === -1) {
      target[targetProp] = source[targetProp];
    }
  });
};

class Builder
{
  constructor()
  {
    this.props = {};
  }

  setPropsFromSource(src)
  {
    const content = JSON.parse(fs.readFileSync(src.path, 'utf8'));
    if (src.type === 'package.json') {
      return this.setPropsFromPackageJson(content)
    }

    if (src.type === 'manifest.json') {
      return this.setPropsFromManifestJson(content)
    }

    throw new Error(`unknown application manifest source: ${src.path}`);
  }

  /**
   * @param {String|{}} content
   * @return {Builder}
   */
  setPropsFromManifestJson(content)
  {
    const manifestJson = typeof content === 'string' ? JSON.parse(content) : content;

    copyProperties(this.props, manifestJson, []);
  }

  /**
   * @param {String|{}} content
   * @return {Builder}
   */
  setPropsFromPackageJson(content)
  {
    const packageJson = typeof content === 'string' ? JSON.parse(content) : content;

    const mappings = {
      appVersion : 'version',
      author: 'author',
      description: 'description',
      name: 'name'
    };
    mapProperties(this.props, packageJson, mappings);

    if (typeof packageJson.deskpro === 'object') {
      copyProperties(this.props, packageJson.deskpro, Object.keys(mappings));
    }

    return this;
  }

  build ()
  {
    const props = JSON.parse(JSON.stringify(this.props));
    return new Manifest(props);
  }
}

module.exports = Builder;