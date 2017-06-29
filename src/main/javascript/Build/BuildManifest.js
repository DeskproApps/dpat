"use strict";
const path = require('path');
const fs = require('fs');

const ManifestResolver = require('../Manifest').Resolver;

const DIST_TYPE_PRODUCTION = 'production';
const DIST_TYPE_DEVELOPMENT = 'development';

const PACKAGING_TYPE_CDN = 'cdn';
const PACKAGING_TYPE_LOCAL = 'local';

/**
 * @param {String} projectDir
 * @return {String}
 */
function resolveAppVersion (projectDir)
{
  const src = new ManifestResolver().resolveSourceFromDirectory(projectDir);
  if (! src) {
    throw new Error(`app version not found in project dir ${projectDir}`);
  }

  const content = JSON.parse(fs.readFileSync(src.path, 'utf8'));
  const version = src.name === 'package.json' ? content.version : content.appVersion;
  if (typeof version === 'string') {
    return version;
  }

  throw new Error(`app version not found in ${src.path} `);
}

class BuildManifest
{
  /**
   * @param {String} projectDir
   * @param {{}} opts build options
   */
  constructor(projectDir, opts)
  {
    const props = typeof opts === 'object' ? opts : {} ;

    this.props = {
      distributionType: props.distributionType || DIST_TYPE_PRODUCTION,
      packagingType: props.packagingType || PACKAGING_TYPE_LOCAL,
      appVersion: resolveAppVersion(projectDir)
    }
  }

  getDistributionType () { return this.props.distributionType; }

  getPackagingType () { return this.props.packagingType; }

  getAppVersion () { return this.props.appVersion; }
}

module.exports = BuildManifest;