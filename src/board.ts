import { GameBoard, StackFn, TileId } from './types';
import { forOwn } from 'lodash';

/**
 * Iterate over all coordinates on the game board that contain tiles. The
 * iteratee is invoked with a hex coordinate and the stack located at that
 * coordinate. Iteratee functions may exit iteration early by returning false.
 *
 * @param board The game board to iterate over.
 * @param iteratee The function invoked per iteration.
 * @return false if iteration ended early, true otherwise.
 */
export function eachStack(board: GameBoard, iteratee: StackFn): boolean {
  let iter: any = true;
  forOwn(board, (rs, q) => {
    forOwn(rs, (stack, r) => {
      iter = iteratee({ q: +q, r: +r }, stack);
      return iter !== false;
    });
    return iter !== false;
  });
  return iter !== false;
}

export function tilesOnBoard(board: GameBoard): TileId[] {
  const tiles: TileId[] = [];
  eachStack(board, (_, ids) => tiles.push(...ids));
  return tiles;
}
