import { describe } from 'vitest';
import { runValidMoveTestSuite } from './util';
import antData from './data/ant.test.json';
import beetleData from './data/beetle.test.json';

const datasets = [antData, beetleData];

datasets.forEach((data) => {
  Object.entries(data).forEach(([description, suite]) => {
    describe.concurrent(description, () => runValidMoveTestSuite(suite));
  });
});
