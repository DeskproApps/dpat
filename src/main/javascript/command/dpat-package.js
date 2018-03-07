"use strict";

const program = require("commander");
const archiver = require("archiver");
const fs = require("fs");

const __path = require("path");
const project = require("../Project");
const PackageBuilder = require("../Package").PackageBuilder;

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

  let packagePath;
  try {
    packagePath = dpProject.runPackage(projectDir, new PackageBuilder());
  } catch (e) {
    console.log(`ERROR: failed to package the distribution folder: ${projectDir}`);
    process.exit(1);
  }

  console.log(`SUCCESS: application package was created at: ${packagePath}`);
}

program
  .version("0.1.0", "-V, --version")
  .arguments("<path>")
  .action(action)
  .parse(process.argv);
