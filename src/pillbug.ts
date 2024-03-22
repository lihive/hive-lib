import { GameBoard, HexCoordinate } from './types';
import { moveBreaksHive } from './move';
import {
  eachDropDirection,
  eachSlideDirection,
  getStackHeight,
  isGated,
  moveTileProduce
} from './board';
import { hexesEqual, relativeHexDirection } from './hex';

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
  board = moveTileProduce(board, target, pillbug);

  // Drop directions, excluding the original coordinate of target, are valid
  eachDropDirection(board, pillbug, (neighbor) => {
    if (!hexesEqual(target, neighbor)) {
      valid.push(neighbor);
    }
  });

  return valid;
}
