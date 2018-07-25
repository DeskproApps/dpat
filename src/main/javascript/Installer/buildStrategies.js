const fs = require('fs');
const path = require("path");
const shelljs = require('shelljs');
const copy = require('recursive-copy');

const INSTALLER_PACKAGE_NAME = 'apps-installer';
const INSTALLER_PACKAGE = path.resolve(__dirname, `../../../../target/${INSTALLER_PACKAGE_NAME}.tgz`);


/**
 * Builds the installer from a tgz package that comes with dpat. This is the default cause when the app does not have its own installer
 *
 * @param {String} projectDir
 * @param {InstallerBuilder} builder
 * @param {Function} cb
 */
function defaultStrategy(projectDir, builder, cb)
{
  const pkg = fs.realpathSync(INSTALLER_PACKAGE);
  builder.buildFromPackage(pkg, projectDir, cb);
}

/**
 * Builds the installer in its own dist folder, useful in dev mode because it does not copy all 4k packages
 *
 * @param {String} projectDir
 * @param {InstallerBuilder} builder
 * @param {Function} cb
 */
function customStrategyInPlace(projectDir, builder, cb)
{
  const installerDir = path.resolve(projectDir, "node_modules", "@deskpro", INSTALLER_PACKAGE_NAME);
  const customInstallerTarget = path.resolve(installerDir, "src", "settings");
  shelljs.rm('-rf', customInstallerTarget);

  const copyOptions = { overwrite: true, expand: true, dot: true };

  function onCustomInstallerFilesReady (err) {
    builder.buildFromSource(installerDir, projectDir);
    cb();
  }

  let customInstallerSrc = path.resolve(projectDir, "src", "installer");
  customInstallerSrc = fs.realpathSync(customInstallerSrc);

  copy(customInstallerSrc, customInstallerTarget, copyOptions, onCustomInstallerFilesReady);
}


/**
 * Builds the installer under the app's own target folder
 *
 * @param {String} projectDir
 * @param {InstallerBuilder} builder
 * @param {Function} cb
 */
function customStrategy(projectDir, builder, cb)
{
  const dest = builder.getTargetDestination(projectDir);
  shelljs.rm('-rf', dest);

  const copyOptions = { overwrite: true, expand: true, dot: true };

  const onCustomInstallerFilesReady = function (err) {
    builder.buildFromSource(dest, projectDir);
    cb();
  };

  const onInstallerFilesReady = function (err) {
    if (err) {
      cb(err);
      return;
    }

    let customInstallerSrc = path.resolve(projectDir, "src", "installer");
    customInstallerSrc = fs.realpathSync(customInstallerSrc);

    const customInstallerTarget = path.resolve(dest, "src", "settings");
    copy(customInstallerSrc, customInstallerTarget, copyOptions, onCustomInstallerFilesReady);
  };

  let installerDir = path.resolve(projectDir, "node_modules", "@deskpro", INSTALLER_PACKAGE_NAME);
  installerDir = fs.realpathSync(installerDir);
  copy(installerDir, dest, copyOptions, onInstallerFilesReady);
}


function resolveStrategy(projectDir)
{
  let installerDir = path.resolve(projectDir, "node_modules", "@deskpro", "apps-installer");
  const customInstallerDir = path.resolve(projectDir, "src", "installer", "javascript");

  if (fs.existsSync(installerDir) && fs.existsSync(customInstallerDir)) {
    const indexFilenames = ['index.js', 'index.jsx'];
    for (const filename of indexFilenames) {
      if (fs.existsSync(path.resolve(customInstallerDir, filename))) {
        console.log('will build custom installer');
        return customStrategyInPlace.bind(this, projectDir);
      }
    }
  }
  console.log('will build default installer');
  return defaultStrategy.bind(this, projectDir);
}

module.exports = {

  resolveStrategy:        resolveStrategy,

  customStrategy:         customStrategy,

  customStrategyInPlace:  customStrategyInPlace,

  defaultStrategy:        defaultStrategy

};
