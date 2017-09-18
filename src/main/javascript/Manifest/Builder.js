"use strict";
const path = require('path');
const fs = require('fs');

const Manifest = require('./Manifest');
const ManifestNormalizer = require('./ManifestNormalizer');

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

  /**
   * @param {{}} src
   * @return {Builder}
   */
  setPropsFromSource(src)
  {
    const content = JSON.parse(fs.readFileSync(src.path, 'utf8'));
    if (src.name === 'package.json') {
      return this.setPropsFromPackageJson(content)
    }

    if (src.name === 'manifest.json') {
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
    return this;
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

  /**
   * @param {String} name
   * @param {String} url
   * @return {Builder}
   */
  setTarget(name, url)
  {
    const newTarget = { target: name, url: url };
    if (! this.props.targets || ! (this.props.targets instanceof Array) || 0 === this.props.targets.length ) {
      this.props.targets = [ newTarget ];
      return this;
    }

    const newTargets = this.props.targets.filter(function(target) { return target.target !== name; })
    newTargets.push(newTarget);
    this.props.targets = newTargets;
    return this;
  }

  /**
   * @return {Manifest}
   */
  build ()
  {
    const json = this.buildJSON();
    const props = JSON.parse(json);

    return new Manifest(props);
  }

  /**
   * @return {String}
   */
  buildJSON()
  {
    const normalizer = new ManifestNormalizer();
    let props = normalizer.normalizeSettings(this.props);
    return JSON.stringify(props);
  }
}

module.exports = Builder;