"use strict";
const path = require('path');
const fs = require('fs');

const DIST_TYPE_PRODUCTION = 'production';
const DIST_TYPE_DEVELOPMENT = 'development';

const PACKAGING_TYPE_CDN = 'cdn';
const PACKAGING_TYPE_LOCAL = 'local';

function readAppManifest (projectDir)
{
  const manifestJsonPath = path.join(projectDir, 'manifest.json');
  const manifestJson = require(manifestJsonPath);

  if (typeof manifestJson !== 'object') {
    throw new Error(`app manifest not found in ${manifestJsonPath} `);
  }

  return manifestJson;
}

class BuildManifest
{
  constructor(projectDir, opts)
  {
    const props = typeof opts === 'object' ? opts : {} ;
    const manifestJson = readAppManifest(projectDir);

    this.props = {
      distributionType: props.distributionType || DIST_TYPE_PRODUCTION,
      packagingType: props.packagingType || PACKAGING_TYPE_LOCAL,
      appVersion: manifestJson.appVersion
    }
  }

  getDistributionType () { return this.props.distributionType; }

  getPackagingType () { return this.props.packagingType; }

  getAppVersion () { return this.props.appVersion; }
}

module.exports = BuildManifest;