const fs = require('fs');

const Builder = require('../../../main/javascript/Manifest/Builder');
const Manifest = require('../../../main/javascript/Manifest/Manifest');
const ManifestSchema = require('../../../main/javascript/Manifest/ManifestSchema');

test('can build from src', done =>
{
  const manifests = ManifestSchema.getVersions()
      .map(version => {
        return {
          name: 'manifest.json',
          path: fs.realpathSync(`${__dirname}/../../resources/valid-v${version}-manifest.manifest.json`)
        };
      })
      .map((src) => new Builder().setPropsFromSource(src).build())
  ;

  const packageJsonManifests = ManifestSchema.getVersions()
    .map(version => {
      return {
        name: 'package.json',
        path: fs.realpathSync(`${__dirname}/../../resources/valid-v${version}-manifest.package.json`)
      };
    })
    .map((src) => new Builder().setPropsFromSource(src).build())
  ;

  manifests.forEach((manifest) => expect(manifest instanceof Manifest).toEqual(true));
  packageJsonManifests.forEach((manifest) => expect(manifest instanceof Manifest).toEqual(true));

  done();
});
