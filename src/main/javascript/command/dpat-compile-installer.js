"use strict";

const program = require("commander");
const archiver = require("archiver");
const fs = require("fs");
const __path = require("path");

const appInstallerPath = fs.realpathSync(__path.resolve(__dirname, '../../../../node_modules/@deskproapps/app-installer'));
const WebpackConfig = require('../Project/WebpackConfig');
const InstallerBuilder = require('../Installer/InstallerBuilder');

/**
 * @param {String} path
 * @param {Command} cmd
 */
function action(path, cmd)
{
  let projectDir;
  if (path) {
    projectDir = fs.realpathSync(__path.resolve(path));
  } else {
    projectDir = fs.realpathSync(__path.resolve('.'));
  }

  const webpackConfig = WebpackConfig.buildCompileConfig();

  const installerBuilder = new InstallerBuilder();
  installerBuilder.build(appInstallerPath, projectDir, webpackConfig);

  console.log('SUCCESS: Installer compiled');
}

program
  .version("0.1.0", "-V, --version")
  .arguments("<path>")
  .action(action)
  .parse(process.argv);
