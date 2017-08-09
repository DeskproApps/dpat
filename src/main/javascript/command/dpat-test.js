"use strict";

const program = require("commander");
const archiver = require("archiver");
const fs = require("fs");

const __path = require("path");
const project = require("../Project");
const jestPath = __path.resolve(__dirname, '../../../../node_modules/.bin/jest');
const dpatModules = __path.resolve(__dirname, '../../../../node_modules');

/**
 * @param {String} path
 * @param {Command} cmd
 */
function action(path, cmd)
{
  let projectDir;
  if (path) {
    projectDir = __path.resolve(path);
  } else {
    projectDir = __path.resolve('.');
  }
  const dpProject = project.newInstance();

  const runConfig = { jest: jestPath, modulePaths: [ dpatModules ] };
  if (! dpProject.runTests(projectDir, runConfig)) {
    process.exit(1);
  }

  console.log('SUCCESS: Project compiled');
}

program
  .version("0.1.0", "-V, --version")
  .arguments("<path>")
  .action(action)
  .parse(process.argv);