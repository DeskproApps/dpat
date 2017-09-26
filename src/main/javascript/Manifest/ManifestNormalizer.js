const toStoragePermission = function(setting) {
  return {
    name: setting.name,
    isBackendOnly: setting.isBackendOnly || false,
    permRead: "EVERYBODY",
    permWrite: "OWNER"
  };
};

class ManifestNormalizer
{
  normalizeSettings(manifest)
  {
    if (manifest.settings instanceof Array && manifest.settings.length) {
      const newManifest = JSON.parse(JSON.stringify(manifest));

      const newPermissions = newManifest.settings.map(toStoragePermission);
      const added = newPermissions.map(function(storage) {
          return storage.name;
        })
        .filter(function(name) { return !!name;})
      ;

      let retainedPermissions = [];
      if (manifest.storage && manifest.storage instanceof Array) {
        // remove storage permissions with same names as the ones we will add
        retainedPermissions = newManifest.storage.filter(function(storage) {
          return -1 === added.indexOf(storage.name);
        });
      }

      newManifest.storage = retainedPermissions.concat(newPermissions);
      return newManifest;
    }

    return manifest;
  }
}

module.exports = ManifestNormalizer;