'use strict';

const fs = require('fs');
const nodepath = require('path');
const isString = require('is-string');
const micromatch = require('micromatch');

const GLOB_TARGET = {
  all: 0,
  dirs: 1,
  files: 2,
};

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
      const info = {
        name: nodepath.basename(path),
        path,
        fullPath: nodepath.resolve(path),
        isDirectory: stat.isDirectory(),
        isFile: stat.isFile(),
        stat,
      };
      info.isDir = info.isDirectory;
      return info;
    });
  }

  static fileExists(path, catchExp) {
    return FSSyncx.callWrapper(catchExp, path, false, () => fs.lstatSync(path).isFile());
  }

  static dirExists(path, catchExp) {
    return FSSyncx.callWrapper(catchExp, path, false, () => fs.lstatSync(path).isDirectory());
  }

  static pathExists(path, catchExp) {
    return FSSyncx.callWrapper(catchExp, path, false, () => fs.lstatSync(path) !== null);
  }

  static readTextFile(path, catchExp) {
    return FSSyncx.callWrapper(catchExp, path, null, () => fs.readFileSync(path, 'utf8'));
  }

  static listPathsCore(
    path,
    catchExp,
    predicate,
    isRecursive,
    list,
    glob,
    globTarget) {
    const pathList = list || [];
    return FSSyncx.callWrapper(catchExp, path, null, () => {
      const paths = fs.readdirSync(path);
      if (!paths) return pathList;

      paths.forEach((value) => {
        const pathInfo = FSSyncx.pathInfo(nodepath.join(path, value), catchExp);
        if (pathInfo) {
          // --- check glob matching ---
          // is glob set in option?
          let rejectedByGlob = false;
          if (glob) {
            // do we need to check glob matching
            if (globTarget === GLOB_TARGET.all
            || (globTarget === GLOB_TARGET.files && pathInfo.isFile)
            || (globTarget === GLOB_TARGET.dirs && pathInfo.isDir)) {
              // if this glob does not match the name
              // we will set rejectedByGlob to true
              if (!FSSyncx.isGlobMatch(pathInfo.name, glob)) {
                rejectedByGlob = true;
              }
            }
          }

          // check user-specified predicate
          if (!rejectedByGlob // if glob doesn't match the name, we don't need to run predicate
            && (!predicate || predicate(pathInfo))) {
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

    return FSSyncx.listPathsCore(opt.path,
      catchExp,
      opt.filter,
      opt.recursive,
      null,
      opt.glob,
      GLOB_TARGET.all);
  }

  static listDirs(path, catchExp) {
    const opt = FSSyncx.convertPathToOpt(path);
    const predicate = i => i.isDirectory && (!opt.filter || opt.filter(i));
    return FSSyncx.listPathsCore(opt.path,
      catchExp,
      predicate,
      opt.recursive,
      null,
      opt.glob,
      GLOB_TARGET.dirs);
  }

  static listFiles(path, catchExp) {
    const opt = FSSyncx.convertPathToOpt(path);
    const predicate = i => i.isFile && (!opt.filter || opt.filter(i));
    return FSSyncx.listPathsCore(opt.path,
      catchExp,
      predicate,
      opt.recursive,
      null,
      opt.glob,
      GLOB_TARGET.files);
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

  static isGlobMatch(s, glob) {
    return micromatch.isMatch(s, glob);
  }
}

module.exports = FSSyncx;
