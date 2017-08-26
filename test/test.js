'use strict';

const assert = require('assert');
const nodepath = require('path');
const fss = require('../lib/main');

const PATH_NOT_EXIST = 'PATH_NOT_EXIST.__ABC__';
const FILE_A_REL = 'test/data/text.txt';
const FILE_A_ABS = nodepath.join(__dirname, 'data/text.txt');
const FILE_A_NAME = 'text.txt';
const DIR_A_REL = 'test/data/';

describe('CallWrapper', () => {
  const t = fss.callWrapper;
  const retExp = 'exception';
  const errMessage = 'fake error';
  const funcExp = () => { throw new Error(errMessage); };
  const retNoExp = 'test';
  const funcNoExp = () => retNoExp;
  const state = 'state';

  it('Catch exceptions [No Exceptions]', () => {
    assert.doesNotThrow(() => t(true, retExp, funcNoExp, state));
    assert.equal(t(true, retExp, funcNoExp, state), retNoExp);
  });
  it('Mute exceptions [No Exceptions]', () => {
    assert.doesNotThrow(() => t(false, retExp, funcNoExp, state));
    assert.equal(t(false, retExp, funcNoExp, state), retNoExp);
  });

  it('Catch exceptions [Exceptions]', () => {
    assert.throws(() => t(true, retExp, funcExp, state));
  });
  it('Mute exceptions [Exceptions]', () => {
    assert.doesNotThrow(() => t(false, retExp, funcExp, state));
    assert.equal(t(false, retExp, funcExp, state), retExp);
  });
  it('Catch exceptions in callback [Exceptions]', () => {
    t((st, ex) => {
      assert.equal(st, state);
      assert.equal(ex.message, errMessage);
    }, retExp, funcExp, state);
  });
});

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
