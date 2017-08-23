'use strict';
const assert = require('assert');
const nodepath = require('path');
const fss = require('../lib/main');

const PATH_NOT_EXIST = 'PATH_NOT_EXIST.__ABC__';
const FILE_A_REL = 'test/data/text.txt';
const FILE_A_ABS = nodepath.join(__dirname, 'data/text.txt');
const FILE_A_NAME = 'text.txt';


describe('fss.pathInfo', () => {
  const t = fss.pathInfo;

  it('Ignore exception', () => {
    assert.doesNotThrow(() => t(PATH_NOT_EXIST, true));
  });
  it('Exception', () => {
    assert.throws(() => t(PATH_NOT_EXIST, false));
  });
  it('Exception [Default]', () => {
    assert.throws(() => t(PATH_NOT_EXIST, false));
  });

  it('name [Relative path]', () => {
    assert(t(FILE_A_REL).name == FILE_A_NAME);
  });
  it('name [Absolute path]', () => {
    assert(t(FILE_A_ABS).name == FILE_A_NAME);
  });
});
