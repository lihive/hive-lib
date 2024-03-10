import { HexCoordinate, Move, TileId } from './types';
import { isMoveMovement, isMovePass, isMovePlacement } from './move';

/**
 * Generate a game notation string from an array of {@link Move}s.
 *
 * @param moves An array of moves.
 * @return A game notation string.
 */
export function gameNotation(moves: Move[]): string {
  return moves
    .map((move) => {
      if (isMovePass(move)) return passNotation();
      if (isMovePlacement(move)) return placementNotation(move.tileId, move.to);
      if (isMoveMovement(move)) return movementNotation(move.from, move.to);
      return '';
    })
    .join();
}

/**
 * Generate a tile movement notation string.
 *
 * @param from The location of the tile being moved.
 * @param to The movement destination.
 * @return A tile movement notation string.
 */
export function movementNotation(
  from: HexCoordinate,
  to: HexCoordinate
): string {
  return `(${from.q},${from.r})(${to.q},${to.r})`;
}

/**
 * Generate a passing move notation string.
 *
 * @return A passing move notation string.
 */
export function passNotation(): string {
  return 'x';
}

/**
 * Generate a tile placement notation string.
 *
 * @param tileId The tile being placed.
 * @param coordinate The placement location.
 * @return A tile placement notation string.
 */
export function placementNotation(
  tileId: TileId,
  coordinate: HexCoordinate
): string {
  return `(${coordinate.q},${coordinate.r})[${tileId}]`;
}

/**
 * Generate an ordered array of {@link Move} objects from a game notation
 * string.
 *
 * @param notation A game notation string.
 * @return An array of {@link Move}s.
 */
export function parseGameNotation(notation: string): Move[] {
  function parseToken(token: string): HexCoordinate | TileId {
    if (token[0] === '(') {
      const nums = token.slice(1, -1).split(',');
      return {
        q: parseInt(nums[0]),
        r: parseInt(nums[1])
      };
    }
    if (token[0] === '[') {
      return token.slice(1, -1) as TileId;
    }
    throw new Error(`Invalid token: ${token}`);
  }

  const moves: Move[] = [];
  let tokens = [];
  let move = '';
  let token = '';
  for (let i = 0, len = notation.length; i < len; ++i) {
    const char = notation[i];
    /// game end
    if (char === '#') break;

    /// passing move
    if (char === 'x') {
      moves.push({ pass: true });
      continue;
    }

    /// placement or movement
    move += char;
    token += char;
    if (char === ')' || char === ']') {
      tokens.push(token);
      token = '';
    }
    if (tokens.length === 2) {
      const tokA = parseToken(tokens[0]);
      const tokB = parseToken(tokens[1]);
      if (typeof tokB === 'string') {
        moves.push({
          tileId: tokB,
          to: tokA as HexCoordinate
        });
      } else {
        moves.push({
          from: tokA as HexCoordinate,
          to: tokB as HexCoordinate
        });
      }
      tokens = [];
      move = '';
    }
  }
  return moves;
}
