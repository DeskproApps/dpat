const toStoragePermission = function(setting) {
  return {
    name: setting.name,
    isBackendOnly: setting.isBackendOnly || false,
    permRead: "EVERYBODY",
    permWrite: "OWNER"
  };
};

/**
 *
 * @param {object} settingsPerm
 * @param {object} storagePerm
 * @returns {{name: String isBackendOnly: boolean, permRead: String, permWrite: String}}
 */
function merge(settingsPerm, storagePerm)
{
  "use strict";

  const isBackendOnly = !settingsPerm.isBackendOnly && storagePerm.isBackendOnly ? true : settingsPerm.isBackendOnly;
  const permRead = storagePerm.permRead ? storagePerm.permRead : settingsPerm.permRead;
  const permWrite = storagePerm.permWrite ? storagePerm.permWrite : settingsPerm.permWrite;

  return {
    name: settingsPerm.name,
    isBackendOnly: isBackendOnly,
    permRead: permRead,
    permWrite: permWrite
  }
}

class ManifestNormalizer
{
  normalizeSettings(manifest)
  {
    if (manifest.settings instanceof Array && manifest.settings.length) {
      const newManifest = JSON.parse(JSON.stringify(manifest));

      const newPermissions = newManifest.settings.map(toStoragePermission).filter(function(name) { return !!name;});
      if (! (manifest.storage instanceof Array) || manifest.storage.length === 0) {
        newManifest.storage = newPermissions;
        return newManifest;
      }

      const settingsNames = newPermissions.map(function(perm) { return perm.name; });
      const storageNames = newManifest.storage.map(function(perm) { return perm.name; });

      const settings = newPermissions.reduce(function(accumulator, perm) {
        if (-1 === storageNames.indexOf(perm.name)) { // new name
          accumulator.add.push(perm);
        } else {
          accumulator.merge[perm.name] = perm;
        }
        return accumulator;
      }, { add: [], merge: {} });

      const storage = newManifest.storage.reduce(function(accumulator, perm) {
        if (-1 === settingsNames.indexOf(perm.name)) { // not a setting
          accumulator.add.push(perm);
        } else {
          accumulator.merge[perm.name] = perm;
        }
        return accumulator;
      }, { add: [], merge: {} });


      const merged = Object.keys(settings.merge).map(function (k) {
        return merge(settings.merge[k], storage.merge[k]);
      });

      newManifest.storage = [].concat(settings.add).concat(storage.add).concat(merged);
      return newManifest;
    }

    return manifest;
  }
}

module.exports = ManifestNormalizer;