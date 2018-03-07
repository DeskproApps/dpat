const convertAppName = require('../Package/convertAppName');

function readWebsiteUrl(packageJson)
{
  "use strict";
  if (packageJson.homepage) {
    return packageJson.homepage;
  }

  if (packageJson.repository && packageJson.repository.url) {
    return packageJson.repository.url;
  }

  return null;
}

function readIssueTrackerUrl(packageJson)
{
  "use strict";
  if (packageJson.bugs && packageJson.bugs.url) {
    return packageJson.bugs.url;
  }

  return null;
}

function readVCSUrl(packageJson)
{
  "use strict";
  if (packageJson.repository && packageJson.repository.url) {
    return packageJson.repository.url;
  }

  return null;
}

class BintrayDescriptorBuilder
{
  /**
   * @param {string} path
   * @returns {BintrayDescriptorBuilder}
   */
  static fromFile(path)
  {
    const data = JSON.parse(fs.readFileSync(path, 'utf8'));
    return new BintrayDescriptorBuilder(data);
  }

  /**
   * @param {object} data
   */
  constructor(data) {
    this.data = data;
  }

  setPackageJsonProps(fromFile)
  {
    const packageJSON = JSON.parse(fs.readFileSync(path, 'utf8'));

    if (typeof this.data.package !== 'object') {
      this.data.package = {}
    }
    const package = {
      name: convertAppName(package.name),
      website_url: readWebsiteUrl(packageJSON),
      issue_tracker_url: readIssueTrackerUrl(packageJSON),
      vcs_url: readVCSUrl(packageJSON)
    };
    this.data.package = Object.assign({}, this.data.package, package);

    if (typeof this.data.version !== 'object') {
      this.data.version = {}
    }

    if (packageJSON.version) {
      this.setVersion(packageJSON.version);
    }

    return this;
  }

  setVersion(version)
  {
    if (typeof this.data.version !== 'object') {
      this.data.version = {}
    }
    this.data.version.name = version;

    return this;
  }

  setReleaseDate(date)
  {
    const releaseDate = !date ? Date.now() : date;
    let releaseDateString = "";

    if (releaseDate) {
      releaseDateString = releaseDate.toISOString();
    }

    if (typeof this.data.version !== 'object') {
      this.data.version = {}
    }
    this.data.version.released = releaseDateString;
    return this;
  }

  setDistArtifactName(name)
  {
    const pattern = { includePattern : `./${name}` };
    this.data.files = [ pattern ];

    return this;
  }

  buildJS()
  {
    return JSON.parse(JSON.stringify(this.data));
  }

  buildJSON()
  {
    const js = this.buildJS();
    return JSON.stringify(js);
  }
}