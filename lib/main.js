'use strict';

const fs = require('fs');
const nodepath = require('path');
const isString = require('is-string');

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

  static listPathsCore(path, catchExp, predicate, list) {
    const pathList = list || [];
    return FSSyncx.callWrapper(catchExp, null, () => {
      const paths = fs.readdirSync(path);
      if (!paths) return pathList;

      paths.forEach((value) => {
        const pathInfo = FSSyncx.pathInfo(nodepath.join(path, value), catchExp);
        if (pathInfo && (!predicate || predicate(pathInfo))) {
          pathList.push(pathInfo);
          if (list && pathInfo.isDirectory) {
            FSSyncx.listPathsCore(pathInfo.fullPath, catchExp, predicate, pathList);
          }
        }
      });
      return pathList;
    }, path);
  }

  static listPaths(path, catchExp) {
    let opt = null;
    if (isString(path)) {
      opt = {};
      opt.path = path;
    } else {
      opt = path;
    }

    return FSSyncx.listPathsCore(opt.path, catchExp, opt.filter, opt.recursive ? [] : null);
  }

  static listDirs(path, catchExp) {
    return FSSyncx.listPathsCore(path, catchExp, (i => i.isDirectory));
  }

  static listFiles(path, catchExp) {
    return FSSyncx.listPathsCore(path, catchExp, (i => i.isFile));
  }
}

module.exports = FSSyncx;
