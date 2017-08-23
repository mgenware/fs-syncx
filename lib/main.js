'use strict';
const fs = require('fs');
const nodepath = require('path');

class FSSyncx {
  static pathInfo(path, ignoreExp) {
    try {
      const stat = fs.statSync(path);
      return {
        name: nodepath.basename(path),
        path: path,
        fullPath: nodepath.resolve(path),
        isDirectory: stat.isDirectory(),
        stat: stat,
      };
    } catch (ex) {
      if (!ignoreExp) throw ex;
    }
    return null;
  }
}

module.exports = FSSyncx;
