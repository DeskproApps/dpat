const SchemaValidator = require("jsonschema").Validator;
const Manifest = require("./Manifest");
const ManifestSchema = require("./ManifestSchema");

class SyntaxValidator
{
  /**
   * @param {Manifest|{}}manifest
   * @return {boolean}
   */
  validateUsingDefaultSchema(manifest)
  {
    const schema = Object.assign({}, ManifestSchema);
    return this.validate(manifest, schema);
  }

  /**
   * @param {Manifest|{}}manifest
   * @param {ManifestSchema} schema
   * @return {boolean}
   */
  validate(manifest, schema)
  {
    const manifestJSON = manifest instanceof Manifest ? manifest.toJSON() : manifest;
    const schemaJSON = JSON.parse(JSON.stringify(schema));

    let syntaxValidation = (new SchemaValidator()).validate(manifestJSON, schemaJSON);
    return 0 === syntaxValidation.errors.length;
  }
}

module.exports = SyntaxValidator;