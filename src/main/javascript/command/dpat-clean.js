"use strict";

const program = require("commander");
const shelljs = require('shelljs');
const fs = require("fs");

const __path = require("path");

/**
 * @param {String} path
 * @param {Command} cmd
 */
function action(path, cmd)
{
  let distDir;
  if (path) {
    distDir = __path.resolve(path, 'dist');
  } else {
    distDir = __path.resolve('.', 'dist');
  }

  if (!fs.existsSync(distDir)) {
    console.log('Nothing to clean.');
    return;
  }

  const fsStats  = fs.statSync(distDir);
  if (! fsStats.isDirectory()) {
    console.log(`WARNING: Nothing to clean, ${distDir} is not a directory`);
    return;
  }

  shelljs.rm('-rf', `${distDir}/*`);
  console.log(`SUCCESS: Cleaned previous build output`);
}

program
  .version("0.1.0", "-V, --version")
  .arguments("<path>")
  .action(action)
  .parse(process.argv);