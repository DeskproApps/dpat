const SchemaRegistry = require('../../../main/javascript/Manifest/SchemaRegistry');

test('getSchema returns an object', done => {
  const versions = ['2.1.0', '2.2.0'];
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
  const versions = ['2.1.0', '2.2.0'];
  for (let i = 0; i < versions.length; i++) {
    expect(SchemaRegistry.hasSchema(versions[i])).toBe(true);
  }
  
  done();
});

test('hasSchema returns false', done => {
  const versions = ['2.0.0', '2.1.1'];
  for (let i = 0; i < versions.length; i++) {
    expect(SchemaRegistry.hasSchema(versions[i])).toBe(false);
  }
  
  done();
});