import { describe } from 'vitest';
import { runValidMoveTestSuite } from './util';
import antData from './data/ant.test.json';

Object.entries(antData).forEach(([description, suite]) => {
  describe.concurrent(description, () => runValidMoveTestSuite(suite));
});
