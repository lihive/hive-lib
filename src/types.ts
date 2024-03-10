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
 */
export type Bug = 'A' | 'B' | 'G' | 'L' | 'M' | 'P' | 'Q' | 'S';

/**
 * A character representing a hive player color.
 */
export type Color = 'b' | 'w';

/**
 * A string that represents a specific colored bug tile.
 */
export type TileId = `${Color}${Bug}`;

/**
 * A coordinate in 2D space in a cartesian coordinate system.
 */
export interface CartesianCoordinate {
  x: number;
  y: number;
}

/**
 * A coordinate in 2D space in a hexagonal coordinate system.
 */
export interface HexCoordinate {
  q: number;
  r: number;
}

/**
 * A stack of tile ids associated with a hex coordinate.
 */
export interface HexStack {
  coordinate: HexCoordinate;
  stack: TileId[];
}

/**
 * A map of hex coordinates to tile stacks.
 */
export type GameBoard = {
  [q: number]: {
    [r: number]: TileId[];
  };
};

/**
 * An object describing which play variants are being used.
 */
export interface GameConfig {
  // flag indicating use of tournament opening rules
  tournament?: true;
  // the number of each tile type (defaulting to 0 if omitted)
  tileset: Partial<{
    [key in Bug]: number;
  }>;
}

/**
 * An object that contains a game's settings, history, and state.
 */
export type Game = {
  config: GameConfig;
  board: GameBoard;
  moves: Move[];
};

/**
 * An object describing a player's move, which can be a tile placement, tile
 * movement, or pass.
 */
export type Move = TilePlacement | TileMovement | Pass;

/**
 * An object describing a passing move.
 */
export type Pass = {
  // flag indicating a passing move
  pass: true;
};

/**
 * An object describing a move.
 */
export type TileMovement = {
  // the location of the tile being moved
  from: HexCoordinate;
  // the movement destination
  to: HexCoordinate;
};

/**
 * An object describing a tile placement.
 */
export type TilePlacement = {
  // the tile being placed
  tileId: TileId;
  // the placement location
  to: HexCoordinate;
};

/**
 * A function invoked with a hex coordinate parameter.
 */
export type CoordFn = (coordinate: HexCoordinate) => any;

/**
 * A function invoked with a hex direction parameter.
 */
export type DirectionFn = (direction: number) => any;

/**
 * A function typically invoked for a tile's neighbors, where coordinate and
 * stack refer to some coordinate's neighboring coordinate and stack, and
 * direction refers to the relative direction of the neighbor.
 */
export type NeighborFn = (
  coordinate: HexCoordinate,
  stack: TileId[],
  direction: number
) => any;

/**
 * A function invoked with a hex coordinate and a tile stack.
 */
export type SpaceFn = (coordinate: HexCoordinate, stack: TileId[]) => any;