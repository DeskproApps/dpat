const SchemaRegistry = require('../../../main/javascript/Manifest/SchemaRegistry');

test('getVersions returns a non empty list', done => {
  const versions = SchemaRegistry.getVersions();
  expect(0 < versions.length).toBe(true);
  done();
});

test('getSchema returns an object', done => {
  const versions = SchemaRegistry.getVersions();
  for (let i = 0; i < versions.length; i++) {
    const schemaJSON = SchemaRegistry.getSchema(versions[i]);
    expect(typeof schemaJSON === 'object').toBe(true);
  }

  done();
});

test('getSchema throws an error', done => {
  expect(() => {
    SchemaRegistry.getSchema('2.0.0');
  }).toThrow();
  
  done();
});

test('hasSchema returns true', done => {
  const versions = SchemaRegistry.getVersions();
  for (let i = 0; i < versions.length; i++) {
    expect(SchemaRegistry.hasSchema(versions[i])).toBe(true);
  }
  
  done();
});

test('hasSchema returns false', done => {
  const versions = ['2.0.0', '1.0.0'];
  for (let i = 0; i < versions.length; i++) {
    expect(SchemaRegistry.hasSchema(versions[i])).toBe(false);
  }
  
  done();
});