'use strict';

const assert = require('assert');
const nodepath = require('path');
const fss = require('../lib/main');

const PATH_NOT_EXIST = 'PATH_NOT_EXIST.__ABC__';
const FILE_A_REL = 'test/data/text.txt';
const FILE_A_ABS = nodepath.join(__dirname, 'data/text.txt');
const FILE_A_NAME = 'text.txt';
const DIR_A_REL = 'test/data/';

describe('fss.pathInfo', () => {
  const t = fss.pathInfo;

  it('Catch exceptions', () => {
    assert.throws(() => t(PATH_NOT_EXIST, true));
  });
  it('Mute exceptions', () => {
    assert.doesNotThrow(() => t(PATH_NOT_EXIST));
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


describe('fss.directoryExists', () => {
  const t = fss.directoryExists;
  it('Catch exceptions', () => {
    assert.throws(() => t(PATH_NOT_EXIST, true));
  });
  it('Mute exceptions', () => {
    assert.doesNotThrow(() => t(PATH_NOT_EXIST));
  });
  it('True', () => {
    assert.equal(t(DIR_A_REL), true);
  });
  it('False', () => {
    assert.equal(t(FILE_A_ABS), false);
  });
});

describe('fss.fileExists', () => {
  const t = fss.fileExists;
  it('Catch exceptions', () => {
    assert.throws(() => t(PATH_NOT_EXIST, true));
  });
  it('Mute exceptions', () => {
    assert.doesNotThrow(() => t(PATH_NOT_EXIST));
  });
  it('True', () => {
    assert.equal(t(FILE_A_REL), true);
  });
  it('False', () => {
    assert.equal(t(DIR_A_REL), false);
  });
});

describe('fss.pathExists', () => {
  const t = fss.pathExists;
  it('Catch exceptions', () => {
    assert.throws(() => t(PATH_NOT_EXIST, true));
  });
  it('Mute exceptions', () => {
    assert.doesNotThrow(() => t(PATH_NOT_EXIST));
  });
  it('True [Directory]', () => {
    assert.equal(t(DIR_A_REL), true);
  });
  it('True [File]', () => {
    assert.equal(t(FILE_A_ABS), true);
  });
  it('False', () => {
    assert.equal(t(PATH_NOT_EXIST), false);
  });
});

describe('fss.readTextFile', () => {
  const t = fss.readTextFile;
  it('Catch exceptions', () => {
    assert.throws(() => t(PATH_NOT_EXIST, true));
  });
  it('Mute exceptions', () => {
    assert.doesNotThrow(() => t(PATH_NOT_EXIST));
  });
  it('Read a file', () => {
    assert.equal(t(FILE_A_REL), 'sample text\n');
  });
});
