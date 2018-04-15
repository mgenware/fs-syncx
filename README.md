# fs-syncx

[![Build Status](https://travis-ci.org/mgenware/fs-syncx.svg?branch=master)](http://travis-ci.org/mgenware/fs-syncx)
[![npm version](https://badge.fury.io/js/fs-syncx.svg)](https://badge.fury.io/js/fs-syncx)
[![Node.js Version](http://img.shields.io/node/v/fs-syncx.svg)](https://nodejs.org/en/)

Useful sync methods for file system.

> For a async version of this package, see [m-fs](https://github.com/mgenware/m-fs).

## Installation
```bash
# npm
npm install --save fs-syncx
# yarn
yarn add fs-syncx
```

JavaScript:
```javascript
const fss = require('fs-syncx');
```

TypeScript:
```typescript
import fss from 'fs-syncx';
```

## Run tests
```bash
# npm
npm test
# yarn
yarn test
```


# API

## the `catchExp` argument

It is crucial to first understand how fs-syncx API handles errors. Almost every API provided by fs-syncx contains an argument named `catchExp`.

Possible values:
* [Default] `undefined` or `false`: ignores all errors. Returns an empty value `null` or `false`.
* `true`: let any error throw. This is the same behavior like original Node.js fs sync APIs.
* `(state, error) => {}` callback: reports all errors in a callback.

Examples:
```javascript
const fss = require('fs-syncx');
const FILE = '/__file_does_not_exist__';

// catchExp is false, no error is thrown, returns false if errors occur
fss.fileExists(FILE);
// false

// catchExp is a callback, use callback to get errors
fss.fileExists(FILE, (state, err) => {
    console.log(`state: ${state}, error: ${err}`);
});
// state: /__file_does_not_exist__, error: Error: ENOENT: no such file or directory, lstat '/__file_does_not_exist__'
// false

// catchExp is true, just throw errors
fss.fileExists(FILE, true);
// *** Error thrown ***
/* Error: ENOENT: no such file or directory, lstat '/__file_does_not_exist__'
    at Object.fs.lstatSync (fs.js:947:11)
    ...
*/
```

Note that using a callback as `catchExp` is especially useful when you want to get multiple errors, for example:
```javascript
/* list all files recursively in a directory */

// catchExp is true, if accessing a directory throws an error, the function failed with that error
fss.listFiles({ path: 'some directory', recursive: true }, true);
// *** Error thrown ***
/* Some directory is not accessible... */

// if catchExp is a callback, all errors will be reported and the function won't stop executing
fss.listFiles({ path: 'some directory', recursive: true }, (state, err) => {
    console.log(`state: ${state}, error: ${err}`);
});
// state: some directory, error: not accessible
// state: some directory, error: not accessible
// state: some directory, error: system error
// returns an array of FileInfos
```

## APIs
### `pathInfo`
Returns an `PathInfo` object containing information about a given path.
```javascript
pathInfo(path, catchExp): PathInfo
```

`PathInfo` object:
```javascript
{
    name: 'abc', // the name of the path
    path: './abc', // the original path object you passed in
    fullPath: '/users/mgen/documents/abc', // the absolute resolved path
    isDir: true, // true if the path is a directory
    isFile: false, // true if the path is a file,
    stat: ..., // raw object returned from fs.lstatSync
}
```

### `fileExists`
Returns true if the given path is a file.
```javascript
fileExists(path, catchExp): bool
```

### `dirExists`
Returns true if the given path is a directory.
```javascript
dirExists(path, catchExp): bool
```

### `listDirs`, `listFiles`, `listPaths`
* `listDirs` returns an array of `PathInfo` representing sub-directories in a directory.
* `listFiles` returns an array of `PathInfo` representing sub-files in a directory.
* `listPaths` returns an array of `PathInfo` representing all sub-paths in a directory.

```javascript
listDirs(path|opt, catchExp): [PathInfo]
listFiles(path|opt, catchExp): [PathInfo]
listPaths(path|opt, catchExp): [PathInfo]
```

* `path` path string.
* `opt` object, possible properties:
    * `path` path string.
    * `recursive` list children recursively, default `false`.

**Note that these functions return an array of `PathInfo` objects**, you can use JavaScript `map` function to convert them to an array of strings.
```javascript
const fss = require('fs-syncx');
const DIR = 'node_modules';

// PathInfo.name: relative path
fss.listDirs(DIR).map(d => d.name);
// [ 'fs-syncx', 'is-string' ]

// PathInfo.fullPath: absolute path
fss.listDirs(DIR).map(d => d.fullPath);
/* [ '/Users/me/proj/node_modules/fs-syncx',
     '/Users/me/proj/node_modules/is-string' ] */
```

### `readTextFile`
Reads the contents of a file in UTF8 encoding.
```javascript
readTextFile(path, catchExp): string
```



# License
MIT
