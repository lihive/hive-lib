import { GameBoard, HexCoordinate } from './types';
import {
  eachClimbDirection,
  eachDropDirection,
  eachSlideDirection
} from './board';

/**
 * Get all coordinates that are valid moves for the tile at the given coordinate
 * acting as a beetle. The beetle rules state that the beetle can move only
 * one space per turn but can also move on top of the hive.
 *
 * @param board nA game board.
 * @param coordinate The location of the tile acting as a beetle.
 * @return An array of hex coordinates.
 */
export function validBeetleMoves(
  board: GameBoard,
  coordinate: HexCoordinate
): HexCoordinate[] {
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
