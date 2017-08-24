const fs = require('fs');
const nodepath = require('path');

class FSSyncx {
  static pathInfo(path, ignoreExp) {
    try {
      const stat = fs.statSync(path);
      return {
        name: nodepath.basename(path),
        path,
        fullPath: nodepath.resolve(path),
        isDirectory: stat.isDirectory(),
        isFile: stat.isFile(),
        stat,
      };
    } catch (ex) {
      if (!ignoreExp) throw ex;
    }
    return null;
  }

  static stat(path, ignoreExp) {
    try {
      return fs.statSync(path);
    } catch (ex) {
      if (!ignoreExp) throw ex;
    }
    return null;
  }

  static isFile(path, ignoreExp) {
    const stat = this.stat(path, ignoreExp);
    if (stat) {
      return stat.isFile();
    }
    return false;
  }

  static isDirectory(path, ignoreExp) {
    const stat = this.stat(path, ignoreExp);
    if (stat) {
      return stat.isDirectory();
    }
    return false;
  }
}

module.exports = FSSyncx;
