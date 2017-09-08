"use strict";

const fs = require("fs");
const program = require("commander");

const Manifest = require('../Manifest').Manifest;
const ManifestResolver = require('../Manifest').Resolver;
const ManifestSyntaxValidator = require('../Manifest').SyntaxValidator;

function action(manifest)
{
  const src = new ManifestResolver().resolveSourceFromPath(manifest);
  if (!src) {
    console.error(`ERROR: no manifest found at path: ${manifest}`);
    process.exit(1);
  }

  let parsedManifest;
  try {
    parsedManifest = JSON.parse(fs.readFileSync(src.path, "utf8").toString("utf8"));
  } catch (e) {
    console.error(`ERROR: could not parse manifest at path: ${manifest}`);
    process.exit(1);
  }
  
  const syntaxValidator = new ManifestSyntaxValidator();
  const isValid = syntaxValidator.validateManifest(new Manifest(parsedManifest));
  if (!isValid) {
    console.error(`ERROR: manifest at path "${manifest}" is not valid`);
    console.error(syntaxValidator.getErrorsAsString());
    process.exit(1);
  }

  console.log(`SUCCESS: ${manifest} is valid`);
}

program
    .version("0.1.0", "-V, --version")
    .arguments("<manifest>", "validates an application manifest")
    .action(action)
    .parse(process.argv);





