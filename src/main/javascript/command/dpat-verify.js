"use strict";

const program = require("commander");
const __path = require("path");

const validator = require("../Package").newValidator();

function action(path)
{
  let manifest;
  if (path) {
    manifest = __path.resolve(path);
  } else {
    manifest = __path.resolve('.');
  }

  try {
    const validationResult = validator.validate(manifest);
    if (validationResult) {
      console.log(`distribution at ${manifest} is valid`);
    } else {
      console.error(`invalid distribution at path ${manifest}`);
      process.exit(1);
    }
  } catch (e) {
    console.log(e);
    console.error(`invalid distribution at path ${manifest}`);
    process.exit(1);
  }
}

program
  .version("0.1.0", "-V, --version")
  .arguments("<path>", "validates an application manifest")
  .action(action)
  .parse(process.argv);
