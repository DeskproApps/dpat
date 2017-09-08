const Schemas = require('./Schemas');

class SchemaRegistry {
  /**
   * Returns the JSON schema for the given version
   * 
   * @param {string} version
   * @returns {*}
   * @throws Error When a schema does not exist for the given version.
   */
  static getSchema(version)
  {
    if (!SchemaRegistry.hasSchema(version)) {
      throw new Error(`Schema for version ${version} not found.`);
    }
    
    return JSON.parse(JSON.stringify(Schemas[version]));
  }
  
  /**
   * Returns a boolean indicating whether a schema exists for the given version
   * 
   * @param {string} version
   * @returns {boolean}
   */
  static hasSchema(version)
  {
    return (Schemas[version] !== undefined);
  }
}

module.exports = SchemaRegistry;