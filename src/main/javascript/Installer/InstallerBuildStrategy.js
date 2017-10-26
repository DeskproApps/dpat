const fs = require('fs');
const path = require("path");
const shelljs = require('shelljs');
const copy = require('recursive-copy');

const WebpackConfig = require('../Project/WebpackConfig');

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
          console.log('using custom strategy');
          return this.customStrategy.bind(this, projectDir);
        }
      }
    }

    return this.defaultStrategy.bind(this, projectDir);
  }

  /**
   * @param {String} projectDir
   * @param {InstallerBuilder} builder
   * @param {Function} cb
   */
  customStrategy2(projectDir, builder, cb)
  {
    const dest = builder.getTargetDestination(projectDir);
    // shelljs.rm('-rf', dest);

    const copyOptions = { overwrite: true, expand: true, dot: true };

    const onCustomInstallerFilesReady = function (err) {
      builder.buildFromSource(dest, projectDir, WebpackConfig.buildCompileConfig());
      cb();
    };

    let customInstallerSrc = path.resolve(projectDir, "src", "installer");
    customInstallerSrc = fs.realpathSync(customInstallerSrc);

    const customInstallerTarget = path.resolve(dest, "src", "settings");
    copy(customInstallerSrc, customInstallerTarget, copyOptions, onCustomInstallerFilesReady);
  }

  /**
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

    let installerDir = path.resolve(projectDir, "node_modules", "@deskpro", "apps-installer");
    installerDir = fs.realpathSync(installerDir);
    console.log('copying from ', installerDir, 'to', dest, copyOptions) ;
    copy(installerDir, dest, copyOptions, onInstallerFilesReady);
  }

  /**
   * @param {String} projectDir
   * @param {InstallerBuilder} builder
   * @param {Function} cb
   */
  defaultStrategy(projectDir, builder, cb)
  {
    const pkg = fs.realpathSync(path.resolve(__dirname, '../../../../target/app-installer.tgz'));
    builder.buildFromPackage(pkg, projectDir, cb);
  }
}

module.exports = InstallerBuildStrategy;
