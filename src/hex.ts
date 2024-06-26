import { CartesianCoordinate, HexCoordinate, HexOrientation } from './types';
import { CoordinatesNotAdjacentError, InvalidDirectionError } from './error';
import { _SQRT3 } from './constants';

/**
 * Convert a cartesian coordinate to a hex coordinate.
 *
 * @param coordinate - A cartesian coordinate.
 * @param size - The hex size.
 * @returns The coordinate of the hex that contains the given cartesian
 * coordinate.
 *
 * @beta
 */
export function cartesianToHex(
  coordinate: CartesianCoordinate,
  size: number
): HexCoordinate {
  const x = ((_SQRT3 / 3) * coordinate.x - (1 / 3) * coordinate.y) / size;
  const y = ((2 / 3) * coordinate.y) / size;
  const z = -x - y;

  let rx = Math.round(x);
  let ry = Math.round(y);
  let rz = Math.round(z);

  const xd = Math.abs(rx - x);
  const yd = Math.abs(ry - y);
  const zd = Math.abs(rz - z);

  if (xd > yd && xd > zd) rx = -ry - rz;
  else if (yd > zd) ry = -rx - rz;

  return {
    q: rx,
    r: ry
  };
}

/**
 * Generate a unique string for a hex coordinate. This function will always
 * generate the same string for a given coordinate.
 *
 * @param coordinate - The hex coordinate.
 * @returns A string unique to the coordinate.
 *
 * @beta
 */
export function hexCoordinateKey(coordinate: HexCoordinate): string {
  return `${coordinate.q}.${coordinate.r}`;
}

/**
 * Determine if two hex coordinates are adjacent.
 *
 * @param a - The first coordinate.
 * @param b - The second coordinate.
 * @returns true if the hex coordinates are adjacent, false otherwise.
 *
 * @beta
 */
export function hexesAreNeighbors(a: HexCoordinate, b: HexCoordinate): boolean {
  return Math.abs(a.q - b.q) <= 1 && Math.abs(a.r - b.r) <= 1;
}

/**
 * Determine if two hex coordinates are equivalent.
 *
 * @param a - The first hex coordinate.
 * @param b - The second hex coordinate.
 * @returns true if the coordinates are the same, false otherwise.
 *
 * @beta
 */
export function hexesEqual(a?: HexCoordinate, b?: HexCoordinate): boolean {
  if (!a || !b) return false;
  return a.q === b.q && a.r === b.r;
}

/**
 * Get the height of a hexagon given its size.
 *
 * Refer to [Red Blob Games](https://www.redblobgames.com/grids/hexagons/#size-and-spacing)
 * for definition of hexagon size.
 *
 * @param hexSize - A hex size.
 * @returns The height of a hexagon with the given size.
 *
 * @beta
 */
export function hexHeight(hexSize: number): number {
  return 2 * hexSize;
}

/**
 * Convert a hex coordinate to a cartesian coordinate.
 *
 * @param coordinate - The hex coordinate.
 * @param size - The hexagon size.
 * @param orientation - A hex orientation.
 * @returns A cartesian coordinate representing the center of the hexagon.
 *
 * @beta
 */
export function hexToCartesian(
  coordinate: HexCoordinate,
  size: number,
  orientation: HexOrientation
): CartesianCoordinate {
  const { q, r } = coordinate;
  const M = orientation;
  return {
    x: size * (M.f0 * q + M.f1 * r),
    y: size * (M.f2 * q + M.f3 * r)
  };
}

/**
 * Create an SVG transform string that can be used to translate to the center
 * of a given hex coordinate.
 *
 * @param coordinate - A hex coordinate.
 * @param size - The hexagon size.
 * @param orientation - A hex orientation.
 * @returns An svg transform string.
 *
 * @beta
 */
export function hexToTransform(
  coordinate: HexCoordinate,
  size: number,
  orientation: HexOrientation
): string {
  const { x, y } = hexToCartesian(coordinate, size, orientation);
  return `translate(${x} ${y}) rotate(${orientation.startAngle})`;
}

/**
 * Get the width of a hexagon given its size.
 *
 * Refer to [Red Blob Games](https://www.redblobgames.com/grids/hexagons/#size-and-spacing)
 * for definition of hexagon size.
 *
 * @param hexSize - A hex size.
 * @returns The width of a hexagon with the given size.
 *
 * @beta
 */
export function hexWidth(hexSize: number): number {
  return _SQRT3 * hexSize;
}

/**
 * Determine if an array of hex coordinates includes a specific coordinate.
 *
 * @param hexes - An array of hex coordinates.
 * @param hex - The hex coordinate to search for.
 * @returns true if hex is in the array hexes, false otherwise.
 *
 * @beta
 */
export function includesHex(
  hexes: HexCoordinate[],
  hex: HexCoordinate
): boolean {
  return hexes.findIndex((curr) => hexesEqual(hex, curr)) !== -1;
}

/**
 * Convert a hex coordinate into a hex coordinate.
 *
 * @param coordinateKey - A hex coordinate key.
 * @returns A hex coordinate.
 *
 * @beta
 */
export function parseHexCoordinateKey(coordinateKey: string): HexCoordinate {
  const values = coordinateKey.split('.');
  return {
    q: +values[0],
    r: +values[1]
  };
}

/**
 * Get the hex coordinate in one of the six directions relative to the given
 * base coordinate, or on top of that coordinate.
 *
 * @param coordinate - The base coordinate, from which the relative coordinate
 * will be calculated.
 * @param direction - The direction relative to the base coordinate. Starting
 * with 1 at the top-right, and proceeding clockwise through 6.
 * @returns The relative coordinate, or the same coordinate if direction is
 * zero.
 *
 * @beta
 */
export function relativeHexCoordinate(
  coordinate: HexCoordinate,
  direction: number
): HexCoordinate {
  const { q, r } = coordinate;
  switch (direction) {
    case 0:
      return coordinate;
    case 1:
      return { q: q + 1, r: r - 1 };
    case 2:
      return { q: q + 1, r };
    case 3:
      return { q, r: r + 1 };
    case 4:
      return { q: q - 1, r: r + 1 };
    case 5:
      return { q: q - 1, r };
    case 6:
      return { q, r: r - 1 };
    default:
      throw new InvalidDirectionError(direction);
  }
}

/**
 * Get the hex direction pointing from source to target.
 *
 * @param source - The source coordinate.
 * @param target - The target coordinate.
 * @returns The hex direction pointing from source to target.
 * @throws Error if the hex coordinates are not adjacent.
 *
 * @beta
 */
export function relativeHexDirection(
  source: HexCoordinate,
  target: HexCoordinate
): number {
  const dq = target.q - source.q;
  const dr = target.r - source.r;
  if (dq === -1) {
    if (dr === 0) return 5;
    if (dr === 1) return 4;
  }
  if (dq === 0) {
    if (dr === -1) return 6;
    if (dr === 1) return 3;
  }
  if (dq === 1) {
    if (dr === -1) return 1;
    if (dr === 0) return 2;
  }
  throw new CoordinatesNotAdjacentError(source, target);
}

/**
 * Convert a number to a hex direction.
 *
 * @param number - The number to convert.
 * @returns A number in the range [1, 6].
 *
 * @beta
 */
export function toHexDirection(number: number): number {
  while (number < 1) number += 6;
  return 1 + ((number - 1) % 6);
}
