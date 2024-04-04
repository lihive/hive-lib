import {
  Color,
  Game,
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
import { hexCoordinateKey, hexesEqual } from './hex';
import { validAntMoves } from './ant';
import { validBeetleMoves } from './beetle';
import { validGrasshopperMoves } from './grasshopper';
import { validLadybugMoves } from './ladybug';
import { validMosquitoMoves } from './mosquito';
import {
  validPillbugMoves,
  validPillbugPushes,
  wasPillbugPush
} from './pillbug';
import { validQueenMoves } from './queen';
import { validSpiderMoves } from './spider';

/**
 * Create a passing move.
 *
 * @returns A passing move.
 *
 * @public
 */
export function createMovePass(): Pass {
  return {
    pass: true
  };
}

/**
 * Create a tile placement move.
 *
 * @param tileId - The tile being placed.
 * @param to - The coordinate where the tile is being placed.
 * @returns A move indicating placement of the specified tile at the specified
 * coordinate.
 *
 * @public
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
 * @param from - The coordinate where the tile is moving from.
 * @param to - The coordinate where the tile is move to.
 * @returns A move indicating movement of a tile from the specified coordinate
 * to the specified destination.
 *
 * @public
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
 * @param moves - The current sequence of game moves.
 * @returns The color of the player who plays next.
 *
 * @public
 */
export function getNextMoveColor(moves: Move[]): Color {
  return moves.length % 2 ? 'b' : 'w';
}

/**
 * Determine if a move is a passing move.
 *
 * @param move - A move.
 * @returns true if the move is a passing move, false otherwise.
 *
 * @public
 */
export function isMovePass(move: Move): move is Pass {
  return 'pass' in move && move.pass;
}

/**
 * Determine if a move is a tile placement.
 *
 * @param move - A move.
 * @returns true if the move is a tile placement, false otherwise.
 *
 * @public
 */
export function isMovePlacement(move: Move): move is TilePlacement {
  return 'tileId' in move && 'to' in move;
}

/**
 * Determine if a move is a tile movement.
 *
 * @param move - A move.
 * @returns true if the move is a tile movement, false otherwise.
 *
 * @public
 */
export function isMoveMovement(move: Move): move is TileMovement {
  return 'from' in move && 'to' in move;
}

/**
 * Determine if moving the topmost tile from the given coordinate would break
 * the hive.
 *
 * @param board - A game board.
 * @param coordinate - The coordinate from which to move a tile.
 * @returns true if moving the topmost tile from the given coordinate would break
 * the tile, false otherwise.
 *
 * @public
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

/**
 * Get an array of valid moves for the specified color player moving the top tile
 * at the specified coordiante.
 *
 * @remarks
 * The `gameOrBoard` parameter should always be a {@link Game} when possible.
 * The pillbug's special ability to move other tiles depends on knowledge of the
 * previous move to determine which tiles are eligible to be moved during the
 * current turn. When the `gameOrBoard` parameter is a board, it is assumed that
 * no tiles are restricted from movement based on pillbug rules.
 *
 * @param gameOrBoard - A game or a game board.
 * @param color - The color of the player moving a tile.
 * @param coordinate - The coordinate of the tile being moved.
 * @returns An array of coordinates indicating valid destinations for the tile
 * being moved by the specified player.
 *
 * @public
 */
export function validMoves(
  gameOrBoard: Game | GameBoard,
  color: Color,
  coordinate: HexCoordinate
): HexCoordinate[] {
  const board = 'board' in gameOrBoard ? gameOrBoard.board : gameOrBoard;
  const moves = 'moves' in gameOrBoard ? gameOrBoard.moves : [];

  const tile = getTileAt(board, coordinate);
  if (!tile) return [];
  const tileColor = getTileColor(tile);
  const tileBug = getTileBug(tile);

  let valid: HexCoordinate[] = [];

  // Ignore blank tiles
  if (tileBug === 'X') return valid;

  // Prevent any movement at all if this tile was moved by a pillbug on the
  // previous move
  if (moves && moves.length > 0) {
    const lastMove = moves[moves.length - 1];
    if (wasPillbugPush(color, lastMove, board)) {
      return valid;
    }
  }

  // Get tile's own movements
  if (tileColor === color) {
    valid = _ownValidMoves(board, coordinate);
  }

  // Prevent movement by pillbug if the previous move also moved this tile
  if (moves && moves.length > 0) {
    const lastMove = moves[moves.length - 1];
    if (!isMovePass(lastMove) && hexesEqual(coordinate, lastMove.to)) {
      return valid;
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

/**
 * Get an array of all valid moves for the tile at the specified coordinate
 * moving according to the movement rules of its own bug type.
 *
 * @param board - A game board
 * @param coordinate - The coordinate of the tile
 * @returns An array of hex coordinates.
 *
 * @internal
 */
export function _ownValidMoves(
  board: GameBoard,
  coordinate: HexCoordinate
): HexCoordinate[] {
  const tile = getTileAt(board, coordinate);
  if (!tile) return [];
  const tileBug = getTileBug(tile);
  switch (tileBug) {
    case 'A':
      return validAntMoves(board, coordinate);
    case 'B':
      return validBeetleMoves(board, coordinate);
    case 'G':
      return validGrasshopperMoves(board, coordinate);
    case 'L':
      return validLadybugMoves(board, coordinate);
    case 'M':
      return validMosquitoMoves(board, coordinate);
    case 'P':
      return validPillbugMoves(board, coordinate);
    case 'Q':
      return validQueenMoves(board, coordinate);
    case 'S':
      return validSpiderMoves(board, coordinate);
  }
  return [];
}
