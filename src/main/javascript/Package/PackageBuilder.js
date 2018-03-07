'use strict';

const path = require('path');
const fs = require('fs');
const archiver = require("archiver");

const ManifestResolver = require('../Manifest').Resolver;
const Manifest = require('../Manifest').Manifest;

const convertAppName = require('./convertAppName');

class PackageBuilder
{
  /**
   * @param {string} manifestDir
   * @returns {string}
   */
  resolveArtifactFileNameFromManifestDir(manifestDir) {
    const src = new ManifestResolver().resolveSourceFromDirectory(manifestDir);
    if (! src) {
      throw new Error(`could not find manifest in ${manifestDir}`);
    }

    const props = JSON.parse(fs.readFileSync(src.path, "utf8").toString("utf8"));
    const manifest = new Manifest(props, src);

    return this.resolveArtifactFileName(manifest);
  }

  /**
   * @param {Manifest} manifest
   * @returns {string|null}
   */
  resolveArtifactFileName(manifest)
  {
    const appName = manifest.getName();
    if (!appName) {
      return null;
    }

    return convertAppName(appName, 'zip');
  }

  /**
   * @param {String} distDir
   * @param {String} artifactName
   * @return {String} the full path to the created artifact
   */
  build (distDir, artifactName)
  {
    const output = fs.createWriteStream(path.join(distDir, artifactName));
    const archive = archiver('zip', {
      store: true // Sets the compression method to STORE.
    });

    archive.directory(path.join(distDir, 'assets'), 'assets', {});
    archive.directory(path.join(distDir, 'html'), 'html', {});
    archive.file(path.join(distDir, 'manifest.json'), { name: 'manifest.json' });

    archive.pipe(output);
    archive.finalize();

    return path.join(distDir, artifactName);
  }
}

module.exports = PackageBuilder;