import { HexCoordinate } from './types';

/**
 * An error indicating that two coordinates are not adjacent when they were
 * expected to be.
 *
 * @beta
 */
export class CoordinatesNotAdjacentError extends Error {
  constructor(a: HexCoordinate, b: HexCoordinate) {
    super(`Tiles (${a.q},${a.r}) and (${b.q},${b.r}) are not adjacent.`);
  }
}

/**
 * An error indicating that a direction value is invalid.
 *
 * @beta
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
 * @beta
 */
export class NoTileAtCoordinateError extends Error {
  constructor(coordinate: HexCoordinate) {
    super(`No tile at (${coordinate.q}, ${coordinate.r})`);
  }
}

/**
 * An error indicating that some type of notation string could not be parsed.
 *
 * @beta
 */
export class NotationParsingError extends Error {
  constructor(type: string, notation: string) {
    super(`Error parsing ${type} notation string: ${notation}`);
  }
}
