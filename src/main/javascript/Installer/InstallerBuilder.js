const path = require('path');
const fs = require('fs');
const copy = require('recursive-copy');

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
  build(installerDir, projectDir, webpackConfig)
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

    copyInstaller(installerDir, projectDir, function(error, results) {
      if (error) {
        console.log('Error: failed to copy installer files');
        console.log('Error: ' + error);
        process.exit(1);
      }
    });

    addInstallTarget(projectDir);
  }
}

module.exports = InstallerBuilder;