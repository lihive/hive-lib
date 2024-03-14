import { HexCoordinate } from './types';

export class CoordinatesNotAdjacentError extends Error {
  constructor(a: HexCoordinate, b: HexCoordinate) {
    super(`Tiles (${a.q},${a.r}) and (${b.q},${b.r}) are not adjacent.`);
  }
}

export class ExpectedTileAtCoordinateError extends Error {
  constructor(coordinate: HexCoordinate) {
    super(
      `Expected there to be a tile located at (${coordinate.q}, ${coordinate.r})`
    );
  }
}

export class InvalidDirectionError extends Error {
  constructor(direction: number) {
    super(`${direction} is not a valid direction.`);
  }
}

export class NoTileAtCoordinateError extends Error {
  constructor(coordinate: HexCoordinate) {
    super(`No tile at (${coordinate.q}, ${coordinate.r})`);
  }
}
