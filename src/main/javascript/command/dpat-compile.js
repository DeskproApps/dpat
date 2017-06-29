"use strict";

const program = require("commander");
const archiver = require("archiver");
const fs = require("fs");

const defaultWebpackConfig = require.resolve('../webpack/webpack.config-distribution');
const __path = require("path");
const project = require("../Project");
const webpackPath = __path.resolve(__dirname, '../../../../node_modules/.bin/webpack');

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

  // TODO verify project dir is a valid dp apps project
  // TODO handle failure
  if (! dpProject.runPrepareCompile(projectDir)) {
    process.exit(1);
  }


  if (! dpProject.runCompile(projectDir, webpackPath, defaultWebpackConfig)) {
    process.exit(1);
  }

  console.log('SUCCESS: Project compiled');
}

program
  .version("0.1.0", "-V, --version")
  .arguments("<path>")
  .action(action)
  .parse(process.argv);
