const fs = require('fs');
const nodepath = require('path');

class FSSyncx {
  static callWrapper(catchExp, func) {
    if (catchExp) {
      return func();
    }
    try {
      return func();
    } catch (ex) {
      return undefined;
    }
  }

  static pathInfo(path, catchExp) {
    return FSSyncx.callWrapper(catchExp, () => {
      const stat = fs.statSync(path);
      return {
        name: nodepath.basename(path),
        path,
        fullPath: nodepath.resolve(path),
        isDirectory: stat.isDirectory(),
        isFile: stat.isFile(),
        stat,
      };
    });
  }

  static isFile(path, catchExp) {
    return FSSyncx.callWrapper(catchExp, () => fs.statSync(path).isFile());
  }

  static isDirectory(path, catchExp) {
    return FSSyncx.callWrapper(catchExp, () => fs.statSync(path).isDirectory());
  }

  static readTextFile(path, catchExp) {
    return FSSyncx.callWrapper(catchExp, () => fs.readFileSync(path, 'utf8'));
  }
}

module.exports = FSSyncx;
