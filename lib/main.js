const fs = require('fs');
const nodepath = require('path');

class FSSyncx {
  static pathInfo(path) {
    const stat = fs.statSync(path);
    return {
      name: nodepath.basename(path),
      path,
      fullPath: nodepath.resolve(path),
      isDirectory: stat.isDirectory(),
      isFile: stat.isFile(),
      stat,
    };
  }

  static isFile(path) {
    return fs.statSync(path).isFile();
  }

  static isDirectory(path) {
    return fs.statSync(path).isDirectory();
  }

  static readTextFile(path) {
    return fs.readFileSync(path, 'utf8');
  }

  static readJSONFile(path) {
    return JSON.parse(FSSyncx.readTextFile(path));
  }
}

module.exports = FSSyncx;
