"use strict";

const program = require("commander");
const __path = require("path");

const Validator = require("../Package").Validator;

function action(path)
{
  let manifest;
  if (path) {
    manifest = __path.resolve(path);
  } else {
    manifest = __path.resolve('.');
  }

  try {
    const validationResult = new Validator().validate(manifest);
    if (validationResult) {
      console.log(`SUCCESS: ${manifest} is valid distribution`);
    } else {
      console.error(`ERROR: ${manifest} is not valid`);
      process.exit(1);
    }
  } catch (e) {
    console.log(e);
    console.error(`ERROR: ${manifest} is not a valid distribution folder `);
    process.exit(1);
  }
}

program
  .version("0.1.0", "-V, --version")
  .arguments("<path>", "validates an application manifest")
  .action(action)
  .parse(process.argv);
