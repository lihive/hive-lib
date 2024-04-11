import { describe } from 'vitest';
import { runValidMoveTestSuite } from './util';
import antData from './data/ant.test.json';
import beetleData from './data/beetle.test.json';
import grasshopperData from './data/grasshopper.test.json';
import ladybugData from './data/ladybug.test.json';
import mosquitoData from './data/mosquito.test.json';
import pillbugData from './data/pillbug.test.json';
import queenData from './data/queen.test.json';
import spiderData from './data/spider.test.json';

const datasets = [
  antData,
  beetleData,
  grasshopperData,
  ladybugData,
  mosquitoData,
  pillbugData,
  queenData,
  spiderData
];

datasets.forEach((data) => {
  Object.entries(data).forEach(([description, suite]) => {
    describe.concurrent(description, () => runValidMoveTestSuite(suite));
  });
});
