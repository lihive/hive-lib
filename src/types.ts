/**
 * A character that represents a bug type.
 * - A: Ant
 * - B: Beetle
 * - G: Grasshopper
 * - L: Ladybug
 * - M: Mosquito
 * - P: Pillbug
 * - Q: Queen
 * - S: Spider
 * - X: Blank
 *
 * @beta
 */
export type BugId = 'A' | 'B' | 'G' | 'L' | 'M' | 'P' | 'Q' | 'S' | 'X';

/**
 * A character representing a hive player color.
 *
 * @beta
 */
export type Color = 'b' | 'w';

/**
 * A string that represents a specific colored bug tile.
 *
 * @beta
 */
export type TileId = `${Color}${BugId}`;

/**
 * A coordinate in 2D space in a cartesian coordinate system.
 *
 * @beta
 */
export interface CartesianCoordinate {
  x: number;
  y: number;
}

/**
 * A coordinate in 2D space in a hexagonal coordinate system.
 *
 * @beta
 */
export interface HexCoordinate {
  q: number;
  r: number;
}

/**
 * An object that represents a hex orientation.
 *
 * @remarks
 * Internally the objectstores values for performing a coordinate transformation
 * and its inverse, as well as a starting angle for drawing a hex.
 *
 * @beta
 */
export interface HexOrientation {
  id: 'flat-top' | 'pointy-top';
  f0: number;
  f1: number;
  f2: number;
  f3: number;
  b0: number;
  b1: number;
  b2: number;
  b3: number;
  startAngle: number;
}

/**
 * A stack of tile ids associated with a hex coordinate.
 *
 * @beta
 */
export interface HexStack {
  coordinate: HexCoordinate;
  tiles: TileId[];
}

/**
 * A map of hex coordinates to tile stacks.
 *
 * @beta
 */
export type GameBoard = {
  [q: number]: {
    [r: number]: TileId[];
  };
};

/**
 * An object describing which play variants are being used in a game.
 *
 * @beta
 */
export interface GameConfig {
  // flag indicating use of tournament opening rules
  tournament?: true;
  // the number of each tile type (defaulting to 0 if omitted)
  tileset: Partial<{
    [key in BugId]: number;
  }>;
}

/**
 * An object that contains a game's settings, history, and state.
 *
 * @beta
 */
export type Game = {
  config: GameConfig;
  board: GameBoard;
  moves: Move[];
};

/**
 * An object describing a player's move, which can be a tile placement, tile
 * movement, or pass.
 *
 * @beta
 */
export type Move = TilePlacement | TileMovement | Pass;

/**
 * An object describing a passing move.
 *
 * @beta
 */
export type Pass = {
  // flag indicating a passing move
  pass: true;
};

/**
 * An object describing a tile movement.
 *
 * @beta
 */
export type TileMovement = {
  // the location of the tile being moved
  from: HexCoordinate;
  // the movement destination
  to: HexCoordinate;
};

/**
 * An object describing a tile placement.
 *
 * @beta
 */
export type TilePlacement = {
  // the tile being placed
  tileId: TileId;
  // the placement location
  to: HexCoordinate;
};

/**
 * A function invoked with a hex direction parameter.
 *
 * @beta
 */
export type DirectionFn = (direction: number) => any;

/**
 * A function typically invoked for a coordinates's neighbors, where neighbor
 * and stack refer to some coordinate's neighboring coordinate and stack, and
 * direction refers to the relative direction of the neighbor from the original
 * coordinate.
 *
 * @beta
 */
export type NeighborFn = (
  neighbor: HexCoordinate,
  stack: TileId[],
  direction: number
) => any;

/**
 * A function invoked with a hex coordinate and a tile stack.
 *
 * @beta
 */
export type StackFn = (coordinate: HexCoordinate, stack: TileId[]) => any;
