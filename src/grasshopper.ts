import { GameBoard, HexCoordinate } from './types';
import { moveBreaksHive } from './move';
import { eachDirection, isSpaceOccupied } from './board';
import { hexesEqual, relativeHexCoordinate } from './hex';

export function validGrasshopperMoves(
  board: GameBoard,
  coordinate: HexCoordinate
): HexCoordinate[] {
  if (moveBreaksHive(board, coordinate)) return [];

  const valid: HexCoordinate[] = [];

  eachDirection((direction) => {
    const neighbor = relativeHexCoordinate(coordinate, direction);
    let current = neighbor;
    while (isSpaceOccupied(board, current)) {
      current = relativeHexCoordinate(current, direction);
    }
    if (!hexesEqual(current, neighbor)) {
      valid.push(current);
    }
  });

  return valid;
}
