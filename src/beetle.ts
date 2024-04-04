import { GameBoard, HexCoordinate } from './types';
import {
  eachClimbDirection,
  eachDropDirection,
  eachSlideDirection
} from './board';
import { moveBreaksHive } from './move';

/**
 * Get all valid moves for the tile at the given coordinate acting as a beetle.
 *
 * @remarks
 * The beetle rules state that the beetle can move only one space per turn but
 * can also move on top of the hive.
 *
 * @beta
 * @param board - nA game board.
 * @param coordinate - The location of the tile acting as a beetle.
 * @returns An array of hex coordinates.
 */
export function validBeetleMoves(
  board: GameBoard,
  coordinate: HexCoordinate
): HexCoordinate[] {
  if (moveBreaksHive(board, coordinate)) return [];

  const valid: HexCoordinate[] = [];
  eachClimbDirection(board, coordinate, (neighbor) => {
    valid.push(neighbor);
  });
  eachSlideDirection(board, coordinate, (neighbor) => {
    valid.push(neighbor);
  });
  eachDropDirection(board, coordinate, (neighbor) => {
    valid.push(neighbor);
  });
  return valid;
}
