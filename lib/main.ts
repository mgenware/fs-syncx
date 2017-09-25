import * as fs from 'fs';
import * as nodepath from 'path';
const isString = require('is-string') as any;
const micromatch = require('micromatch') as any;
import PathInfo from './pathInfo';

enum GlobTarget {
  All = 1,
  Dirs,
  Files
}

export default class FSSyncx {
  static callWrapper<T>(catchExp: any, 
    state: any,
    exceptionValue: T,
    func: (state: any, catchExp: (state: any, error: Error) => void) => T): T {

    if (catchExp === true) {
      return func(null, null);
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

  static pathInfo(path: string, catchExp: any = null): PathInfo {
    return FSSyncx.callWrapper<PathInfo>(catchExp, path, null, () => {
      const stat = fs.lstatSync(path);
      const info = new PathInfo(nodepath.basename(path),
        path,
        nodepath.resolve(path),
        stat.isDirectory(),
        stat.isFile(),
        stat);
      return info;
    });
  }

  static fileExists(path: string, catchExp: any = null): boolean {
    return FSSyncx.callWrapper<boolean>(catchExp, path, false, () => fs.lstatSync(path).isFile());
  }

  static dirExists(path: string, catchExp: any = null): boolean {
    return FSSyncx.callWrapper<boolean>(catchExp, path, false, () => fs.lstatSync(path).isDirectory());
  }

  static pathExists(path: string, catchExp: any = null): boolean {
    return FSSyncx.callWrapper<boolean>(catchExp, path, false, () => fs.lstatSync(path) !== null);
  }

  static readTextFile(path: string, catchExp: any = null): string {
    return FSSyncx.callWrapper<string>(catchExp, path, null, () => fs.readFileSync(path, 'utf8'));
  }

  static listPathsCore(
    path: string,
    catchExp: any,
    predicate: (pathInfo: PathInfo) => boolean,
    isRecursive: boolean,
    list: PathInfo[],
    glob: string,
    globTarget: GlobTarget): PathInfo[] {
    const pathList = list || [];
    return FSSyncx.callWrapper(catchExp, path, [], () => {
      const paths = fs.readdirSync(path) as string[];
      if (!paths) return pathList;

      paths.forEach((value) => {
        const pathInfo = FSSyncx.pathInfo(nodepath.join(path, value), catchExp);
        if (pathInfo) {
          // --- check glob matching ---
          // is glob set in option?
          let rejectedByGlob = false;
          if (glob) {
            // do we need to check glob matching
            if (globTarget === GlobTarget.All
            || (globTarget === GlobTarget.Files && pathInfo.isFile)
            || (globTarget === GlobTarget.Dirs && pathInfo.isDir)) {
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
          if (isRecursive && pathInfo.isDir) {
            FSSyncx.listPathsCore(pathInfo.fullPath,
              catchExp,
              predicate,
              isRecursive,
              isRecursive ? pathList : null,
              glob,
              globTarget);
          }
        }
      });
      return pathList;
    });
  }

  static listPaths(path: any, catchExp: any = null): PathInfo[] {
    const opt = FSSyncx.convertPathToOpt(path);

    return FSSyncx.listPathsCore(opt.path,
      catchExp,
      opt.filter,
      opt.recursive,
      null,
      opt.glob,
      GlobTarget.All);
  }

  static listDirs(path: any, catchExp: any = null): PathInfo[] {
    const opt = FSSyncx.convertPathToOpt(path);
    const predicate = (i: PathInfo) => i.isDir && (!opt.filter || opt.filter(i));
    return FSSyncx.listPathsCore(opt.path,
      catchExp,
      predicate,
      opt.recursive,
      null,
      opt.glob,
      GlobTarget.Dirs);
  }

  static listFiles(path: any, catchExp: any = null): PathInfo[] {
    const opt = FSSyncx.convertPathToOpt(path);
    const predicate = (i: PathInfo) => i.isFile && (!opt.filter || opt.filter(i));
    return FSSyncx.listPathsCore(opt.path,
      catchExp,
      predicate,
      opt.recursive,
      null,
      opt.glob,
      GlobTarget.Files);
  }

  /* internal functions */
  static convertPathToOpt(path: any) {
    if (!path) {
      throw new Error('path cannot be empty');
    }
    let opt: any = null;
    if (isString(path)) {
      opt = {};
      opt.path = path;
    } else {
      opt = path;
    }
    return opt;
  }

  static isGlobMatch(s: string, glob: string) {
    return micromatch.isMatch(s, glob);
  }
}
