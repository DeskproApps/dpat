"use strict";

const program = require("commander");
const fs = require("fs");
const __path = require("path");

const AsyncAction = require('../../../commander/AsyncAction');
const InstallerBuilder = require('../Installer/InstallerBuilder');
const buildStrategies = require('../Installer/buildStrategies');

/**
 * @param {String} path
 * @param {Command} cmd
 * @param {function} done
 */
function action(path, cmd, done)
{
  const actualPath = path || '.';
  const projectDir = fs.realpathSync(__path.resolve(actualPath));

  const onReady = function() {
    console.log('SUCCESS: Installer packaged');
    done();
  };

  const strategy = buildStrategies.resolveStrategy(projectDir);
  strategy(new InstallerBuilder(), onReady);
}

program
  .version("0.1.0", "-V, --version")
  .arguments("<path>")
  .action(AsyncAction(action))
  .parse(process.argv);
