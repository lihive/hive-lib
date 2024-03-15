import { GameBoard, HexCoordinate } from './types';
import { hexCoordinateKey } from './hex';
import { eachSlideDirection, getTileAt, moveTile } from './board';
import { ExpectedTileAtCoordinateError } from './error';

/**
 * Get all coordinates that are valid moves for the tile at the given coordinate
 * acting as an ant. The ant rules state that an ant can move to any other
 * position around the hive as long as it can slide to that location.
 *
 * @param board A game board.
 * @param coordinate The location of the tile acting as an ant.
 * @return An array of hex coordinates.
 */
export function validAntMoves(
  board: GameBoard,
  coordinate: HexCoordinate
): HexCoordinate[] {
  const valid: HexCoordinate[] = [];
  const visited = new Set<string>([hexCoordinateKey(coordinate)]);

  const walk = (board: GameBoard, coordinate: HexCoordinate) => {
    eachSlideDirection(board, coordinate, (neighbor) => {
      const key = hexCoordinateKey(neighbor);
      if (!visited.has(key)) {
        const tile = getTileAt(board, coordinate);
        if (!tile) throw new ExpectedTileAtCoordinateError(coordinate);
        visited.add(key);
        valid.push(neighbor);
        walk(moveTile(board, coordinate, neighbor), neighbor);
      }
    });
  };

  walk(board, coordinate);

  return valid;
}
