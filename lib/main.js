'use strict';

const fs = require('fs');
const nodepath = require('path');
const isString = require('is-string');

class FSSyncx {
  static callWrapper(catchExp, state, exceptionValue, func) {
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
    return FSSyncx.callWrapper(catchExp, path, null, () => {
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
    return FSSyncx.callWrapper(catchExp, path, false, () => fs.lstatSync(path).isFile());
  }

  static directoryExists(path, catchExp) {
    return FSSyncx.callWrapper(catchExp, path, false, () => fs.lstatSync(path).isDirectory());
  }

  static pathExists(path, catchExp) {
    return FSSyncx.callWrapper(catchExp, path, false, () => fs.lstatSync(path) !== null);
  }

  static readTextFile(path, catchExp) {
    return FSSyncx.callWrapper(catchExp, path, null, () => fs.readFileSync(path, 'utf8'));
  }

  static listPathsCore(path, catchExp, predicate, isRecursive, list) {
    const pathList = list || [];
    return FSSyncx.callWrapper(catchExp, path, null, () => {
      const paths = fs.readdirSync(path);
      if (!paths) return pathList;

      paths.forEach((value) => {
        const pathInfo = FSSyncx.pathInfo(nodepath.join(path, value), catchExp);
        if (pathInfo) {
          if (!predicate || predicate(pathInfo)) {
            pathList.push(pathInfo);
          }
          if (isRecursive && pathInfo.isDirectory) {
            FSSyncx.listPathsCore(pathInfo.fullPath,
              catchExp,
              predicate,
              isRecursive,
              isRecursive ? pathList : null);
          }
        }
      });
      return pathList;
    }, path);
  }

  static listPaths(path, catchExp) {
    const opt = FSSyncx.convertPathToOpt(path);

    return FSSyncx.listPathsCore(opt.path, catchExp, opt.filter, opt.recursive);
  }

  static listDirs(path, catchExp) {
    const opt = FSSyncx.convertPathToOpt(path);
    const predicate = i => i.isDirectory && (!opt.filter || opt.filter(i));
    return FSSyncx.listPathsCore(opt.path, catchExp, predicate, opt.recursive);
  }

  static listFiles(path, catchExp) {
    const opt = FSSyncx.convertPathToOpt(path);
    const predicate = i => i.isFile && (!opt.filter || opt.filter(i));
    return FSSyncx.listPathsCore(opt.path, catchExp, predicate, opt.recursive);
  }

  /* internal functions */
  static convertPathToOpt(path) {
    if (!path) {
      throw new Error('path cannot be empty');
    }
    let opt = null;
    if (isString(path)) {
      opt = {};
      opt.path = path;
    } else {
      opt = path;
    }
    return opt;
  }
}

module.exports = FSSyncx;
