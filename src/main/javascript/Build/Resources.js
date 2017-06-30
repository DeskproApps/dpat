"use strict";
const path = require('path');
const fs = require('fs');

const ManifestBuilder = require('../Manifest').Builder;
const ManifestResolver = require('../Manifest').Resolver;

/**
 * @param {BuildManifest} buildManifest
 * @return {Function}
 */
function createProcessHtmlTransformer(buildManifest)
{
  const forCDN = buildManifest.getPackagingType() == 'cdn';

  "use strict";
  const replacements = [
    {
      pattern: '(https?:)?//unpkg.com/react/dist/react.min.js'.replace('.', '\.'),
      replacement: forCDN ? '//unpkg.com/react@15.5.3/dist/react.min.js' : '../assets/react.js'
    },
    {
      pattern: '(https?:)?//unpkg.com/react-dom/dist/react-dom.min.js'.replace('.', '\.'),
      replacement: forCDN ? '//unpkg.com/react-dom@15.5.3/dist/react-dom.min.js' : '../assets/react-dom.js'
    }
  ];

  /**
   * @param {Buffer} content
   * @param {String} path
   * @return {Buffer}
   */
  return function (content, path) {
    let replacedContent = content.toString('utf8');
    for (const replacement of replacements) {
      replacedContent = replacedContent.replace(new RegExp(replacement.pattern), replacement.replacement)
    }

    return new Buffer(replacedContent, 'utf8');
  };
}

/**
 * @param {Buffer} content
 * @param {String} path
 * @return {Buffer}
 */
function transformPackageJSON (content, path)
{
  try {
    const manifest = new ManifestBuilder().setPropsFromPackageJson(content.toString('utf8')).build();
    return new Buffer(JSON.stringify(manifest), 'utf8');
  } catch (e) {
    return new Buffer(e.toString(), 'utf8');
  }
}

function validatePattern(pattern) { return fs.existsSync(pattern.from); }

/**
 * @param {BuildManifest} buildManifest
 * @param {String} projectRoot
 * @return {[*,*,*,*]}
 */
function appResources(buildManifest, projectRoot)
{
  const forProduction = buildManifest.getDistributionType() === 'production';
  const destination = forProduction ? 'dist' : ['target', 'v' + buildManifest.getAppVersion(), 'files'].join(path.sep);
  const manifestJsonDestination = path.join(projectRoot, forProduction ? 'dist' : 'target', 'manifest.json');

  // patterns for copying static files from the app's source
  const patterns = [
    {
      from: path.resolve(projectRoot, 'src', 'main', 'html'),
      to: path.join(projectRoot, destination, 'html'),
      force: true,
      transform: createProcessHtmlTransformer(buildManifest)
    },
    {
      from: path.resolve(projectRoot, 'src', 'main', 'resources'),
      to: path.join(projectRoot, destination, 'assets'),
      force: true
    },
    {
      from: path.resolve(projectRoot, 'src', 'main', 'docs', 'README.md'),
      to: path.join(projectRoot, destination, 'README.md'),
      force: true
    }
  ];

  const manifestSource = new ManifestResolver().resolveSourceFromDirectory(projectRoot);
  if (!manifestSource) {
    return patterns;
  }

  const appManifestPattern = {
    from: manifestSource.path,
    to: manifestJsonDestination
  };

  if (manifestSource.name === 'package.json') {
    appManifestPattern.transform = transformPackageJSON;
  }
  return patterns.concat(appManifestPattern);
}

/**
 * @param {BuildManifest} buildManifest
 * @param {String} projectRoot
 * @return {[*,*]}
 */
function sdkResources(buildManifest, projectRoot)
{
  const forProduction = buildManifest.getDistributionType() === 'production';
  const destination = forProduction ? 'dist' : ['target', 'v' + buildManifest.getAppVersion(), 'files'].join(path.sep);

  const deskproappsPath = path.join(projectRoot, 'node_modules', '@deskproapps');

  return [
    {
      from: path.join(deskproappsPath, 'deskproapps-sdk-react', 'dist', 'deskproapps-sdk-react.js'),
      to: path.join(projectRoot, destination, 'assets', 'deskproapps-sdk-react.js'),
      force: true
    },
    {
      from: path.join(deskproappsPath, 'deskproapps-sdk-core', 'dist', 'deskproapps-sdk-core.js'),
      to: path.join(projectRoot, destination, 'assets', 'deskproapps-sdk-core.js'),
      force: true
    }
  ];
}

/**
 * @param {BuildManifest} buildManifest
 * @param {String} projectRoot
 * @return {[*,*]}
 */
function reactResources(buildManifest, projectRoot)
{
  const forProduction = buildManifest.getDistributionType() === 'production';
  if (forProduction) { return []; }

  const appVersion = 'v' + buildManifest.getAppVersion();
  return [
    {
      from: path.resolve(projectRoot, 'node_modules', 'react', 'dist', 'react.js'),
      to: path.join(projectRoot, 'target', appVersion, 'files', 'assets', 'react.js'),
      force: true
    },
    {
      from: path.resolve(projectRoot, 'node_modules', 'react-dom', 'dist', 'react-dom.js'),
      to: path.join(projectRoot, 'target', appVersion, 'files', 'assets', 'react-dom.js'),
      force: true
    }
  ];
}

const Resources = {
  /**
   * @param {BuildManifest} buildManifest
   * @param {String} projectRoot
   */
  copyDescriptors: function (buildManifest, projectRoot)
  {
    if (buildManifest.getDistributionType() === 'production') {
      return appResources(buildManifest, projectRoot).filter(validatePattern);
    }

    if (buildManifest.getDistributionType() === 'development') {
      const app = appResources(buildManifest, projectRoot).filter(validatePattern);
      const sdk = sdkResources(buildManifest, projectRoot).filter(validatePattern);
      const react = reactResources(buildManifest, projectRoot).filter(validatePattern);

      return app.concat(sdk).concat(react);
    }

    throw new Error('unknown distribution type');
  },

};

module.exports = Resources;