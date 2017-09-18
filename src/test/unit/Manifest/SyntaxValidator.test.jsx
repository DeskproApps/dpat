const fs = require('fs');

const Manifest = require('../../../main/javascript/Manifest/Manifest');
const SyntaxValidator = require('../../../main/javascript/Manifest/SyntaxValidator');
const SchemaRegistry = require('../../../main/javascript/Manifest/SchemaRegistry');

function readManifest(version)
{
  "use strict";
  const manifestPath = fs.realpathSync(`${__dirname}/../../resources/valid-v${version}-manifest.manifest.json`);
  const raw = fs.readFileSync(manifestPath);
  return new Manifest(JSON.parse(raw));
}

test('test validateUsingVersionSchema and validate return true for valid supported manifest versions', done => {
  const manifests = SchemaRegistry.getVersions().map(readManifest);
  expect(0 < manifests.length).toBe(true);

  const versions = SchemaRegistry.getVersions().reverse();

  for (const manifest of manifests) {
    let isValid = false;

    isValid = new SyntaxValidator().validateManifest(manifest);
    expect(isValid).toBe(true);

    const version = versions.pop();
    const schema = SchemaRegistry.getSchema(version);
    isValid = new SyntaxValidator().validate(manifest, schema);
    expect(isValid).toBe(true);
  }
  done();
});


test('calling validateManifest with a valid manifest returns true', done => {
  const manifest = readManifest('2.1.0');
  const isValid = new SyntaxValidator().validateManifest(manifest);
  expect(isValid).toBe(true);
  done();
});

test('calling validate with a valid manifest and schema returns true', done => {
  const manifest = readManifest('2.1.0');
  const isValid = new SyntaxValidator().validate(manifest, SchemaRegistry.getSchema('2.1.0'));
  expect(isValid).toBe(true);
  done();
});

test('calling validate with a invalid manifest and schema returns false', done => {
  const manifest = readManifest('2.1.0');
  const isValid = new SyntaxValidator().validate(manifest, SchemaRegistry.getSchema('2.2.0'));
  expect(isValid).toBe(false);
  done();
});

test('test validate returns false when called with an empty manifest', done => {
  const schemas = SchemaRegistry.getVersions().map(version => SchemaRegistry.getSchema(version));

  for (const schema of schemas) {
    const isValid = new SyntaxValidator().validate({}, schema);
    expect(isValid).toBe(false);
  }

  done();
});

test('test getErrorsAsString returns a list of errors', done => {
  const manifest = readManifest('2.1.0');
  const validator = new SyntaxValidator();

  validator.validate(manifest, SchemaRegistry.getSchema('2.2.0'));

  const errors = validator.getErrorsAsString();
  expect(0 < errors.length).toBe(true);

  for (const error of errors) {
    expect(error).toBeTruthy();
    expect(typeof error).toBe('string');
  }

  done();
});