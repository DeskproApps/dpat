class Manifest
{
  /**
   * @param {Object} props
   * @param source
   */
  constructor(props, source)
  {
    this.props = props;
    this.source = {
      type: typeof source === 'object' ? source.type : "", // source can be 'package.json', 'manifest.json', ''
      file: typeof source === 'object' ? source.file : "", // path to file
    };
  }

  /**
   * @returns {string}
   */
  getName() { return this.props.name; }

  /**
   * @returns {string}
   * @throws {Error} When the manifest is missing the "version" prop
   */
  getVersion() { return this.props.version; }

  getSourceType() { return this.source.type; }

  getSourceFile() { return this.source.file; }

  // see https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify
  toJSON() { return JSON.parse(JSON.stringify(this.props)); }
}

module.exports = Manifest;