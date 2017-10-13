const main = require('../..');
import * as assert from 'assert';
import * as fs from 'fs';
import * as path from 'path';

describe('require this module', () => {
  it('Check a function', () => {
    assert.equal(typeof main.listDirs, 'function');
  });

  it('Check type definition file', () => {
    assert.equal(fs.statSync('./dist/lib/main.d.ts').isFile(), true);
  });
});
