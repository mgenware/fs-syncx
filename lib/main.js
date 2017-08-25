const fs = require('fs');
const nodepath = require('path');

class FSSyncx {
  static callWrapper(catchExp, exceptionValue, func) {
    if (catchExp) {
      return func();
    }
    try {
      return func();
    } catch (ex) {
      return exceptionValue;
    }
  }

  static pathInfo(path, catchExp) {
    return FSSyncx.callWrapper(catchExp, null, () => {
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

  static fileExists(path, catchExp) {
    return FSSyncx.callWrapper(catchExp, false, () => fs.statSync(path).isFile());
  }

  static directoryExists(path, catchExp) {
    return FSSyncx.callWrapper(catchExp, false, () => fs.statSync(path).isDirectory());
  }

  static pathExists(path, catchExp) {
    return FSSyncx.callWrapper(catchExp, false, () => fs.statSync(path) !== null);
  }

  static readTextFile(path, catchExp) {
    return FSSyncx.callWrapper(catchExp, null, () => fs.readFileSync(path, 'utf8'));
  }
}

module.exports = FSSyncx;
