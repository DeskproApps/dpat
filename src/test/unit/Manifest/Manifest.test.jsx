const Manifest = require('../../../main/javascript/Manifest/Manifest');

test('manifest is correctly serialized to json', done => {

  const props = { propOne: 'one', propTwo: 'two' };
  const manifest = new Manifest(props);
  const manifestProps = JSON.parse(JSON.stringify(manifest));

  expect(manifestProps).toEqual(props);
  done();
});
