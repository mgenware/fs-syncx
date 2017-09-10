# fs-syncx

[![Build Status](https://travis-ci.org/mgenware/fs-syncx.svg?branch=master)](http://travis-ci.org/mgenware/fs-syncx)
[![npm version](https://badge.fury.io/js/fs-syncx.svg)](https://badge.fury.io/js/fs-syncx)
[![Node.js Version](http://img.shields.io/node/v/fs-syncx.svg)](https://nodejs.org/en/)

Useful sync methods for file system.

## Installation
npm:
```
npm install --save fs-syncx
```

yarn:
```
npm install add fs-syncx
```

## Run tests
npm:
```
npm test
```

yarn:
```
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
var fss = require('/Users/yuanyuanliu/Documents/g/fs-syncx');
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
fss.listFiles({ path: 'some directory', recursive: true }, , (state, err) => {
    console.log(`state: ${state}, error: ${err}`);
});
// state: some directory, error: not accessible
// state: some directory, error: not accessible
// state: some directory, error: system error
// returns null if there are any errors
```

## APIs
### `pathInfo` 
Returns information about a given path.
```javascript
pathInfo(path, catchExp)
```

Return value:
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

### fileExists
Returns true if the given path is a file.
```javascript
fileExists(path, catchExp)
```

### dirExists
Returns true if the given path is a directory.
```javascript
dirExists(path, catchExp)
```

### listDirs, listFiles, listPaths
* `listDirs` returns sub-directories in a directory.
* `listFiles` returns sub-files in a directory.
* `listPaths` returns all sub-paths in a directory.

```javascript
listDirs(path|opt, catchExp)
listFiles(path|opt, catchExp)
listPaths(path|opt, catchExp)
```

* `path` path string.
* `opt` object, possible properties:
    * `path` path string.
    * `recursive` list children recursively, default `false`.


### readTextFile
Reads the contents of a file in UTF8 encoding.
```javascript
readTextFile(path, catchExp)
```



# License
MIT
