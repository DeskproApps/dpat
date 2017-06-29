const ManifestSchema = require('../../../main/javascript/Manifest/ManifestSchema');

test('manifest schema can be serialized', done => {
  const schemaJSON = JSON.parse(JSON.stringify(ManifestSchema));
  expect(typeof schemaJSON === 'object').toBe(true);
  done();
});
