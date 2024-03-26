import { describe } from 'vitest';
import { runValidMoveTestSuite } from './util';
import data from './data/ant.test.json';

Object.entries(data).forEach(([description, suite]) => {
  describe.concurrent(description, () => runValidMoveTestSuite(suite));
});
