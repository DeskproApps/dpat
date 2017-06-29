const validManifest = require('../../resources/valid_app_manifest.json');
const SyntaxValidator = require('../../../main/javascript/Manifest/SyntaxValidator');
const ManifestSchema = require('../../../main/javascript/Manifest/ManifestSchema');


test('calling validateUsingDefaultSchema with a valid manifest returns true', done => {
  const isValid = new SyntaxValidator().validateUsingDefaultSchema(validManifest);
  expect(isValid).toBe(true);
  done();
});

test('calling validate with a valid manifest and schema returns true', done => {
  const isValid = new SyntaxValidator().validate(validManifest, Object.assign({}, ManifestSchema));
  expect(isValid).toBe(true);
  done();
});