import { GameBoard, HexCoordinate } from './types';
import { hexCoordinateKey } from './hex';
import { _moveTileProduce, eachSlideDirection, getTileAt } from './board';
import { NoTileAtCoordinateError } from './error';
import { moveBreaksHive } from './move';

/**
 * Get all valid moves for the tile at the given coordinate acting as an ant.
 *
 * @remarks
 * The ant rules state that an ant can move to any other position around the
 * hive as long as it can slide to that location.
 *
 * @param board - A game board.
 * @param coordinate - The location of the tile acting as an ant.
 * @returns An array of hex coordinates.
 *
 * @beta
 */
export function validAntMoves(
  board: GameBoard,
  coordinate: HexCoordinate
): HexCoordinate[] {
  if (moveBreaksHive(board, coordinate)) return [];

  const valid: HexCoordinate[] = [];
  const visited = new Set<string>([hexCoordinateKey(coordinate)]);

  const walk = (board: GameBoard, coordinate: HexCoordinate) => {
    eachSlideDirection(board, coordinate, (neighbor) => {
      const key = hexCoordinateKey(neighbor);
      if (!visited.has(key)) {
        const tile = getTileAt(board, coordinate);
        if (!tile) throw new NoTileAtCoordinateError(coordinate);
        visited.add(key);
        valid.push(neighbor);
        walk(_moveTileProduce(board, coordinate, neighbor), neighbor);
      }
    });
  };

  walk(board, coordinate);

  return valid;
}
