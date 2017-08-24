const assert = require('assert');
const nodepath = require('path');
const fss = require('../lib/main');

const PATH_NOT_EXIST = 'PATH_NOT_EXIST.__ABC__';
const FILE_A_REL = 'test/data/text.txt';
const FILE_A_ABS = nodepath.join(__dirname, 'data/text.txt');
const FILE_A_NAME = 'text.txt';
const FILE_B_REL = 'test/data/json.json';
const DIR_A_REL = 'test/data/';

describe('fss.pathInfo', () => {
  const t = fss.pathInfo;

  it('Exception', () => {
    assert.throws(() => t(PATH_NOT_EXIST, false));
  });
  it('Exception [Default]', () => {
    assert.throws(() => t(PATH_NOT_EXIST, false));
  });

  it('name [Relative path]', () => {
    assert.equal(t(FILE_A_REL).name, FILE_A_NAME);
  });
  it('name [Absolute path]', () => {
    assert.equal(t(FILE_A_ABS).name, FILE_A_NAME);
  });

  it('fullPath [Relative path]', () => {
    assert.equal(t(FILE_A_REL).fullPath, FILE_A_ABS);
  });
  it('fullPath [Absolute path]', () => {
    assert.equal(t(FILE_A_ABS).fullPath, FILE_A_ABS);
  });

  it('isFile', () => {
    assert.equal(t(FILE_A_REL).isFile, true);
  });
  it('isDirectory', () => {
    assert.equal(t(DIR_A_REL).isDirectory, true);
  });
});


describe('fss.isDirectory', () => {
  const t = fss.isDirectory;
  it('Exception', () => {
    assert.throws(() => t(PATH_NOT_EXIST, false));
  });
  it('True', () => {
    assert.equal(t(DIR_A_REL), true);
  });
  it('False', () => {
    assert.equal(t(FILE_A_ABS), false);
  });
});

describe('fss.isFile', () => {
  const t = fss.isFile;
  it('Exception', () => {
    assert.throws(() => t(PATH_NOT_EXIST, false));
  });
  it('True', () => {
    assert.equal(t(FILE_A_REL), true);
  });
  it('False', () => {
    assert.equal(t(DIR_A_REL), false);
  });
});

describe('fss.readTextFile', () => {
  const t = fss.readTextFile;
  it('Default', () => {
    assert.equal(t(FILE_A_REL), 'sample text\n');
  });
});

describe('fss.readJSONFile', () => {
  const t = fss.readJSONFile;
  it('Default', () => {
    assert.deepEqual(t(FILE_B_REL), { a: 123, b: 'test' });
  });
});

