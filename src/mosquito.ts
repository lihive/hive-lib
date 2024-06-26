import { BugId, GameBoard, HexCoordinate } from './types';
import { moveBreaksHive } from './move';
import { eachNeighboringStack, getStackHeight } from './board';
import { validBeetleMoves } from './beetle';
import { getTileBug } from './tile';
import { hexCoordinateKey } from './hex';
import { validAntMoves } from './ant';
import { validGrasshopperMoves } from './grasshopper';
import { validLadybugMoves } from './ladybug';
import { validQueenMoves } from './queen';
import { validSpiderMoves } from './spider';
import { validPillbugMoves } from './pillbug';

/**
 * Get all valid moves for the tile at the given coordinate acting as a
 * mosquito.
 *
 * @remarks
 * The mosquito rules state that the mosquito takes on the movement
 * characteristics of any bug it touches, regardless of color. If moved as a
 * beetle on top of the hive, it continues to move as a beetle until it climbs
 * down from the hive. If when on the ground level it is next to a stacked
 * beetle, it may move as a beetle and not any piece below the beetle. If
 * only touching another mosquito (including a stacked one) and no other piece,
 * it may not move.
 *
 * @param board - A game board.
 * @param coordinate - The location of the tile acting as a mosquito.
 * @returns An array of hex coordinates.
 *
 * @beta
 */
export function validMosquitoMoves(
  board: GameBoard,
  coordinate: HexCoordinate
): HexCoordinate[] {
  if (moveBreaksHive(board, coordinate)) return [];

  const isBeetle = getStackHeight(board, coordinate) > 1;
  if (isBeetle) return validBeetleMoves(board, coordinate);

  const bugTypes = new Set<BugId>();
  eachNeighboringStack(board, coordinate, (_, stack) => {
    const topTile = getTileBug(stack[stack.length - 1]);
    bugTypes.add(topTile);
  });

  const valid: HexCoordinate[] = [];
  const visited = new Set<string>();

  const addValidMoves = (coordinates: HexCoordinate[]) => {
    coordinates.forEach((coordinate) => {
      const key = hexCoordinateKey(coordinate);
      if (!visited.has(key)) {
        visited.add(key);
        valid.push(coordinate);
      }
    });
  };

  bugTypes.forEach((bug) => {
    switch (bug) {
      case 'A':
        addValidMoves(validAntMoves(board, coordinate));
        break;
      case 'B':
        addValidMoves(validBeetleMoves(board, coordinate));
        break;
      case 'G':
        addValidMoves(validGrasshopperMoves(board, coordinate));
        break;
      case 'L':
        addValidMoves(validLadybugMoves(board, coordinate));
        break;
      case 'P':
        addValidMoves(validPillbugMoves(board, coordinate));
        break;
      case 'Q':
        addValidMoves(validQueenMoves(board, coordinate));
        break;
      case 'S':
        addValidMoves(validSpiderMoves(board, coordinate));
        break;
    }
  });

  return valid;
}
