const path = require('path');

module.exports = function (appName, extension) {
  "use strict";

  // normalized scoped named
  const scopedNameRegex = /^@([^\/]+)[\/]([^\/]+)/;
  const artifactName =  appName.replace(scopedNameRegex, function (match, vendor, name) {
    return [vendor, name].join('-');
  });

  // if after normalization we have separators
  if (-1 < artifactName.indexOf(path.sep)) {
    return null;
  }

  const filename = [artifactName, !extension ? 'zip' : extension].join('.');
  return filename.toLowerCase();
};