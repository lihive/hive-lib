import { HexCoordinate } from './types';

/**
 * An error indicating that two coordinates are not adjacent when they were
 * expected to be.
 *
 * @public
 */
export class CoordinatesNotAdjacentError extends Error {
  constructor(a: HexCoordinate, b: HexCoordinate) {
    super(`Tiles (${a.q},${a.r}) and (${b.q},${b.r}) are not adjacent.`);
  }
}

/**
 * An error indicating that a direction value is invalid.
 *
 * @public
 */
export class InvalidDirectionError extends Error {
  constructor(direction: number) {
    super(`${direction} is not a valid direction.`);
  }
}

/**
 * An error indicating that there is no tile at a coordinate where there was
 * expected to be one.
 *
 * @public
 */
export class NoTileAtCoordinateError extends Error {
  constructor(coordinate: HexCoordinate) {
    super(`No tile at (${coordinate.q}, ${coordinate.r})`);
  }
}
