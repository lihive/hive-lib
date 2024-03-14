import { GameBoard, HexCoordinate } from './types';
import { hexCoordinateKey } from './hex';
import { eachSlideDirection, getTileAt, moveTile } from './board';
import { ExpectedTileAtCoordinateError } from './error';

export function validAntMoves(
  board: GameBoard,
  coordinate: HexCoordinate
): HexCoordinate[] {
  // A clone of the board that we're free to mutate
  // const brd = cloneBoard(board);

  // An array of valid move coordinates
  const valid: HexCoordinate[] = [];

  // A set of coordinates the ant has visited, starting with its current location
  const visited = new Set<string>([hexCoordinateKey(coordinate)]);

  // A function to walk along the perimite of the hive
  const walk = (board: GameBoard, coordinate: HexCoordinate) => {
    eachSlideDirection(board, coordinate, (neighbor) => {
      console.log('slide dir', coordinate);
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
