import { GameConfig, HexOrientation } from './types';

export const SQRT3 = Math.sqrt(3);
export const M_PI = Math.PI;

export const BASE_GAME: GameConfig = {
  tileset: {
    A: 3,
    B: 2,
    G: 3,
    S: 2,
    Q: 1
  }
};

export const POINTY_TOP: HexOrientation = {
  id: 'pointy-top',
  f0: SQRT3,
  f1: SQRT3 / 2,
  f2: 0,
  f3: 3 / 2,
  b0: SQRT3 / 3,
  b1: -1 / 3,
  b2: 0,
  b3: 2 / 3,
  startAngle: 30
};

export const FLAT_TOP: HexOrientation = {
  id: 'flat-top',
  f0: 3 / 2,
  f1: 0,
  f2: SQRT3 / 2,
  f3: SQRT3,
  b0: 2 / 3,
  b1: 0,
  b2: -1 / 3,
  b3: SQRT3 / 3,
  startAngle: 0
};
