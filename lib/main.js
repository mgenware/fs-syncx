'use strict';

const fs = require('fs');
const nodepath = require('path');

class FSSyncx {
  static callWrapper(catchExp, exceptionValue, func, state) {
    if (catchExp === true) {
      return func();
    }
    try {
      return func(state, catchExp);
    } catch (ex) {
      if (typeof catchExp === 'function') {
        catchExp(state, ex);
      }
      return exceptionValue;
    }
  }

  static pathInfo(path, catchExp) {
    return FSSyncx.callWrapper(catchExp, null, () => {
      const stat = fs.lstatSync(path);
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
    return FSSyncx.callWrapper(catchExp, false, () => fs.lstatSync(path).isFile());
  }

  static directoryExists(path, catchExp) {
    return FSSyncx.callWrapper(catchExp, false, () => fs.lstatSync(path).isDirectory());
  }

  static pathExists(path, catchExp) {
    return FSSyncx.callWrapper(catchExp, false, () => fs.lstatSync(path) !== null);
  }

  static readTextFile(path, catchExp) {
    return FSSyncx.callWrapper(catchExp, null, () => fs.readFileSync(path, 'utf8'));
  }

  static listChildren(path, catchExp, errorCb) {
    try {
      const children = fs.readdirSync(path);

    } catch (ex) {
      if (catchExp) {
        if (errorCb) errorCb(path, ex);
        else throw ex;
      }
      return null;
    }
    return FSSyncx.callWrapper(catchExp, null, () => {
      const children = fs.readdirSync(path);
    })
  }
}

module.exports = FSSyncx;
