import assert from 'assert';
import * as nodepath from 'path';
import fss from '../lib/main';

const PATH_NOT_EXIST = 'PATH_NOT_EXIST.__ABC__';
const FILE_A_REL = 'test/data/text.txt';
const FILE_A_ABS = nodepath.join(__dirname, 'data/text.txt');
const FILE_A_NAME = 'text.txt';
const DIR_A_REL = 'test/data/';
const DIR_A_ABS = nodepath.join(__dirname, 'data');

function assertPathsEqual(objs, strs) {
  assert.deepEqual(objs.map(i => i.name).sort(), strs.sort());
}

describe('CallWrapper', () => {
  const t = fss.callWrapper;
  const RET_EXP = 'exception';
  const ERR_MSG = 'fake error';
  const FUNC_EXP = () => { throw new Error(ERR_MSG); };
  const RET_NOEXP = 'test';
  const FUN_NOEXP = () => RET_NOEXP;
  const STATE = 'state';

  it('Catch exceptions [No Exceptions]', () => {
    assert.doesNotThrow(() => t(true, STATE, RET_EXP, FUN_NOEXP));
    assert.equal(t(true, STATE, RET_EXP, FUN_NOEXP), RET_NOEXP);
  });
  it('Mute exceptions [No Exceptions]', () => {
    assert.doesNotThrow(() => t(false, STATE, RET_EXP, FUN_NOEXP));
    assert.equal(t(false, STATE, RET_EXP, FUN_NOEXP), RET_NOEXP);
  });

  it('Catch exceptions [Exceptions]', () => {
    assert.throws(() => t(true, STATE, RET_EXP, FUNC_EXP));
  });
  it('Mute exceptions [Exceptions]', () => {
    assert.doesNotThrow(() => t(false, STATE, RET_EXP, FUNC_EXP));
    assert.equal(t(false, STATE, RET_EXP, FUNC_EXP), RET_EXP);
  });
  it('Catch exceptions in callback', () => {
    const RET = 'testing_t';
    const STATE_1 = 'state1_t';
    const MSG_1 = 'msg1_t';
    const STATE_2 = 'state2_t';
    const MSG_2 = 'msg2_t';
    const COUNTER = 2;

    let counter = 0;
    t((st: any, ex: Error) => { // catchExp argument
      counter += 1;
      if (counter === 1) {
        assert.equal(st, STATE_1);
        assert.equal(ex.message, MSG_1);
      } else {
        assert.equal(st, STATE_2);
        assert.equal(ex.message, MSG_2);
      }
    },
    STATE_1,
    RET,
    (state: any, exCollector: any) => {
      // the state variable points to the root state (STATE_1)
      exCollector(state, new Error(MSG_1));
      exCollector(STATE_2, new Error(MSG_2));
      return RET;
    });

    assert.equal(counter, COUNTER);
  });

  it('Catch unexpected exceptions in callback', () => {
    const RET = 'testing_t';
    const STATE_1 = 'state1_t';
    const MSG_1 = 'msg1_t';
    const COUNTER = 1;

    let counter = 0;
    t((st: any, ex: Error) => {
      counter += 1;
      assert.equal(st, STATE_1);
      assert.equal(ex.message, MSG_1);
    },
    STATE_1,
    RET,
    () => {
      throw new Error(MSG_1);
    });

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
  it('Catch exceptions in callback', () => {
    let called = false;
    assert.doesNotThrow(() => {
      t(PATH_NOT_EXIST, (state: any, err: Error) => {
        called = true;
        assert.equal(state, PATH_NOT_EXIST);
        assert(err);
      });
    });
    assert.equal(called, true);
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
  it('isDir', () => {
    assert.equal(t(DIR_A_REL).isDir, true);
  });
});


describe('fss.dirExists', () => {
  const t = fss.dirExists;
  it('Catch exceptions', () => {
    assert.throws(() => t(PATH_NOT_EXIST, true));
  });
  it('Mute exceptions', () => {
    assert.doesNotThrow(() => t(PATH_NOT_EXIST));
  });
  it('Catch exceptions in callback', () => {
    let called = false;
    assert.doesNotThrow(() => {
      t(PATH_NOT_EXIST, (state: any, err: Error) => {
        called = true;
        assert.equal(state, PATH_NOT_EXIST);
        assert(err);
      });
    });
    assert.equal(called, true);
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
  it('Catch exceptions in callback', () => {
    let called = false;
    assert.doesNotThrow(() => {
      t(PATH_NOT_EXIST, (state: any, err: Error) => {
        called = true;
        assert.equal(state, PATH_NOT_EXIST);
        assert(err);
      });
    });
    assert.equal(called, true);
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
  it('Catch exceptions in callback', () => {
    let called = false;
    assert.doesNotThrow(() => {
      t(PATH_NOT_EXIST, (state: any, err: Error) => {
        called = true;
        assert.equal(state, PATH_NOT_EXIST);
        assert(err);
      });
    });
    assert.equal(called, true);
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
  it('Catch exceptions in callback', () => {
    let called = false;
    assert.doesNotThrow(() => {
      t(PATH_NOT_EXIST, (state: any, err: Error) => {
        called = true;
        assert.equal(state, PATH_NOT_EXIST);
        assert(err);
      });
    });
    assert.equal(called, true);
  });
  it('Read a file', () => {
    assert.equal(t(FILE_A_REL), 'sample text\n');
  });
});

describe('fss.listPaths', () => {
  const t = fss.listPaths;
  it('List paths [Relative Path]', () => {
    assertPathsEqual(t(DIR_A_REL), ['json.json', 'text.txt', 'dir1', 'dir2']);
  });
  it('List paths [Absolute Path]', () => {
    assertPathsEqual(t(DIR_A_ABS), ['json.json', 'text.txt', 'dir1', 'dir2']);
  });
  it('List paths [Absolute Path] [Glob]', () => {
    assertPathsEqual(t({ path: DIR_A_ABS, glob: 'dir*' }), ['dir1', 'dir2']);
  });
  it('List paths [Recursive] [Absolute Path]', () => {
    assertPathsEqual(t({ path: DIR_A_ABS, recursive: true }), ['json.json', 'text.txt', 'dir1', 'dir2', 'dir3', 'text.txt', 'text.txt', 'text.txt']);
  });
  it('List paths [Recursive] [Absolute Path] [Glob]', () => {
    assertPathsEqual(t({ path: DIR_A_ABS, recursive: true, glob: '*.txt' }), ['text.txt', 'text.txt', 'text.txt', 'text.txt']);
  });
});

describe('fss.listDirs', () => {
  const t = fss.listDirs;
  it('List dirs [Relative Path]', () => {
    assertPathsEqual(t(DIR_A_REL), ['dir1', 'dir2']);
  });
  it('List dirs [Absolute Path]', () => {
    assertPathsEqual(t(DIR_A_ABS), ['dir1', 'dir2']);
  });
  it('List dirs [Absolute Path] [Glob]', () => {
    assertPathsEqual(t({ path: DIR_A_ABS, glob: '*2' }), ['dir2']);
  });
  it('List dirs [Recursive] [Absolute Path]', () => {
    assertPathsEqual(t({ path: DIR_A_ABS, recursive: true }), ['dir1', 'dir2', 'dir3']);
  });
  it('List dirs [Recursive] [Absolute Path] [Glob]', () => {
    assertPathsEqual(t({ path: DIR_A_ABS, recursive: true, glob: '*2' }), ['dir2']);
  });
});

describe('fss.listFiles', () => {
  const t = fss.listFiles;
  it('List files [Relative Path]', () => {
    assertPathsEqual(t(DIR_A_REL), ['json.json', 'text.txt']);
  });
  it('List files [Absolute Path]', () => {
    assertPathsEqual(t(DIR_A_ABS), ['json.json', 'text.txt']);
  });
  it('List files [Absolute Path] [Glob]', () => {
    assertPathsEqual(t({ path: DIR_A_ABS, glob: '*.json' }), ['json.json']);
  });
  it('List files [Recursive] [Absolute Path]', () => {
    assertPathsEqual(t({ path: DIR_A_ABS, recursive: true }), ['json.json', 'text.txt', 'text.txt', 'text.txt', 'text.txt']);
  });
  it('List files [Recursive] [Absolute Path] [Glob]', () => {
    assertPathsEqual(t({ path: DIR_A_ABS, recursive: true, glob: '*.txt' }), ['text.txt', 'text.txt', 'text.txt', 'text.txt']);
  });
});
