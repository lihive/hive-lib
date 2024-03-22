import { GameBoard, HexCoordinate } from './types';
import { eachSlideDirection, moveTileProduce } from './board';
import { hexCoordinateKey, includesHex } from './hex';
import { moveBreaksHive } from './move';

export function validSpiderMoves(
  board: GameBoard,
  coordinate: HexCoordinate
): HexCoordinate[] {
  if (moveBreaksHive(board, coordinate)) return [];
  const valid: HexCoordinate[] = [];
  const visited = new Set<string>();

  const walk = (board: GameBoard, path: HexCoordinate[]) => {
    const current = path[path.length - 1];
    eachSlideDirection(board, current, (neighbor) => {
      if (!includesHex(path, neighbor)) {
        if (path.length === 3) {
          const key = hexCoordinateKey(neighbor);
          if (!visited.has(key)) {
            visited.add(key);
            valid.push(neighbor);
          }
        } else {
          walk(moveTileProduce(board, current, neighbor), [...path, neighbor]);
        }
      }
    });
  };

  walk(board, [coordinate]);
  return valid;
}
