const ManifestNormalizer = require('../../../main/javascript/Manifest/ManifestNormalizer');

test('settings are converted to storage items when no storage is declared', done => {

  const manifest = {
    settings: [
      {
        "name": "rsaPrivateKey",
        "defaultValue": "",
        "title": "Your private key",
        "required": true,
        "type": "textarea"
      },
      {
        "name": "rsaPublicKey",
        "defaultValue": "",
        "title": "Your public key",
        "required": true,
        "type": "textarea"
      }
    ]
  };

  const expectedManifest = {
    settings: [
      {
        "name": "rsaPrivateKey",
        "defaultValue": "",
        "title": "Your private key",
        "required": true,
        "type": "textarea"
      },
      {
        "name": "rsaPublicKey",
        "defaultValue": "",
        "title": "Your public key",
        "required": true,
        "type": "textarea"
      }
    ],
    storage: [
      {
        "name": "rsaPrivateKey",
        "isBackendOnly": false,
        "permRead": "EVERYBODY",
        "permWrite": "OWNER"
      },
      {
        "name": "rsaPublicKey",
        "isBackendOnly": false,
        "permRead": "EVERYBODY",
        "permWrite": "OWNER"
      }
    ]
  };

  const normalizer = new ManifestNormalizer();
  const actualManifest = normalizer.normalizeSettings(manifest);

  expect(expectedManifest).toEqual(actualManifest);
  done();
});

test('settings are converted to storage items', done => {

  const manifest = {
    settings: [
      {
        "name": "rsaPrivateKey",
        "defaultValue": "",
        "title": "Your private key",
        "required": true,
        "type": "textarea"
      },
      {
        "name": "rsaPublicKey",
        "defaultValue": "",
        "title": "Your public key",
        "required": true,
        "type": "textarea"
      }
    ],
    storage: [
      {
        "name": "oauth:jira",
        "isBackendOnly": true,
        "permRead": "EVERYBODY",
        "permWrite": "OWNER"
      }
    ]
  };

  const expectedManifest = {
    settings: [
      {
        "name": "rsaPrivateKey",
        "defaultValue": "",
        "title": "Your private key",
        "required": true,
        "type": "textarea"
      },
      {
        "name": "rsaPublicKey",
        "defaultValue": "",
        "title": "Your public key",
        "required": true,
        "type": "textarea"
      }
    ],
    storage: [
      {
        "name": "rsaPrivateKey",
        "isBackendOnly": false,
        "permRead": "EVERYBODY",
        "permWrite": "OWNER"
      },
      {
        "name": "rsaPublicKey",
        "isBackendOnly": false,
        "permRead": "EVERYBODY",
        "permWrite": "OWNER"
      },
      {
        "name": "oauth:jira",
        "isBackendOnly": true,
        "permRead": "EVERYBODY",
        "permWrite": "OWNER"
      },
    ]
  };

  const normalizer = new ManifestNormalizer();
  const actualManifest = normalizer.normalizeSettings(manifest);

  expect(expectedManifest).toEqual(actualManifest);
  done();
});

test('settings are merged with storage items', done => {

  const manifest = {
    settings: [
      {
        "name": "rsaPrivateKey",
        "defaultValue": "",
        "title": "Your private key",
        "required": true,
        "type": "textarea"
      },
      {
        "name": "rsaPublicKey",
        "defaultValue": "",
        "title": "Your public key",
        "required": true,
        "type": "textarea"
      },
      {
        "name": "apiKey",
        "defaultValue": "",
        "title": "Your public key",
        "required": true,
        "type": "textarea"
      }
    ],
    storage: [
      {
        "name": "oauth:jira",
        "isBackendOnly": true,
        "permRead": "EVERYBODY",
        "permWrite": "OWNER"
      },
      {
        "name": "rsaPublicKey",
        "isBackendOnly": false,
        "permRead": "OWNER",
        "permWrite": "OWNER"
      },
      {
        "name": "rsaPrivateKey",
        "isBackendOnly": true,
        "permRead": "OWNER",
        "permWrite": "OWNER"
      }
    ]
  };

  const expectedManifest = {
    settings: [
      {
        "name": "rsaPrivateKey",
        "defaultValue": "",
        "title": "Your private key",
        "required": true,
        "type": "textarea"
      },
      {
        "name": "rsaPublicKey",
        "defaultValue": "",
        "title": "Your public key",
        "required": true,
        "type": "textarea"
      },
      {
        "name": "apiKey",
        "defaultValue": "",
        "title": "Your public key",
        "required": true,
        "type": "textarea"
      }
    ],
    storage: [
      {
        "name": "apiKey",
        "isBackendOnly": false,
        "permRead": "EVERYBODY",
        "permWrite": "OWNER"
      },
      {
        "name": "oauth:jira",
        "isBackendOnly": true,
        "permRead": "EVERYBODY",
        "permWrite": "OWNER"
      },
      {
        "name": "rsaPrivateKey",
        "isBackendOnly": true,
        "permRead": "OWNER",
        "permWrite": "OWNER"
      },
      {
        "name": "rsaPublicKey",
        "isBackendOnly": false,
        "permRead": "OWNER",
        "permWrite": "OWNER"
      }
    ]
  };

  const normalizer = new ManifestNormalizer();
  const actualManifest = normalizer.normalizeSettings(manifest);

  expect(expectedManifest).toEqual(actualManifest);
  done();
});
