import { Color, GameBoard, HexCoordinate, Move } from './types';
import {
  _ownValidMoves,
  isMovePass,
  isMovePlacement,
  moveBreaksHive
} from './move';
import {
  eachDropDirection,
  eachSlideDirection,
  getStackHeight,
  isGated,
  _moveTileProduce,
  getTileAt
} from './board';
import { hexesEqual, includesHex, relativeHexDirection } from './hex';
import { getTileColor } from './tile';
import { NoTileAtCoordinateError } from './error';

/**
 * Get all valid moves for the tile at the given coordinate acting as a pillbug.
 *
 * @remarks
 * The pillbug rules state that the pillbug can move only one space per turn.
 *
 * @param board - A game board.
 * @param coordinate - The location of the tile acting as a pillbug.
 * @returns An array of hex coordinates.
 *
 * @public
 */
export function validPillbugMoves(
  board: GameBoard,
  coordinate: HexCoordinate
): HexCoordinate[] {
  if (moveBreaksHive(board, coordinate)) return [];
  const valid: HexCoordinate[] = [];
  eachSlideDirection(board, coordinate, (neighbor) => {
    valid.push(neighbor);
  });
  return valid;
}

/**
 * Get all valid moves for the tile at the given coordinate being moved by an
 * adjacent pillbug.
 *
 * @remarks
 * The pillbug has a special ability that allows it to move an adjacent piece
 * two space; up onto itself and then down into another space adjacent to
 * itself, with the following exceptions (which are enforced by this function):
 * - The pillbug may not move a piece from a stack with more than one tile.
 * - The pillbug may not move a piece if it would break the hive.
 * - The pillbug may not move a piece through a gate.
 *
 * Additionally, the following rules apply to the pillbug but are *not* enforced
 * by this function:
 * - The pillbug may not move a piece which was just moved or placed by another
 *   player.
 * - Any piece moved by the pillbug may not be moved at all during the next
 *   player's turn.
 *
 * @param board - A game board.
 * @param target - The location of the tile being moved by the pillbug.
 * @param pillbug - The location of the pillbug moving the tile.
 * @returns An array of hex coordinates.
 *
 * @public
 */
export function validPillbugPushes(
  board: GameBoard,
  target: HexCoordinate,
  pillbug: HexCoordinate
): HexCoordinate[] {
  if (moveBreaksHive(board, target)) return [];

  const valid: HexCoordinate[] = [];
  const pickupDirection = relativeHexDirection(target, pillbug);

  // The pillbug cannot pick up a tile from on top of a stack and it cannot pass
  // a tile through a gate to pick up that tile.
  if (
    getStackHeight(board, target) > 1 ||
    isGated(board, target, pickupDirection)
  )
    return [];

  // Move the tile on top of the pillbug
  board = _moveTileProduce(board, target, pillbug);

  // Drop directions, excluding the original coordinate of target, are valid
  eachDropDirection(board, pillbug, (neighbor) => {
    if (!hexesEqual(target, neighbor)) {
      valid.push(neighbor);
    }
  });

  return valid;
}

/**
 * Determine if a move was a pillbug push.
 *
 * @remarks
 * This function is typically used to determine if the latest move in a game
 * was a pillbug push
 *
 * @param color - The color of the player who performed the move.
 * @param move - The move in question.
 * @param board - The state of the game board *after* the move.
 * @returns true if the move was a pillbug push, false otherwise.
 *
 * @throws {@link NoTileAtCoordinateError}
 * Throws if there is no tile at the destination of the move.
 *
 * @public
 */
export function wasPillbugPush(
  color: Color,
  move: Move,
  board: GameBoard
): boolean {
  if (isMovePass(move) || isMovePlacement(move)) {
    return false;
  }

  // get the tile that was moved
  const tile = getTileAt(board, move.to);
  if (!tile) throw new NoTileAtCoordinateError(move.to);

  // if the tile is not the same color as the player who moved it, it must have
  // been moved by a pillbug
  if (getTileColor(tile) !== color) {
    return true;
  }

  // move the tile back
  const previous = _moveTileProduce(board, move.to, move.from);

  // could the tile have moved on its own? if so, not a pillbug push, otherwise,
  // a pillbug must have moved it.
  const ownMoves = _ownValidMoves(previous, move.from);
  return !includesHex(ownMoves, move.to);
}
