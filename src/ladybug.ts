import { GameBoard, HexCoordinate } from './types';
import { moveBreaksHive } from './move';
import {
  eachClimbDirection,
  eachDropDirection,
  eachSlideDirection,
  moveTileProduce
} from './board';
import { hexCoordinateKey, includesHex } from './hex';

export function validLadybugMoves(
  board: GameBoard,
  coordinate: HexCoordinate
): HexCoordinate[] {
  if (moveBreaksHive(board, coordinate)) return [];

  const valid: HexCoordinate[] = [];
  const visited = new Set<String>();

  const walk = (board: GameBoard, path: HexCoordinate[]) => {
    const current = path[path.length - 1];

    // the ladybug must climb on the first movement
    if (path.length === 1) {
      eachClimbDirection(board, current, (neighbor) => {
        walk(moveTileProduce(board, current, neighbor), [...path, neighbor]);
      });
    }
    // the second move must be on top of the hive
    if (path.length === 2) {
      eachSlideDirection(board, current, (neighbor) => {
        if (!includesHex(path, neighbor)) {
          walk(moveTileProduce(board, current, neighbor), [...path, neighbor]);
        }
      });
      eachClimbDirection(board, current, (neighbor) => {
        if (!includesHex(path, neighbor)) {
          walk(moveTileProduce(board, current, neighbor), [...path, neighbor]);
        }
      });
      eachDropDirection(board, current, (neighbor, neighborStack) => {
        if (neighborStack.length > 0 && !includesHex(path, neighbor)) {
          walk(moveTileProduce(board, current, neighbor), [...path, neighbor]);
        }
      });
    }
    // the third move must drop down off of the hive
    if (path.length === 3) {
      eachDropDirection(board, current, (neighbor, neighborStack) => {
        if (
          neighborStack.length === 0 &&
          !includesHex(path, neighbor) &&
          !visited.has(hexCoordinateKey(neighbor))
        ) {
          valid.push(neighbor);
          visited.add(hexCoordinateKey(neighbor));
        }
      });
    }
  };

  walk(board, [coordinate]);
  return valid;
}
