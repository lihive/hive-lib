import { GameConfig, HexOrientation } from './types';

/**
 * @internal
 */
export const _SQRT3 = Math.sqrt(3);

/**
 * @internal
 */
export const _M_PI = Math.PI;

/**
 * The base game configuration.
 *
 * @beta
 */
export const BASE_GAME: GameConfig = {
  tileset: {
    A: 3,
    B: 2,
    G: 3,
    S: 2,
    Q: 1
  }
};

/**
 * The base game configuration with the tournament opening rule.
 *
 * @beta
 */
export const BASE_GAME_TOURNAMENT: GameConfig = {
  tournament: true,
  tileset: {
    A: 3,
    B: 2,
    G: 3,
    S: 2,
    Q: 1
  }
};

/**
 * The pointy-top hex orientation.
 *
 * @beta
 */
export const POINTY_TOP: HexOrientation = {
  id: 'pointy-top',
  f0: _SQRT3,
  f1: _SQRT3 / 2,
  f2: 0,
  f3: 3 / 2,
  b0: _SQRT3 / 3,
  b1: -1 / 3,
  b2: 0,
  b3: 2 / 3,
  startAngle: 30
};

/**
 * The flat-top hex orientation.
 *
 * @beta
 */
export const FLAT_TOP: HexOrientation = {
  id: 'flat-top',
  f0: 3 / 2,
  f1: 0,
  f2: _SQRT3 / 2,
  f3: _SQRT3,
  b0: 2 / 3,
  b1: 0,
  b2: -1 / 3,
  b3: _SQRT3 / 3,
  startAngle: 0
};
