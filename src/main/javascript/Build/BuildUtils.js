"use strict";
const path = require('path');
const fs = require('fs');

function startsWith (subject, prefix) {
  return subject.substr(0, prefix.length) === prefix;
}

function artifactName(projectName, baseName) {
  const nameParts = projectName.replace(/\+/, '').split(' ');
  if (baseName && baseName.charAt(0) !== '.') {
    nameParts.push(baseName);
  }
  const name = nameParts.join('-');

  if (baseName && baseName.charAt(0) === '.') {
    return name + baseName;
  }
  return name;
}

function extractVendors (packageJson, ignoreDevDependencies)
{
  let vendorPackages = [];
  if (packageJson.dependencies) {
    vendorPackages = Object.keys(packageJson.dependencies).concat(vendorPackages);
  }

  if (!ignoreDevDependencies && packageJson.devDependencies) {
    vendorPackages = Object.keys(packageJson.devDependencies).concat(vendorPackages);
  }

  return vendorPackages;
}

/**
 * @param {String} projectDir
 * @return {{}}
 */
function readPackageJson(projectDir)
{
  const packageJsonPath = path.resolve(projectDir, 'package.json');
  return require(packageJsonPath);
}

const BuildUtils = {

  artifactName: function (projectDir) {
    "use strict";
    const projectName = readPackageJson(projectDir).name;

    return function (baseName) {
      return artifactName(projectName, baseName);
    }
  },

  appVersion: function (projectDir)
  {
    const manifestJsonPath = path.join(projectDir, 'manifest.json');
    const manifestJson = require(manifestJsonPath);

    return manifestJson.appVersion;
  },

  bundlePackages: function (projectDir, excludePackages)
  {
    "use strict";
    const packageJson = readPackageJson(projectDir);
    const ignoreDevDeps = typeof excludePackages === 'string' && excludePackages === 'devDependencies';

    if (ignoreDevDeps) {
      return extractVendors(packageJson, ignoreDevDeps);
    }

    let exclusions = excludePackages instanceof Array ? excludePackages : [];
    exclusions  = [ '@deskproapps/dpat' ].concat(exclusions); // make sure we're excluding dpat
    const extracted = extractVendors(packageJson);
    return extracted.filter(function (packageName) { return exclusions.indexOf(packageName) === -1; });
  },

  /**
   * Scans the package.json manifest for deskpro packages and returns their names
   *
   * @param projectDir
   * @return {Array<String>}
   */
  deskproPackages: function (projectDir)
  {
    "use strict";
    const packageJson = readPackageJson(projectDir);
    const extracted = extractVendors(packageJson);

    return extracted.filter(function (packageName) { return startsWith(packageName, '@deskproapps/'); });
  },

  /**
   * Scans the package.json manifest for dependencies and devdependencies and returns a list of package names that
   * can be used by webpack to create the vendor bundle
   *
   * @param {String} projectDir
   * @return {Array<String>}
   */
  vendorPackages: function (projectDir)
  {
    "use strict";
    const packageJson = readPackageJson(projectDir);
    const extracted = extractVendors(packageJson);

    return extracted.filter(function (packageName) { return !startsWith(packageName, '@deskproapps/'); });
  },
};

module.exports = BuildUtils;