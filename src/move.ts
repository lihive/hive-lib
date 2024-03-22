import {
  Color,
  GameBoard,
  HexCoordinate,
  Move,
  Pass,
  TileId,
  TileMovement,
  TilePlacement
} from './types';
import {
  eachNeighboringStack,
  getOccupiedCoordinates,
  getOccupiedNeighbors,
  getStackHeight,
  getTileAt,
  walkBoard
} from './board';
import { getTileBug, getTileColor } from './tile';
import { hexCoordinateKey } from './hex';
import { validAntMoves } from './ant';
import { validBeetleMoves } from './beetle';
import { validGrasshopperMoves } from './grasshopper';
import { validLadybugMoves } from './ladybug';
import { validMosquitoMoves } from './mosquito';
import { validPillbugMoves, validPillbugPushes } from './pillbug';
import { validQueenMoves } from './queen';
import { validSpiderMoves } from './spider';

/**
 * Create a passing move.
 */
export function createMovePass(): Pass {
  return {
    pass: true
  };
}

/**
 * Create a tile placement move.
 *
 * @param tileId The tile being placed.
 * @param to The coordinate where the tile is being placed.
 */
export function createTilePlacement(
  tileId: TileId,
  to: HexCoordinate
): TilePlacement {
  return {
    tileId,
    to
  };
}

/**
 * Create a tile movement move.
 *
 * @param from The coordinate where the tile is moving from.
 * @param to The coordinate where the tile is move to.
 */
export function createTileMovement(
  from: HexCoordinate,
  to: HexCoordinate
): TileMovement {
  return {
    from,
    to
  };
}

/**
 * Get the player who plays next.
 *
 * @param moves The current sequence of game moves.
 * @return the color of the player who plays next.
 */
export function getNextMoveColor(moves: Move[]): Color {
  return moves.length % 2 ? 'b' : 'w';
}

/**
 * Determine if a move is a passing move.
 *
 * @param move A move.
 * @return true if the move is a passing move, false otherwise.
 */
export function isMovePass(move: Move): move is Pass {
  return 'pass' in move && move.pass;
}

/**
 * Determine if a move is a tile placement.
 *
 * @param move A move.
 * @return true if the move is a tile placement, false otherwise.
 */
export function isMovePlacement(move: Move): move is TilePlacement {
  return 'tileId' in move && 'to' in move;
}

/**
 * Determine if a move is a tile movement.
 *
 * @param move A move.
 * @return true if the move is a tile movement, false otherwise.
 */
export function isMoveMovement(move: Move): move is TileMovement {
  return 'from' in move && 'to' in move;
}

/**
 * Determine if moving the topmost tile from the given coordinate would break
 * the hive.
 *
 * @param board A game board.
 * @param coordinate The coordinate from which to move a tile.
 * @return true if moving the topmost tile from the given coordinate would break
 * the tile, false otherwise.
 */
export function moveBreaksHive(
  board: GameBoard,
  coordinate: HexCoordinate
): boolean {
  // moving a tile on top of the hive cannot break the hive
  if (getStackHeight(board, coordinate) > 1) return false;
  // pick a random neighbor of the target coordinate
  const neighbor = getOccupiedNeighbors(board, coordinate).at(0);
  // no neighbors means single stack on board
  if (!neighbor) return false;
  // walk the board starting at `neighbor` as if `coordinate` were empty
  const walkedPath = walkBoard(board, neighbor, coordinate);
  // get all occupied coordinates
  const coordinates = getOccupiedCoordinates(board);
  // if the walked path did not touch every coordinate, move is invalid
  return walkedPath.length !== coordinates.length - 1;
}

export function validMoves(
  board: GameBoard,
  color: Color,
  coordinate: HexCoordinate
): HexCoordinate[] {
  const tile = getTileAt(board, coordinate);
  if (!tile) return [];

  let valid: HexCoordinate[] = [];

  // Get tile's own movements
  if (getTileColor(tile) === color) {
    switch (getTileBug(tile)) {
      case 'A':
        valid = validAntMoves(board, coordinate);
        break;
      case 'B':
        valid = validBeetleMoves(board, coordinate);
        break;
      case 'G':
        valid = validGrasshopperMoves(board, coordinate);
        break;
      case 'L':
        valid = validLadybugMoves(board, coordinate);
        break;
      case 'M':
        valid = validMosquitoMoves(board, coordinate);
        break;
      case 'P':
        valid = validPillbugMoves(board, coordinate);
        break;
      case 'Q':
        valid = validQueenMoves(board, coordinate);
        break;
      case 'S':
        valid = validSpiderMoves(board, coordinate);
        break;
    }
  }

  // Get movements resulting from own adjacent pillbugs
  const pillbugs: HexCoordinate[] = [];
  eachNeighboringStack(board, coordinate, (neighbor, neighborStack) => {
    const topTile = neighborStack[neighborStack.length - 1];
    if (getTileBug(topTile) === 'P' && getTileColor(topTile) === color) {
      pillbugs.push(neighbor);
    }
  });

  if (pillbugs.length) {
    const visited = new Set<string>(valid.map(hexCoordinateKey));
    const addValidMoves = (coordinates: HexCoordinate[]) => {
      coordinates.forEach((coordinate) => {
        const key = hexCoordinateKey(coordinate);
        if (!visited.has(key)) {
          visited.add(key);
          valid.push(coordinate);
        }
      });
    };

    pillbugs.forEach((pillbug) => {
      addValidMoves(validPillbugPushes(board, coordinate, pillbug));
    });
  }

  return valid;
}
