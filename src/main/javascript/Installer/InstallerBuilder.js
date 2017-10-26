const path = require('path');
const fs = require('fs');
const copy = require('recursive-copy');
const targz = require('targz');
const shelljs = require('shelljs');

const project = require('../Project');
const ManifestResolver = require('../Manifest').Resolver;
const ManifestBuilder = require('../Manifest').Builder;

const copyInstaller = (installerDir, projectDir, copyCallback) =>
{
  const copyOptions = { overwrite: true,
    expand: true,
    dot: false,
    junk: false,
    filter: /(install\..+|install-.+)$/,
  };

  copy(path.resolve(installerDir, 'dist'), path.resolve(projectDir, 'dist'), copyOptions, copyCallback);
};

const addInstallTarget = (projectDir) =>
{
  const src = new ManifestResolver().resolveSourceFromDirectory(path.resolve(projectDir, 'dist'));
  if (! src) {
    throw new Error(`app version not found in project dir ${projectDir}`);
  }
  const manifest = new ManifestBuilder().setPropsFromSource(src).setTarget('install', 'html/install.html').buildJSON();
  fs.writeFileSync(src.path, manifest);
};

class InstallerBuilder
{
  /**
   * @param {String} projectDir
   * @return {String}
   */
  getTargetDestination(projectDir)
  {
    return path.resolve(projectDir, 'target', 'app-installer');
  }

  buildFromPackage(pkg, projectDir, cb)
  {
    const dest = this.getTargetDestination(projectDir);
    shelljs.rm('-rf', dest);

    const buildFromdDist = this.buildFromDist.bind(this);
    targz.decompress({ src: pkg,  dest: dest}, function (err) {
      if (err) { cb(err); }
      buildFromdDist(dest + '/package', projectDir);
      cb()
    });
  }

  buildFromDist(installerDir, projectDir)
  {
    copyInstaller(installerDir, projectDir, function(error, results) {
      if (error) {
        console.log('Error: failed to copy installer files');
        console.log('Error: ' + error);
        process.exit(1);
      }
    });

    addInstallTarget(projectDir);
  }

  buildFromSource(installerDir, projectDir, webpackConfig)
  {
    const dpProject = project.newInstance();

    if (! dpProject.runPrepareCompile(installerDir)) {
      console.log('Error: failed to compile installer');
      process.exit(1);
    }

    if (! dpProject.runCompile(installerDir, webpackConfig)) {
      console.log('Error: failed to compile installer');
      process.exit(1);
    }

    this.buildFromDist(installerDir, projectDir);
  }
}

module.exports = InstallerBuilder;