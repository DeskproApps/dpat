const fs = require('fs');
const path = require("path");
const shelljs = require('shelljs');
const copy = require('recursive-copy');

const WebpackConfig = require('../Project/WebpackConfig');

const INSTALLER_PACKAGE_NAME = 'apps-installer';
const INSTALLER_PACKAGE = path.resolve(__dirname, `../../../../target/${INSTALLER_PACKAGE_NAME}.tgz`);

class InstallerBuildStrategy
{
  resolveStrategy(projectDir)
  {
    let installerDir = path.resolve(projectDir, "node_modules", "@deskpro", "apps-installer");
    const customInstallerDir = path.resolve(projectDir, "src", "installer", "javascript");

    if (fs.existsSync(installerDir) && fs.existsSync(customInstallerDir)) {
      const indexFilenames = ['index.js', 'index.jsx'];
      for (const filename of indexFilenames) {
        if (fs.existsSync(path.resolve(customInstallerDir, filename))) {
          console.log('will build custom installer');
          return this.customStrategyInPlace.bind(this, projectDir);
        }
      }
    }
    console.log('will build default installer');
    return this.defaultStrategy.bind(this, projectDir);
  }

  /**
   * Builds the installer in its own dist folder, useful in dev mode because it does not copy all 4k packages
   *
   * @param {String} projectDir
   * @param {InstallerBuilder} builder
   * @param {Function} cb
   */
  customStrategyInPlace(projectDir, builder, cb)
  {
    const installerDir = path.resolve(projectDir, "node_modules", "@deskpro", INSTALLER_PACKAGE_NAME);
    const customInstallerTarget = path.resolve(installerDir, "src", "settings");
    shelljs.rm('-rf', customInstallerTarget);


    const copyOptions = { overwrite: true, expand: true, dot: true };

    const onCustomInstallerFilesReady = function (err) {
      builder.buildFromSource(installerDir, projectDir, WebpackConfig.buildCompileConfig());
      cb();
    };

    let customInstallerSrc = path.resolve(projectDir, "src", "installer");
    customInstallerSrc = fs.realpathSync(customInstallerSrc);

    copy(customInstallerSrc, customInstallerTarget, copyOptions, onCustomInstallerFilesReady);
  }

  /**
   * Builds the installer under the apps target folder
   *
   * @param {String} projectDir
   * @param {InstallerBuilder} builder
   * @param {Function} cb
   */
  customStrategy(projectDir, builder, cb)
  {
    const dest = builder.getTargetDestination(projectDir);
    shelljs.rm('-rf', dest);

    const copyOptions = { overwrite: true, expand: true, dot: true };

    const onCustomInstallerFilesReady = function (err) {
      builder.buildFromSource(dest, projectDir, WebpackConfig.buildCompileConfig());
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

  /**
   * @param {String} projectDir
   * @param {InstallerBuilder} builder
   * @param {Function} cb
   */
  defaultStrategy(projectDir, builder, cb)
  {
    const pkg = fs.realpathSync(INSTALLER_PACKAGE);
    builder.buildFromPackage(pkg, projectDir, cb);
  }
}

module.exports = InstallerBuildStrategy;
