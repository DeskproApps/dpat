"use strict";

const program = require("commander");
const archiver = require("archiver");
const fs = require("fs");
const __path = require("path");

const AsyncAction = require('../../../commander/AsyncAction');
const WebpackConfig = require('../Project/WebpackConfig');
const InstallerBuilder = require('../Installer/InstallerBuilder');

/**
 * @param {String} path
 * @param {Command} cmd
 * @param {function} done
 */
function action(path, cmd, done)
{
  let projectDir;
  if (path) {
    projectDir = fs.realpathSync(__path.resolve(path));
  } else {
    projectDir = fs.realpathSync(__path.resolve('.'));
  }

  const buildCb = function() {
    console.log('SUCCESS: Installer packaged');
    done();
  };

  const installerBuilder = new InstallerBuilder();

  if (cmd.compile) {
    const webpackConfig = WebpackConfig.buildCompileConfig();
    const src = fs.realpathSync(__path.resolve(__dirname, '../../../../node_modules/@deskproapps/app-installer'));
    installerBuilder.buildFromSource(src, projectDir, webpackConfig);
    buildCb();
    return;
  }

  const pkg = fs.realpathSync(__path.resolve(__dirname, '../../../../target/app-installer.tgz'));
  installerBuilder.buildFromPackage(pkg, projectDir, buildCb);
}

program
  .version("0.1.0", "-V, --version")
  .arguments("<path>")
  .option("-c, --compile", "compile the installer instead of using the packaged version")
  .action(AsyncAction(action))
  .parse(process.argv);
