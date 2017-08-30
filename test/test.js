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
  const RET_EXP = 'exception';
  const ERR_MSG = 'fake error';
  const FUNC_EXP = () => { throw new Error(ERR_MSG); };
  const RET_NOEXP = 'test';
  const FUN_NOEXP = () => RET_NOEXP;
  const STATE = 'state';

  it('Catch exceptions [No Exceptions]', () => {
    assert.doesNotThrow(() => t(true, RET_EXP, FUN_NOEXP, STATE));
    assert.equal(t(true, RET_EXP, FUN_NOEXP, STATE), RET_NOEXP);
  });
  it('Mute exceptions [No Exceptions]', () => {
    assert.doesNotThrow(() => t(false, RET_EXP, FUN_NOEXP, STATE));
    assert.equal(t(false, RET_EXP, FUN_NOEXP, STATE), RET_NOEXP);
  });

  it('Catch exceptions [Exceptions]', () => {
    assert.throws(() => t(true, RET_EXP, FUNC_EXP, STATE));
  });
  it('Mute exceptions [Exceptions]', () => {
    assert.doesNotThrow(() => t(false, RET_EXP, FUNC_EXP, STATE));
    assert.equal(t(false, RET_EXP, FUNC_EXP, STATE), RET_EXP);
  });
  it('Catch exceptions in callback', () => {
    const RET = 'testing_t';
    const STATE_1 = 'state1_t';
    const MSG_1 = 'msg1_t';
    const STATE_2 = 'state2_t';
    const MSG_2 = 'msg2_t';
    const COUNTER = 2;

    let counter = 0;
    t((st, ex) => {
      counter += 1;
      if (counter === 1) {
        assert.equal(st, STATE_1);
        assert.equal(ex.message, MSG_1);
      } else {
        assert.equal(st, STATE_2);
        assert.equal(ex.message, MSG_2);
      }
    }, RET, (state, exCollector) => {
      // the state variable points to the root state (STATE_1)
      exCollector(state, new Error(MSG_1));
      exCollector(STATE_2, new Error(MSG_2));
    }, STATE_1);

    assert.equal(counter, COUNTER);
  });

  it('Catch unexpected exceptions in callback', () => {
    const RET = 'testing_t';
    const STATE_1 = 'state1_t';
    const MSG_1 = 'msg1_t';
    const COUNTER = 1;

    let counter = 0;
    t((st, ex) => {
      counter += 1;
      assert.equal(st, STATE_1);
      assert.equal(ex.message, MSG_1);
    }, RET, () => {
      throw new Error(MSG_1);
    }, STATE_1);

    assert.equal(counter, COUNTER);
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
