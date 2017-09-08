const Manifest = require('../../../main/javascript/Manifest/Manifest');
const SyntaxValidator = require('../../../main/javascript/Manifest/SyntaxValidator');
const SchemaRegistry = require('../../../main/javascript/Manifest/SchemaRegistry');
const validManifest = new Manifest(require('../../resources/valid-app-manifest-v2.1.0.manifest.json'));

test('calling validateManifest with a valid manifest returns true', done => {
  const isValid = new SyntaxValidator().validateManifest(validManifest);
  expect(isValid).toBe(true);
  done();
});

test('calling validate with a valid manifest and schema returns true', done => {
  const isValid = new SyntaxValidator().validate(validManifest, SchemaRegistry.getSchema('2.1.0'));
  expect(isValid).toBe(true);
  done();
});

test('calling validate with a invalid manifest and schema returns false', done => {
  const isValid = new SyntaxValidator().validate(validManifest, SchemaRegistry.getSchema('2.2.0'));
  expect(isValid).toBe(false);
  done();
});