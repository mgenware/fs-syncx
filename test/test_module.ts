const fss = require('../..');
import * as assert from 'assert';

describe('require this module', () => {
  it('No exception thrown', () => {
    assert.equal(typeof fss.listDirs, 'function');
  });
});
