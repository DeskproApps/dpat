const SchemaValidator = require("jsonschema").Validator;
const Manifest = require("./Manifest");
const SchemaRegistry = require("./SchemaRegistry");

class SyntaxValidator
{
  /**
   * Constructor
   */
  constructor() {
    this.errors = [];
  }
  
  /**
   * @param {Manifest} manifest
   * @return {boolean}
   */
  validateManifest(manifest)
  {
    this.errors = [];
    
    try {
      const version = manifest.getVersion();
      if (!SchemaRegistry.hasSchema(version)) {
        this.errors.push(`manifest version ${version} not supported`);
        return false;
      }
      
      return this.validate(manifest, SchemaRegistry.getSchema(version));
    } catch (error) {
      this.errors.push(error.message);
      return false;
    }
  }

  /**
   * @param {Manifest|{}} manifest
   * @param {*} schema
   * @return {boolean}
   */
  validate(manifest, schema)
  {
    const manifestJSON = manifest instanceof Manifest ? manifest.toJSON() : manifest;
    const schemaJSON = JSON.parse(JSON.stringify(schema));
    const options = {
      propertyName: 'manifest'
    };
    
    let syntaxValidation = (new SchemaValidator()).validate(manifestJSON, schemaJSON, options);
    const errorsLength = syntaxValidation.errors.length;
    for (let i = 0; i < errorsLength; i++) {
      this.errors.push(syntaxValidation.errors[i].stack);
    }
    
    return 0 === errorsLength;
  }
  
  /**
   * @returns {string}
   */
  getErrorsAsString()
  {
    return this.errors.map(error => `ERROR: ${error}.`).join("\n");
  }
}

module.exports = SyntaxValidator;