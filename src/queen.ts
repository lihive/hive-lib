import { GameBoard, HexCoordinate } from './types';
import { eachSlideDirection } from './board';
import { moveBreaksHive } from './move';

/**
 * Get all valid moves for the tile at the given coordinate acting as a queen.
 *
 * @remarks
 * The queen rules state that a queen bee can move only one space per turn.
 *
 * @param board - A game board.
 * @param coordinate - The location of the tile acting as a queen.
 * @returns An array of hex coordinates.
 *
 * @beta
 */
export function validQueenMoves(
  board: GameBoard,
  coordinate: HexCoordinate
): HexCoordinate[] {
  if (moveBreaksHive(board, coordinate)) return [];
  const valid: HexCoordinate[] = [];
  eachSlideDirection(board, coordinate, (neighbor) => {
    valid.push(neighbor);
  });
  return valid;
}
