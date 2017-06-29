class Manifest
{
  /**
   * @param {ManifestProps} props
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

  getSourceType() { return this.source.type; }

  getSourceFile() { return this.source.file; }

  toJSON() { return JSON.stringify(this.props); }

  toJS() { return JSON.parse(JSON.stringify(this.props)); }
}

module.exports = Manifest;