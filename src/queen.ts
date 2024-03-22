import { GameBoard, HexCoordinate } from './types';
import { eachSlideDirection } from './board';
import { moveBreaksHive } from './move';

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
