const Manifest = require('../../../main/javascript/Manifest/Manifest');
const PackageBuilder = require('../../../main/javascript/Package/PackageBuilder');


test('scoped app name is transformed to expected artifact name', done => {
  const manifest = new Manifest({
    name: "@deskpro/apps-sdk-react"
  });

  const builder = new PackageBuilder();
  const actualName = builder.resolveArtifactFileName(manifest);

  expect(actualName).toBe("deskpro-apps-sdk-react.zip");
  done();
});

test('non scoped name is transformed to expected artifact name', done => {
  const manifest = new Manifest({
    name: "apps-sdk-react"
  });

  const builder = new PackageBuilder();
  const actualName = builder.resolveArtifactFileName(manifest);

  expect(actualName).toBe("apps-sdk-react.zip");
  done();
});

test('does not resolve artifact name when app name contains path separators', done => {
  const manifest = new Manifest({
    name: "apps/sdk-react"
  });

  const builder = new PackageBuilder();
  const actualName = builder.resolveArtifactFileName(manifest);

  expect(actualName).toBeNull();
  done();
});