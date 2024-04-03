import { GameBoard, HexCoordinate } from './types';
import { moveBreaksHive } from './move';
import { eachDirection, isCoordinateOccupied } from './board';
import { hexesEqual, relativeHexCoordinate } from './hex';

/**
 * Get all valid moves for the tile at the given coordinate acting as a
 * grasshopper.
 *
 * @remarks
 * The grasshopper rules state that a grasshopper jumps from its space over any
 * number of pieces (but at least one) to the next unoccupied space along a
 * straight row of joined pieces.
 *
 * @param board - A game board.
 * @param coordinate - The location of the tile acting as an ant.
 * @returns An array of hex coordinates.
 *
 * @public
 */
export function validGrasshopperMoves(
  board: GameBoard,
  coordinate: HexCoordinate
): HexCoordinate[] {
  if (moveBreaksHive(board, coordinate)) return [];

  const valid: HexCoordinate[] = [];

  eachDirection((direction) => {
    const neighbor = relativeHexCoordinate(coordinate, direction);
    let current = neighbor;
    while (isCoordinateOccupied(board, current)) {
      current = relativeHexCoordinate(current, direction);
    }
    if (!hexesEqual(current, neighbor)) {
      valid.push(current);
    }
  });

  return valid;
}
