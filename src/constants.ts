import { TileId } from './types';

/**
 * The complete list of black tiles.
 */
export const BLACK_TILES: TileId[] = [
  'bA1',
  'bA2',
  'bA3',
  'bB1',
  'bB2',
  'bG1',
  'bG2',
  'bG3',
  'bS1',
  'bS2',
  'bQ',
  'bL',
  'bM',
  'bP'
];

/**
 * The complete list of white tiles.
 */
export const WHITE_TILES: TileId[] = [
  'wA1',
  'wA2',
  'wA3',
  'wB1',
  'wB2',
  'wG1',
  'wG2',
  'wG3',
  'wS1',
  'wS2',
  'wQ',
  'wL',
  'wM',
  'wP'
];

/**
 * The complete list of tiles.
 */
export const ALL_TILES: TileId[] = [...BLACK_TILES, ...WHITE_TILES];
