"use strict";

const program = require("commander");
const archiver = require("archiver");
const fs = require("fs");
const __path = require("path");

const AsyncAction = require('../../../commander/AsyncAction');
const WebpackConfig = require('../Project/WebpackConfig');
const InstallerBuilder = require('../Installer/InstallerBuilder');
const InstallerBuildStrategy = require('../Installer/InstallerBuildStrategy');

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

  const bundleDone = function() {
    console.log('SUCCESS: Installer packaged');
    done();
  };

  const installerStrategy = new InstallerBuildStrategy();
  const bundleStrategy = installerStrategy.resolveStrategy(projectDir);
  bundleStrategy(new InstallerBuilder(), bundleDone);
}

program
  .version("0.1.0", "-V, --version")
  .arguments("<path>")
  .action(AsyncAction(action))
  .parse(process.argv);
