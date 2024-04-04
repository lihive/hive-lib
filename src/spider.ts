import { GameBoard, HexCoordinate } from './types';
import { eachSlideDirection, _moveTileProduce } from './board';
import { hexCoordinateKey, includesHex } from './hex';
import { moveBreaksHive } from './move';

/**
 * Get all valid moves for the tile at the given coordinate acting as a spider.
 *
 * @remarks
 * The spider rules state that a spider moves exactly three spaces per turn. It
 * must move in a direct path and cannot backtrack on itself. I may only move
 * around pieces it is in direct contact with on each step of its move and it
 * may not move across to a piece that it is not in direct contact with.
 *
 * @param board - A game board.
 * @param coordinate - The location of the tile acting as a spider.
 * @returns An array of hex coordinates.
 *
 * @beta
 */
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
          walk(_moveTileProduce(board, current, neighbor), [...path, neighbor]);
        }
      }
    });
  };

  walk(board, [coordinate]);
  return valid;
}
