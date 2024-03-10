import {
  Bug,
  Color,
  DirectionFn,
  GameBoard,
  GameConfig,
  HexCoordinate,
  Move,
  NeighborFn,
  SpaceFn,
  TileId
} from './types';
import { isMoveMovement, isMovePass, isMovePlacement } from './move';
import { NoTileAtCoordinateError } from './error';
import {
  hexCoordinateKey,
  hexesEqual,
  includesHex,
  relativeHexCoordinate,
  toHexDirection
} from './hex';
import { getTileBug, getTileColor } from './tile';

/**
 * Determine if all queens of the given color are on the board.
 *
 * @param board A game board.
 * @param color The color queen to look for.
 * @param config The game config.
 * @return true if the number of queens of the given color on the board is
 * equal to the number of queens in the game config, false otherwise.
 */
export function allQueensPlaced(
  board: GameBoard,
  color: Color,
  config: GameConfig
): boolean {
  let count = 0;
  const queenId: TileId = `${color}Q`;
  const queenCoordinates = findTileCoordinates(board, queenId);
  queenCoordinates.forEach((coordinate) => {
    getStack(board, coordinate).forEach((tileId) => {
      if (tileId === queenId) count += 1;
    });
  });
  return count === config.tileset.Q;
}

/**
 * Determine if all queens of the given color are completely surrounded.
 *
 * @param board A game board.
 * @param color The color queen to look for.
 * @return true if all six spaces surrounding each queen of the given color
 * that are on the board is occupied, false otherwise. Returns true if there
 * are no queens of the given color on the board.
 */
export function allQueensSurrounded(board: GameBoard, color: Color): boolean {
  const queenCoordinates = findTileCoordinates(board, `${color}Q`);
  return queenCoordinates.every((queenCoordinate) => {
    return everyNeighbor(
      board,
      queenCoordinate,
      (_, stack) => stack.length > 0
    );
  });
}

/**
 * Iterate over all neighboring stacks onto which the tile at the given
 * coordinate could climb, calling iteratee for each. The following conditions
 * must be met for a tile to be able to climb onto a neighboring stack (and are
 * checked by this iterator):
 *  - The height of the destination stack must be equal to or greater than the
 *    height of the source stack.
 *  - There must not be a gate between the source and destination coordinates.
 *
 *  Iteratee functions may exit iteration early by explicitly returning false.
 *
 * @param board A game board.
 * @param coordinate The coordinate whose neighbors will be iterated over.
 * @param iteratee The function invoked per iteration.
 * @return false if the iteration ended early, true otherwise. If there is no
 * stack at the given coordinate, true is returned.
 */
export function eachClimbDirection(
  board: GameBoard,
  coordinate: HexCoordinate,
  iteratee: NeighborFn
): boolean {
  const stackHeight = getStackHeight(board, coordinate);
  if (!stackHeight) return true;
  return eachDirection((direction) => {
    const neighbor = relativeHexCoordinate(coordinate, direction);
    const neighborStack = getStack(board, neighbor);
    return neighborStack.length >= stackHeight &&
      !isGated(board, coordinate, direction)
      ? iteratee(neighbor, neighborStack, direction)
      : true;
  });
}

/**
 * Iterate over all six hex direction values (1 through 6). The iteratee is
 * invoked with one argument, the direction value. Iteratee functions may exit
 * iteration early by explicitly returning false.
 *
 * @param iteratee The function invoked per iteration.
 * @return false if iteration ended early, true otherwise.
 */
export function eachDirection(iteratee: DirectionFn): boolean {
  for (let i = 1; i <= 6; ++i) {
    if (iteratee(i) == false) return false;
  }
  return true;
}

/**
 * Iterate over all neighboring coordinate into which the tile at the given
 * coordinate could drop, calling iteratee for each. The following conditions
 * must be met for a tile to be able to drop into a neighboring coordinate (and
 * are checked by this iterator):
 *  - The height of the source stack must be at least two greater than the
 *    height of the destination stack.
 *  - There must not be a gate between the source and destination coordinates.
 *
 *  Iteratee functions may exit iteration early by explicitly returning false.
 *
 * @param board A game board.
 * @param coordinate The coordinate whose neighbors will be iterated over.
 * @param iteratee The function invoked per iteration.
 * @return false if the iteration ended early, true otherwise. If there is no
 * stack at the given coordinate, true is returned.
 */
export function eachDropDirection(
  board: GameBoard,
  coordinate: HexCoordinate,
  iteratee: NeighborFn
): boolean {
  const stackHeight = getStackHeight(board, coordinate);
  if (!stackHeight) return true;
  return eachDirection((direction) => {
    const neighbor = relativeHexCoordinate(coordinate, direction);
    const neighborStack = getStack(board, neighbor);
    return stackHeight - neighborStack.length >= 2 &&
      !isGated(board, coordinate, direction)
      ? iteratee(neighbor, neighborStack, direction)
      : true;
  });
}

/**
 * Iterate over all spaces surrounding a given coordinate. The iteratee is
 * invoked with two arguments: *(coordinate, stack)*. Iteratee functions may
 * exit iteration early by explicitly returning false.
 *
 * @param board The game board.
 * @param coordinate The coordinate whose neighboring spaces will be iterated over.
 * @param iteratee The function invoked per iteration.
 * @return false if iteration ended early, true otherwise.
 */
export function eachNeighboringSpace(
  board: GameBoard,
  coordinate: HexCoordinate,
  iteratee: NeighborFn
): boolean {
  return eachDirection((direction) => {
    const neighbor = relativeHexCoordinate(coordinate, direction);
    return iteratee(neighbor, getStack(board, neighbor), direction) !== false;
  });
}

/**
 * Iterate over all spaces with a tile stack surrounding the given coordinate.
 * The iteratee is invoked with two arguments: *(coordinate, stack)*. Iteratee
 * functions may exit iteration early by explicitly returning false.
 *
 * @param board The game board.
 * @param coordinate The coordinate whose neighboring stacks will be iterated over.
 * @param iteratee The function invoked per iteration.
 * @return false if iteration ended early, true otherwise.
 */
export function eachNeighboringStack(
  board: GameBoard,
  coordinate: HexCoordinate,
  iteratee: SpaceFn
): boolean {
  return eachDirection((direction) => {
    const neighbor = relativeHexCoordinate(coordinate, direction);
    const stack = getStack(board, neighbor);
    return stack.length ? iteratee(neighbor, stack) !== false : true;
  });
}

/**
 * Iterate over all neighboring coordinates into which the tile at the given
 * coordinate could slide, calling iteratee for each. The following conditions
 * must be met for a tile to be able to slide into a neighboring coordinate (and
 * are checked by this iterator):
 *  - The height of the source coordinate stack must be exactly one greater than
 *    the height of the destination coordinate stack.
 *  - There must not be a gate between the source and destination coordinates.
 *  - The source and destination coordinates must share an occupied neighbor, OR;
 *  - The source and destination coordinates must both have stack heights
 *    greater than one.
 *
 *  Iteratee functions may exit iteration early by explicitly returning false.
 *
 * @param board A game board.
 * @param coordinate The coordinate whose neighbors will be iterated over.
 * @param iteratee The function invoked per iteration.
 * @return false if iteration ended early, true otherwise. If there is no stack
 * at the given coordinate, true is returned.
 */
export function eachSlideDirection(
  board: GameBoard,
  coordinate: HexCoordinate,
  iteratee: NeighborFn
): boolean {
  const stack = getStack(board, coordinate);
  const neighbors = getOccupiedNeighbors(board, coordinate);
  const isOccupiedNeighbor = (coordinate: HexCoordinate) =>
    includesHex(neighbors, coordinate);
  if (!stack) return true;
  return eachNeighboringSpace(
    board,
    coordinate,
    (neighbor, neighborStack, direction) => {
      return stack.length - neighborStack.length === 1 &&
        !isGated(board, coordinate, direction) &&
        (stack.length > 1 ||
          someNeighboringSpace(board, neighbor, isOccupiedNeighbor))
        ? iteratee(neighbor, neighborStack, direction)
        : true;
    }
  );
}

/**
 * Iterate over all coordinates on the game board that contain tiles. The
 * iteratee is invoked with a hex coordinate and the stack located at that
 * coordinate. Iteratee functions may exit iteration early by returning false.
 *
 * @param board The game board to iterate over.
 * @param iteratee The function invoked per iteration.
 * @return false if iteration ended early, true otherwise.
 */
export function eachStack(board: GameBoard, iteratee: SpaceFn): boolean {
  for (const q in board) {
    for (const r in board[q]) {
      const stack = board[q][r];
      if (iteratee({ q: +q, r: +r }, stack) === false) {
        return false;
      }
    }
  }
  return true;
}

/**
 * Iterate over all unoccupied coordinates that are adjacent to occupied spaces
 * on a board. Each coordinate will only be visited once. Iteratee functions
 * may exit iteration early by explicitly returning false.
 *
 * @param board A game board.
 * @param iteratee The function invoked per iteration.
 * @return false if iteration ended early, true otherwise.
 */
export function eachUnoccupiedCoordinate(
  board: GameBoard,
  iteratee: SpaceFn
): boolean {
  const visited = new Set<string>();
  return eachStack(board, (coordinate) => {
    return eachNeighboringSpace(board, coordinate, (neighbor, stack) => {
      const key = hexCoordinateKey(neighbor);
      if (!visited.has(key) && !stack.length) {
        visited.add(key);
        return iteratee(neighbor, stack) !== false;
      }
      return true;
    });
  });
}

/**
 * Determine if some predicate holds true for every space surrounding a
 * coordinate.
 *
 * @param board A game board.
 * @param coordinate The coordinate whose neighbors will be tested.
 * @param predicate A predicate to test.
 * @return true if predicate evalutes to true for every neighbor, false otherwise.
 */
export function everyNeighbor(
  board: GameBoard,
  coordinate: HexCoordinate,
  predicate: SpaceFn
): boolean {
  return eachNeighboringSpace(
    board,
    coordinate,
    (neighbor, space) => predicate(neighbor, space) === true
  );
}

/**
 * Find the first neighboring hex coordinate for which a predicate holds true.
 *
 * @param board A game board.
 * @param coordinate The coordinate whose neighbors will be searched.
 * @param predicate The predicate to test on each neighbor.
 * @return the first hex coordinate for which predicate returns true or undefined
 * if the predicate never evaluates to true.
 */
export function findNeighborCoordinate(
  board: GameBoard,
  coordinate: HexCoordinate,
  predicate: SpaceFn
): HexCoordinate | undefined {
  let result: HexCoordinate | undefined;
  eachNeighboringSpace(board, coordinate, (neighbor, stack) => {
    if (predicate(neighbor, stack)) {
      result = neighbor;
      return false;
    }
    return true;
  });
  return result;
}

/**
 * Find the hex coordinate locations of a tile on a game board.
 *
 * Note that this function searches complete stacks, not just the tops of
 * stacks.
 *
 * @param board The game board to search.
 * @param tileId The tile id to search for.
 * @return The locations of the tile on the board.
 */
export function findTileCoordinates(
  board: GameBoard,
  tileId: TileId
): HexCoordinate[] {
  const coordinates: HexCoordinate[] = [];
  eachStack(board, (coordinate, stack) => {
    if (stack.includes(tileId)) {
      coordinates.push(coordinate);
    }
  });
  return coordinates;
}

/**
 * Generate a game board from a sequence of moves, optionally up to but not
 * including a certain move index.
 *
 * @param moves An array of moves.
 * @param upTo The move index up to which the board will be generated.
 */
export function gameBoard(moves: Move[], upTo?: number): GameBoard {
  const board: GameBoard = {};
  upTo = upTo ?? moves.length;
  moves.slice(0, upTo).forEach((move) => {
    if (isMovePass(move)) {
      return;
    }
    if (isMovePlacement(move)) {
      placeTile(board, move.tileId, move.to);
    }
    if (isMoveMovement(move)) {
      moveTile(board, move.from, move.to);
    }
  });
  return board;
}

/**
 * Get the total number of tiles on the board, optionally of a specified color
 * and/or bug.
 *
 * @param board A game board.
 * @param color The color tile to count.
 * @param bug The bug type to count.
 * @return The number of total tiles on the board if no color or bug was
 * provided, otherwise the number of tiles of the given color/bug.
 */
export function getNumTiles(
  board: GameBoard,
  color?: Color,
  bug?: Bug
): number {
  let count = 0;
  eachStack(board, (_, stack) => {
    if (!color && !bug) {
      count += stack.length;
    } else {
      stack.forEach((tileId) => {
        const sameColor =
          color !== undefined ? getTileColor(tileId) === color : true;
        const sameBug = bug !== undefined ? getTileBug(tileId) === bug : true;
        if (sameColor && sameBug) count += 1;
      });
    }
  });
  return count;
}

/**
 * Get an array of all occupied hex coordinates on a game board.
 *
 * @param board A game board.
 * @return An array of coordinates that contain tile stacks.
 */
export function getOccupiedCoordinates(board: GameBoard): HexCoordinate[] {
  const coordinates: HexCoordinate[] = [];
  eachStack(board, (coordinate) => coordinates.push(coordinate));
  return coordinates;
}

/**
 * Get an array of all occupied hex coordinates surrounding a given coordinate.
 *
 * @param board A game board.
 * @param coordinate The coordinate whose neighbors will be searched.
 * @return An array of coordinate surrounding the given coordinate that are occupied.
 */
export function getOccupiedNeighbors(
  board: GameBoard,
  coordinate: HexCoordinate
): HexCoordinate[] {
  const coordinates: HexCoordinate[] = [];
  eachNeighboringStack(board, coordinate, (neighbor) => {
    coordinates.push(neighbor);
  });
  return coordinates;
}

/**
 * Get the stack of tiles located at the given hex coordinate.
 *
 * @param board A game board
 * @param coordinate A hex coordinate
 * @return The tile stack at the given coordinate.
 */
export function getStack(
  board: GameBoard,
  coordinate: HexCoordinate
): TileId[] {
  const { q, r } = coordinate;
  const rs = board[q];
  return rs ? rs[r] ?? [] : [];
}

/**
 * Get the height of the stack located at the given hex coordinate.
 *
 * @param board The game board
 * @param coordinate The hex coordinate
 */
export function getStackHeight(
  board: GameBoard,
  coordinate: HexCoordinate
): number {
  return getStack(board, coordinate).length;
}

/**
 * Get the tile on top of the stack at the given coordinate.
 *
 * @param board The game board.
 * @param coordinate The hex coordinate.
 * @return The tile on top of that stack at the given coordinate if there is
 * one, otherwise undefined.
 */
export function getTileAt(
  board: GameBoard,
  coordinate: HexCoordinate
): TileId | undefined {
  return getStack(board, coordinate).pop();
}

/**
 * Get an array of all tile ids on a game board.
 *
 * @param board A game board
 * @return An array of all tile ids that are on the game board.
 */
export function getTiles(board: GameBoard): TileId[] {
  const tiles: TileId[] = [];
  eachStack(board, (_, ids) => tiles.push(...ids));
  return tiles;
}

/**
 * Get an array of all tiles on a game board.
 *
 * @param board A game board.
 * @return An array of all tiles that are on the game board.
 */
export function getTilesOnBoard(board: GameBoard): TileId[] {
  const tiles: TileId[] = [];
  eachStack(board, (_, ids) => tiles.push(...ids));
  return tiles;
}

/**
 * Get a list of the unoccupied coordinates touching the hive .
 *
 * @param board A game board.
 * @return An array of hex coordinates that are touching the hive and are not occupied by tiles.
 */
export function getUnoccupiedCoordinates(board: GameBoard): HexCoordinate[] {
  const visited = new Set<string>();
  const surr: HexCoordinate[] = [];
  getOccupiedCoordinates(board).forEach((coordinate) => {
    eachNeighboringSpace(board, coordinate, (neighbor, stack) => {
      const key = hexCoordinateKey(neighbor);
      if (!stack.length && !visited.has(key)) {
        visited.add(key);
        surr.push(neighbor);
      }
    });
  });
  return surr;
}

/**
 * Determine if a game board is empty.
 *
 * @param board A game board.
 * @return true if there are no tiles on the board, false otherwise.
 */
export function isBoardEmpty(board: GameBoard): boolean {
  return Object.keys(board).length === 0;
}

/**
 * Determine if there is a gate blocking movement (sliding or climbing) from the
 * given coordinate in the given direction.
 *
 * @param board A game board.
 * @param coordinate The source coordinate.
 * @param direction The direction of movement.
 */
export function isGated(
  board: GameBoard,
  coordinate: HexCoordinate,
  direction: number
): boolean {
  // Get the direction of the two neighboring coordinates
  const ldir = toHexDirection(direction - 1);
  const rdir = toHexDirection(direction + 1);

  // Get the destination and two neighboring coordinates.
  const dest = relativeHexCoordinate(coordinate, direction);
  const left = relativeHexCoordinate(coordinate, ldir);
  const rght = relativeHexCoordinate(coordinate, rdir);

  // Get the stack heights for the four coordinates in question
  const srcHeight = getStackHeight(board, coordinate);
  const destHeight = getStackHeight(board, dest);
  const leftHeight = getStackHeight(board, left);
  const rghtHeight = getStackHeight(board, rght);

  return (
    srcHeight <= leftHeight &&
    srcHeight <= rghtHeight &&
    destHeight < leftHeight &&
    destHeight < rghtHeight
  );
}

/**
 * Determine if there is at least one tile placed at the given coordinate.
 *
 * @param board A game board.
 * @param coordinate A hex coordinate.
 * @return true if there is at least one tile at the given coordinate, false
 * otherwise.
 */
export function isSpaceOccupied(
  board: GameBoard,
  coordinate: HexCoordinate
): boolean {
  return getStack(board, coordinate).length > 0;
}

/**
 * Move the tile at the top of the `from` coordinate to the top of the `to`
 * coordinate.
 *
 * @param board A game board.
 * @param from The hex coordinate of the tile to move.
 * @param to The hex coordinate where the tile will be placed.
 */
export function moveTile(
  board: GameBoard,
  from: HexCoordinate,
  to: HexCoordinate
) {
  placeTile(board, popTile(board, from), to);
}

/**
 * Place a tile on top of the stack located at the given hex coordinate.
 *
 * @param board A game board.
 * @param tileId The tile to place at `coordinate`.
 * @param coordinate The location where `tileId` will be placed.
 */
export function placeTile(
  board: GameBoard,
  tileId: TileId,
  coordinate: HexCoordinate
) {
  const { q, r } = coordinate;
  if (!(q in board)) board[q] = {};
  if (!(r in board[q])) board[q][r] = [];
  board[q][r].push(tileId);
}

/**
 * Remove the tile at the top of the stack at the given hex coordinate. If there
 * is no tile at the given coordinate, an error is thrown.
 *
 * @param board A game board.
 * @param coordinate The coordinate from which a tile will be popped.
 * @return The tile on top of the stack at the given coordinate.
 * @throws {@link NoTileAtCoordinateError}
 * Thrown if there are no tiles at `coordinate`.
 */
export function popTile(board: GameBoard, coordinate: HexCoordinate): TileId {
  const { q, r } = coordinate;
  const stack = board[q]?.[r] || [];
  const tileId = stack.pop();
  if (!tileId) throw new NoTileAtCoordinateError(coordinate);
  if (stack.length === 0) delete board[q][r];
  if (Object.keys(board[q]).length === 0) delete board[q];
  return tileId;
}

/**
 * Determine if there is some space neighboring the given space for which the
 * given predicate holds true.
 *
 * @param board A game board.
 * @param coordinate The coordinate whose neighbors will be tested.
 * @param iteratee The predicate function called for neighbors.
 * @return true if the predicate evaluates to true for any neighbor, false otherwise.
 */
export function someNeighboringSpace(
  board: GameBoard,
  coordinate: HexCoordinate,
  iteratee: NeighborFn
): boolean {
  return !eachNeighboringSpace(
    board,
    coordinate,
    (neighbor, stack, direction) => {
      return !iteratee(neighbor, stack, direction);
    }
  );
}

/**
 * Visit every stack on the board, beginning at the provided starting coordiante
 * and recursively visiting neighbors. Each stack will be visited exactly once
 * assuming that the hive is not broken. Including the `omit` coordinate will
 * cause the walk to treat that coordinate as if it were empty; this is useful
 * for determining whether moving a tile breaks the one-hive rule.
 *
 * @param board The game board.
 * @param start The starting coordinate.
 * @param omit A coordinate to treat as empty.
 * @return The sequence of visited hex coordinates.
 */
export function walkBoard(
  board: GameBoard,
  start: HexCoordinate,
  omit?: HexCoordinate
): HexCoordinate[] {
  const visited = new Set<string>();
  const path: HexCoordinate[] = [];
  const visit = (coordinate: HexCoordinate) => {
    visited.add(hexCoordinateKey(coordinate));
    path.push(coordinate);
    eachNeighboringStack(board, coordinate, (neighbor) => {
      if (
        !hexesEqual(omit, neighbor) &&
        !visited.has(hexCoordinateKey(neighbor))
      ) {
        visit(neighbor);
      }
    });
  };
  const startStack = getStack(board, start);
  if (startStack.length && !hexesEqual(start, omit)) {
    visit(start);
  }
  return path;
}
