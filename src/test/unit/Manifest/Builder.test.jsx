const fs = require('fs');

const Builder = require('../../../main/javascript/Manifest/Builder');
const Manifest = require('../../../main/javascript/Manifest/Manifest');
const SchemaRegistry = require('../../../main/javascript/Manifest/SchemaRegistry');


test('build returns expected value when setPropsFromSource is called', function (done) {
  const sources = ['manifest.json', 'package.json'];

  const manifests = [];
  for (const source of sources) {
    for (const version of SchemaRegistry.getVersions()) {
      manifests.push(
        new Builder().setPropsFromSource({
          name: source,
          path: fs.realpathSync(`${__dirname}/../../resources/valid-v${version}-manifest.${source}`)
        }).build()
      );
    }
  }

  manifests.forEach((manifest) => expect(manifest instanceof Manifest).toEqual(true));
  done();
});

test('settings are normalized', function (done) {
  "use strict";

  const manifest = {
    deskpro: {
      "settings": [
        {
          "type": "text", "name": "one", "title": "title 1", "defaultValue": "", "required": true, "isBackendOnly": true,
          "validator": { "type": "regex", "pattern": "^.+" }
        },
        {
          "type": "textarea", "name": "two", "title": "title 2", "defaultValue": "", "required": true,
          "validator": { "type": "regex", "pattern": "^.+" },
        },
        {
          "type": "choice", "name": "three", "title": "title 3", "defaultValue": "bar", "required": true,
          "multi": false, "choices": [ { "title": "Bar", "value": "bar" } ]
        },
        { "type": "boolean", "name": "four", "title": "title 4", "defaultValue": false, "required": true }
      ]
    }
  };

  const expected = JSON.parse(JSON.stringify(manifest.deskpro));
  expected['storage'] = [
    { "name": "one", "isBackendOnly": true, "permRead": "EVERYBODY", "permWrite": "OWNER"},
    { "name": "two", "isBackendOnly": false, "permRead": "EVERYBODY", "permWrite": "OWNER"},
    { "name": "three", "isBackendOnly": false, "permRead": "EVERYBODY", "permWrite": "OWNER"},
    { "name": "four", "isBackendOnly": false, "permRead": "EVERYBODY", "permWrite": "OWNER"},
  ];

  const actual = new Builder().setPropsFromPackageJson(JSON.stringify(manifest)).buildJSON();
  expect(actual).toBe(JSON.stringify(expected));
  done();
});
