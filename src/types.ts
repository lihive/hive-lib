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
export type BugLetter = 'A' | 'B' | 'G' | 'L' | 'M' | 'P' | 'Q' | 'S';

/**
 * A string that represents a bug, differentiating bugs of the same type using numbers.
 */
export type BugKey =
  | `A${1 | 2 | 3}`
  | `B${1 | 2}`
  | `G${1 | 2 | 3}`
  | 'L'
  | 'M'
  | 'P'
  | 'Q'
  | `S${1 | 2}`;

/**
 * A character representing a hive player color.
 */
export type ColorKey = 'b' | 'w';

/**
 * A string that represents a specific colored bug tile.
 */
export type TileId = `${ColorKey}${BugKey}`;

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
export interface TileStack {
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
export type GameOptions = {
  // flag indicating use of tournament opening rules
  tournament?: true;
  // flag indicating pillbug use
  pillbug?: true;
  // flag indicating ladybug use
  ladybug?: true;
  // flag indicating mosquito use
  mosquito?: true;
};

/**
 * An object describing a player's move, which can either be a pass or move or
 * place a tile.
 */
export type Move = MovePlay | MovePass;

/**
 * An object describing a passing move.
 */
export type MovePass = {
  // the raw tile notation string
  notation: string;

  // an 'x' indicating this is a pass
  tileId: 'x';

  // an 'x' indicating this is a pass
  refId: 'x';

  // a -1 indicating this is a pass
  dir: -1;
};

/**
 * An object describing a move.
 */
export type MovePlay = {
  // the raw tile notation string
  notation: string;

  // the id of the tile being moved
  tileId: TileId;

  // the id of the reference tile (if first move of game, same as tileId)
  refId: TileId;

  // the direction relative to the reference tile that the moved tile is placed (0 if first move of game)
  dir: number;
};

/**
 * An object describing a game turn. Much like chess, a turn consists a move
 * performed by each player.
 */
export type Turn = {
  // the raw game turn notation string
  notation: string;

  // the game turn index, starting at 1 for the first turn of the game
  index: number;

  // the black tile move for this turn
  black: Move | undefined;

  // the white tile move for this turn
  white: Move | undefined;
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
 * A function invoked with a hex coordinate and optionally a tile stack.
 */
export type SpaceFn = (coordinate: HexCoordinate, ids?: TileId[]) => any;

/**
 * A function invoked with a hex coordinate and a tile stack.
 */
export type StackFn = (coordinate: HexCoordinate, ids: TileId[]) => any;
