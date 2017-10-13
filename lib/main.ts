import * as fs from 'fs';
import * as nodepath from 'path';
const isString = require('is-string') as any;
const micromatch = require('micromatch') as any;
import PathInfo from './pathInfo';

enum GlobTarget {
  All = 1,
  Dirs,
  Files,
}

export function callWrapper<T>(
  catchExp: any,
  state: any,
  exceptionValue: T,
  func: (state: any, catchExp: ((state: any, error: Error) => void) | null) => T): T {

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

export function pathInfo(path: string, catchExp: any = null): PathInfo|null {
  return callWrapper<PathInfo|null>(catchExp, path, null, () => {
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

export function fileExists(path: string, catchExp: any = null): boolean {
  return callWrapper<boolean>(catchExp, path, false, () => fs.lstatSync(path).isFile());
}

export function dirExists(path: string, catchExp: any = null): boolean {
  return callWrapper<boolean>(catchExp, path, false, () => fs.lstatSync(path).isDirectory());
}

export function pathExists(path: string, catchExp: any = null): boolean {
  return callWrapper<boolean>(catchExp, path, false, () => fs.lstatSync(path) !== null);
}

export function readTextFile(path: string, catchExp: any = null): string|null {
  return callWrapper<string|null>(catchExp, path, null, () => fs.readFileSync(path, 'utf8'));
}

function listPathsCore(
  path: string,
  catchExp: any,
  predicate: (pathInfo: PathInfo) => boolean,
  isRecursive: boolean,
  list: PathInfo[],
  glob: string,
  globTarget: GlobTarget): PathInfo[] {
  const pathList = list || [];
  return callWrapper(catchExp, path, [], () => {
    const paths = fs.readdirSync(path) as string[];
    if (!paths) {
      return pathList;
    }

    paths.forEach((value) => {
      const info = pathInfo(nodepath.join(path, value), catchExp);
      if (info) {
        // --- check glob matching ---
        // is glob set in option?
        let rejectedByGlob = false;
        if (glob) {
          // do we need to check glob matching
          if (globTarget === GlobTarget.All
          || (globTarget === GlobTarget.Files && info.isFile)
          || (globTarget === GlobTarget.Dirs && info.isDir)) {
            // if this glob does not match the name
            // we will set rejectedByGlob to true
            if (!isGlobMatch(info.name, glob)) {
              rejectedByGlob = true;
            }
          }
        }

        // check user-specified predicate
        if (!rejectedByGlob // if glob doesn't match the name, we don't need to run predicate
          && (!predicate || predicate(info))) {
          pathList.push(info);
        }
        if (isRecursive && info.isDir) {
          listPathsCore(info.fullPath,
            catchExp,
            predicate,
            isRecursive,
            isRecursive ? pathList : [],
            glob,
            globTarget);
        }
      }
    });
    return pathList;
  });
}

export function listPaths(path: any, catchExp: any = null): PathInfo[] {
  const opt = convertPathToOpt(path);

  return listPathsCore(opt.path,
    catchExp,
    opt.filter,
    opt.recursive,
    [],
    opt.glob,
    GlobTarget.All);
}

export function listDirs(path: any, catchExp: any = null): PathInfo[] {
  const opt = convertPathToOpt(path);
  const predicate = (i: PathInfo) => i.isDir && (!opt.filter || opt.filter(i));
  return listPathsCore(opt.path,
    catchExp,
    predicate,
    opt.recursive,
    [],
    opt.glob,
    GlobTarget.Dirs);
}

export function listFiles(path: any, catchExp: any = null): PathInfo[] {
  const opt = convertPathToOpt(path);
  const predicate = (i: PathInfo) => i.isFile && (!opt.filter || opt.filter(i));
  return listPathsCore(opt.path,
    catchExp,
    predicate,
    opt.recursive,
    [],
    opt.glob,
    GlobTarget.Files);
}

/* internal functions */
function convertPathToOpt(path: any) {
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

function isGlobMatch(s: string, glob: string) {
  return micromatch.isMatch(s, glob);
}
