const fs = require("fs");
const path = require("path");

const ManifestResolver = require('../Manifest').Resolver;
const ManifestSyntaxValidator = require('../Manifest').SyntaxValidator;
const Manifest = require('../Manifest').Manifest;

class Validator
{
  constructor ()
  {
    this.props = { manifestFilename: 'manifest.json' };
  }

  /**
   * @param {String} manifest an absolute path to a folder, a json file or an application archive
   * @returns {boolean}
   */
  validate(manifest)
  {
    const src = new ManifestResolver().resolveSourceFromPath(manifest);
    if (!src) {
      return false;
    }

    if (src.name !== 'manifest.json') {
      throw new Error(`Expected an absolute path to file named manifest.json, got instead: ${manifest}`);
    }

    let parsedManifest;
    try {
      parsedManifest = JSON.parse(fs.readFileSync(src.path, "utf8").toString("utf8"));
    } catch (e) {
      console.log(e);
    }

    if (!parsedManifest) {
      throw new Error('could not parse manifest');
    }

    const syntaxValidator = new ManifestSyntaxValidator();
    const isSyntaxValid = syntaxValidator.validateManifest(new Manifest(parsedManifest));
    if (!isSyntaxValid) {
      console.error(syntaxValidator.getErrorsAsString());
      return false;
    }

    //verify target files exist
    let rootDir = path.parse(src.path).dir;
    const targetFiles = Object.keys(parsedManifest.targets).map(function (key) {
      return path.resolve(rootDir, parsedManifest.targets[key].url);
    });
    const missingTargetFiles = targetFiles.filter(function (file) { return !fs.existsSync(file); });

    return missingTargetFiles.length === 0;
  }
}

module.exports = Validator;