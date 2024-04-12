import {
  BugId,
  Color,
  DirectionFn,
  GameBoard,
  GameConfig,
  HexCoordinate,
  HexStack,
  Move,
  NeighborFn,
  StackFn,
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
import { produce } from 'immer';

/**
 * Determine if all queens of the given color are on the board.
 *
 * @param board - A game board.
 * @param color - The color queen to look for.
 * @param config - The game config.
 * @returns true if the number of queens of the given color on the board is
 * equal to the number of queens in the game config, false otherwise.
 *
 * @beta
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
 * @param board - A game board.
 * @param color - The color queen to look for.
 * @returns true if all six coordinates surrounding each queen of the given
 * color on the board is occupied, false otherwise. Returns true if there are no
 * queens of the given color on the board.
 *
 * @beta
 */
export function allQueensSurrounded(board: GameBoard, color: Color): boolean {
  const queenCoordinates = findTileCoordinates(board, `${color}Q`);
  return queenCoordinates.every((queenCoordinate) => {
    return everyNeighboringCoordinate(
      board,
      queenCoordinate,
      (_, stack) => stack.length > 0
    );
  });
}

/**
 * Generate a function that applies a sequence of changes to a game board.
 *
 * @remarks
 * This is a utility function that simplifies moving multiple tiles around a game
 * board. A sequence of callbacks generated by `popTile` and `placeTile` can be
 * passed into this function to reduce that sequence to a single function call.
 * This is particularly useful in contexts such as React and Solid where a
 * state setter's parameter can be a callback function.
 *
 * @example
 * For example, a game board stored in a Solid signal can be updated using:
 * ```ts
 * const [board, setBoard] = createSignal({});
 * setBoard(
 *  chainBoardChanges(
 *    placeTile('wQ', { q: 0, r: 0 }),
 *    placeTile('bQ', { q: 0, r: 1 }),
 *    popTile({ q: 0, r: 0 }),
 *    placeTile('wQ', { q: 1, r: 0 })
 *  )
 * );
 * ```
 *
 * @param fns - A sequence of functions that each apply a change to a game board.
 * @returns A function that when called, applies the sequence of changes to the
 * provided game board parameter.
 *
 * @beta
 */
export function chainBoardChanges(
  ...fns: ((board: GameBoard) => GameBoard)[]
): (board: GameBoard) => GameBoard {
  return (board: GameBoard) => fns.reduce((brd, fn) => fn(brd), board);
}

/**
 * Call iteratee for every neighboring stack onto which a tile could climb.
 *
 * @remarks
 * The following conditions must be met for a tile to be able to climb onto a
 * neighboring stack (and are checked by this iterator):
 *  - The height of the destination stack must be equal to or greater than the
 *    height of the source stack.
 *  - There must not be a gate between the source and destination coordinates.
 *
 *  Iteratee functions may exit iteration early by explicitly returning false.
 *
 * @param board - A game board.
 * @param coordinate - The coordinate whose neighbors will be iterated over.
 * @param iteratee - The function invoked per iteration.
 * @returns false if the iteration ended early, true otherwise. If there is no
 * stack at the given coordinate, true is returned.
 *
 * @beta
 *
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
 * Call iteratee for each of the six hex direction values (1 through 6).
 *
 * @remarks
 * The iteratee is invoked with one argument, the direction value. Iteratee
 * functions may exit iteration early by explicitly returning false.
 *
 * @param iteratee - The function invoked per iteration.
 * @returns false if iteration ended early, true otherwise.
 *
 * @beta
 */
export function eachDirection(iteratee: DirectionFn): boolean {
  for (let i = 1; i <= 6; ++i) {
    if (iteratee(i) == false) return false;
  }
  return true;
}

/**
 * Call iteratee for every neighboring coordinate into which a tile could drop.
 *
 * @remarks
 * The following conditions must be met for a tile to be able to drop into a
 * neighboring coordinate (and are checked by this iterator):
 *  - The height of the source stack must be at least two greater than the
 *    height of the destination stack.
 *  - There must not be a gate between the source and destination coordinates.
 *
 *  Iteratee functions may exit iteration early by explicitly returning false.
 *
 * @param board - A game board.
 * @param coordinate - The coordinate whose neighbors will be iterated over.
 * @param iteratee - The function invoked per iteration.
 * @returns false if the iteration ended early, true otherwise. If there is no
 * stack at the given coordinate, true is returned.
 *
 * @beta
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
 * Call iteratee for every neighboring coordinate.
 *
 * @remarks
 * The iteratee is invoked with two arguments: *(coordinate, stack)*. Iteratee
 * functions may exit iteration early by explicitly returning false.
 *
 * @param board - The game board.
 * @param coordinate - The coordinate whose neighboring coordinates will be
 * iterated over.
 * @param iteratee - The function invoked per iteration.
 * @returns false if iteration ended early, true otherwise.
 *
 * @beta
 */
export function eachNeighboringCoordinate(
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
 * Call iteratee for every neighboring coordinate that contains a tile stack.
 *
 * @remarks
 * The iteratee is invoked with two arguments: *(coordinate, stack)*. Iteratee
 * functions may exit iteration early by explicitly returning false.
 *
 * @param board - The game board.
 * @param coordinate - The coordinate whose neighboring stacks will be iterated over.
 * @param iteratee - The function invoked per iteration.
 * @returns false if iteration ended early, true otherwise.
 *
 * @beta
 */
export function eachNeighboringStack(
  board: GameBoard,
  coordinate: HexCoordinate,
  iteratee: StackFn
): boolean {
  return eachDirection((direction) => {
    const neighbor = relativeHexCoordinate(coordinate, direction);
    const stack = getStack(board, neighbor);
    return stack.length ? iteratee(neighbor, stack) !== false : true;
  });
}

/**
 * Call iteratee for every neighboring coordinate into which a tile could slide.
 *
 * @remarks
 * The following conditions must be met for a tile to be able to slide into a
 * neighboring coordinate (and are checked by this iterator):
 *  - The height of the source coordinate stack must be exactly one greater than
 *    the height of the destination coordinate stack.
 *  - There must not be a gate between the source and destination coordinates.
 *  - The source and destination coordinates must share an occupied neighbor, OR;
 *  - The source and destination coordinates must both have stack heights
 *    greater than one.
 *
 *  Iteratee functions may exit iteration early by explicitly returning false.
 *
 * @param board - A game board.
 * @param coordinate - The coordinate whose neighbors will be iterated over.
 * @param iteratee - The function invoked per iteration.
 * @returns false if iteration ended early, true otherwise. If there is no stack
 * at the given coordinate, true is returned.
 *
 * @beta
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
  return eachNeighboringCoordinate(
    board,
    coordinate,
    (neighbor, neighborStack, direction) => {
      return stack.length - neighborStack.length === 1 &&
        !isGated(board, coordinate, direction) &&
        (stack.length > 1 ||
          someNeighboringCoordinate(board, neighbor, isOccupiedNeighbor))
        ? iteratee(neighbor, neighborStack, direction)
        : true;
    }
  );
}

/**
 * Call iteratee for every coordinate on the game board that contains tiles.
 *
 * @remarks
 * The iteratee is invoked with a hex coordinate and the stack located at that
 * coordinate. Iteratee functions may exit iteration early by returning false.
 *
 * @param board - The game board to iterate over.
 * @param iteratee - The function invoked per iteration.
 * @returns false if iteration ended early, true otherwise.
 *
 * @beta
 */
export function eachStack(board: GameBoard, iteratee: StackFn): boolean {
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
 * Call iteratee for every unoccupied coordinate that is adjacent to an occupied
 * coordinate on a board.
 *
 * @remarks
 * Each coordinate will only be visited once. Iteratee functions may exit
 * iteration early by explicitly returning false.
 *
 * @param board - A game board.
 * @param iteratee - The function invoked per iteration.
 * @returns false if iteration ended early, true otherwise.
 *
 * @beta
 */
export function eachUnoccupiedCoordinate(
  board: GameBoard,
  iteratee: StackFn
): boolean {
  const visited = new Set<string>();
  return eachStack(board, (coordinate) => {
    return eachNeighboringCoordinate(board, coordinate, (neighbor, stack) => {
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
 * Determine if some predicate holds true for every coordinate surrounding a
 * specified coordinate.
 *
 * @param board - A game board.
 * @param coordinate - The coordinate whose neighbors will be tested.
 * @param predicate - A predicate to test.
 * @returns true if predicate evalutes to true for every neighbor, false otherwise.
 *
 * @beta
 */
export function everyNeighboringCoordinate(
  board: GameBoard,
  coordinate: HexCoordinate,
  predicate: StackFn
): boolean {
  return eachNeighboringCoordinate(
    board,
    coordinate,
    (neighbor, stack) => predicate(neighbor, stack) === true
  );
}

/**
 * Find the first neighboring hex coordinate for which a predicate holds true.
 *
 * @remarks
 * No guarantees are made regarding which neighboring coordinate is returned if
 * predicate evaluates to true for multiple neighboring coordinates.
 *
 * @param board - A game board.
 * @param coordinate - The coordinate whose neighbors will be searched.
 * @param predicate - The predicate to test on each neighbor.
 * @returns the first hex coordinate for which predicate returns true or undefined
 * if the predicate never evaluates to true.
 *
 * @beta
 */
export function findNeighborCoordinate(
  board: GameBoard,
  coordinate: HexCoordinate,
  predicate: StackFn
): HexCoordinate | undefined {
  let result: HexCoordinate | undefined;
  eachNeighboringCoordinate(board, coordinate, (neighbor, stack) => {
    if (predicate(neighbor, stack)) {
      result = neighbor;
      return false;
    }
    return true;
  });
  return result;
}

/**
 * Find the locations of a tile.
 *
 * @remarks
 * If more than one of the tile are in the same stack, the stack's coorindate
 * will only be included once.
 *
 * @param board - The game board to search.
 * @param tileId - The tile id to search for.
 * @returns The locations of the tile on the board.
 *
 * @beta
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
 * @param moves - An array of moves.
 * @param upTo - The move index up to which the board will be generated.
 * @returns A game board
 *
 * @beta
 */
export function gameBoard(moves: Move[], upTo?: number): GameBoard {
  const board: GameBoard = {};
  upTo = upTo ?? moves.length;
  moves.slice(0, upTo).forEach((move) => {
    if (isMovePass(move)) {
      return;
    }
    if (isMovePlacement(move)) {
      _placeTileMutate(board, move.tileId, move.to);
    }
    if (isMoveMovement(move)) {
      _moveTileMutate(board, move.from, move.to);
    }
  });
  return board;
}

/**
 * Get the total number of tiles on the board, optionally of a specified color
 * and/or bug.
 *
 * @param board - A game board.
 * @param color - The color tile to count.
 * @param bug - The bug type to count.
 * @returns The number of total tiles on the board if no color or bug was
 * provided, otherwise the number of tiles of the given color/bug.
 *
 * @beta
 */
export function getNumTiles(
  board: GameBoard,
  color?: Color,
  bug?: BugId
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
 * @param board - A game board.
 * @returns An array of coordinates that contain tile stacks.
 *
 * @beta
 */
export function getOccupiedCoordinates(board: GameBoard): HexCoordinate[] {
  const coordinates: HexCoordinate[] = [];
  eachStack(board, (coordinate) => coordinates.push(coordinate));
  return coordinates;
}

/**
 * Get an array of all occupied hex coordinates that are neighboring a given
 * coordinate.
 *
 * @param board - A game board.
 * @param coordinate - The coordinate whose neighbors will be searched.
 * @returns An array of coordinates.
 *
 * @beta
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
 * @remarks
 * If there is not stack at the given coordinate, an empty array is returned.
 *
 * @param board - A game board
 * @param coordinate - A hex coordinate
 * @returns The tile stack at the given coordinate.
 *
 * @beta
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
 * @param board - The game board
 * @param coordinate - The hex coordinate
 * @returns The height of the stack at the given coordinate.
 *
 * @beta
 */
export function getStackHeight(
  board: GameBoard,
  coordinate: HexCoordinate
): number {
  return getStack(board, coordinate).length;
}

/**
 * Get an array of all stacks on a board, optionally sorting for rendering.
 *
 * @remarks
 * When sorted for rendering, stacks in the returned array are ordered from back
 * to front, shortest to tallest.
 *
 * @param board - A game board.
 * @param sortForRender - Flag indicating tiles should be sorted for rendering.
 * @returns An array of stacks.
 *
 * @beta
 */
export function getStacks(
  board: GameBoard,
  sortForRender?: boolean
): HexStack[] {
  const stacks: HexStack[] = [];
  eachStack(board, (coordinate, tiles) => stacks.push({ coordinate, tiles }));
  if (sortForRender) renderSort(stacks);
  return stacks;
}

/**
 * Get the tile on top of the stack at the given coordinate.
 *
 * @param board - The game board.
 * @param coordinate - The hex coordinate.
 * @returns The tile on top of that stack at the given coordinate if there is
 * one, otherwise undefined.
 *
 * @beta
 */
export function getTileAt(
  board: GameBoard,
  coordinate: HexCoordinate
): TileId | undefined {
  return getStack(board, coordinate).at(-1);
}

/**
 * Get an array of all tiles on a game board.
 *
 * @param board - A game board.
 * @returns An array of all tiles that are on the game board.
 *
 * @beta
 */
export function getTilesOnBoard(board: GameBoard): TileId[] {
  const tiles: TileId[] = [];
  eachStack(board, (_, ids) => tiles.push(...ids));
  return tiles;
}

/**
 * Get an array of the unoccupied coordinates touching the hive.
 *
 * @param board - A game board.
 * @returns An array of hex coordinates that are touching the hive and do not
 * contain tiles.
 *
 * @beta
 */
export function getUnoccupiedCoordinates(board: GameBoard): HexCoordinate[] {
  const visited = new Set<string>();
  const surr: HexCoordinate[] = [];
  getOccupiedCoordinates(board).forEach((coordinate) => {
    eachNeighboringCoordinate(board, coordinate, (neighbor, stack) => {
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
 * @param board - A game board.
 * @returns true if there are no tiles on the board, false otherwise.
 *
 * @beta
 */
export function isBoardEmpty(board: GameBoard): boolean {
  return Object.keys(board).length === 0;
}

/**
 * Determine if there is at least one tile at the given coordinate.
 *
 * @param board - A game board.
 * @param coordinate - A hex coordinate.
 * @returns true if there is at least one tile at the given coordinate, false
 * otherwise.
 *
 * @beta
 */
export function isCoordinateOccupied(
  board: GameBoard,
  coordinate: HexCoordinate
): boolean {
  return getStack(board, coordinate).length > 0;
}

/**
 * Determine if there is a gate blocking movement (sliding, climbing, or
 * dropping) of the tile at the given coordinate in the given direction.
 *
 * @param board - A game board.
 * @param coordinate - The source coordinate.
 * @param direction - The direction of movement.
 * @returns true if there is a gate blocking movement, false otherwise.
 *
 * @beta
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
 * Move a tile on a board to a new location.
 *
 * @remarks
 * This function does not mutate the provided board. Rather, it applies the move
 * to a copy of the board. Internally the copy of the board is created using
 * {@link https://developer.mozilla.org/en-US/docs/Web/API/structuredClone | structuredClone}.
 *
 * @param board - A game board.
 * @param from - The hex coordinate of the tile to move.
 * @param to - The hex coordinate where the tile will be placed.
 * @returns A new game board with the move applied.
 *
 * @throws {@link NoTileAtCoordinateError}
 * Throws if there is no tile located at the specified `from` coordinate.
 *
 * @beta
 */
export function moveTile(
  board: GameBoard,
  from: HexCoordinate,
  to: HexCoordinate
): GameBoard {
  const clone = structuredClone(board);
  return _moveTileMutate(clone, from, to);
}

/**
 * Place a tile on a board.
 *
 * @remarks
 * This function does not mutate the provided board. Rather, it places the tile
 * on a copy of the board. Internally the copy of the board is created using
 * {@link https://developer.mozilla.org/en-US/docs/Web/API/structuredClone | structuredClone}.
 *
 * @param board - A game board.
 * @param tileId - The tile to place.
 * @param coordinate - The coordinate where the tile will be placed.
 * @returns A new game board with the tile placed at the specified coordinate.
 *
 * @beta
 */
export function placeTile(
  board: GameBoard,
  tileId: TileId,
  coordinate: HexCoordinate
): GameBoard;

/**
 * Create a function that places a tile on a board.
 *
 * @param tileId - The tile that the returned function will place.
 * @param coordinate - The coordinate where the returned function will place the
 * tile.
 * @returns A function that takes a game board as a parameter; when called, the
 * function will place `tileId` at `coordinate` on the board.
 *
 * @beta
 */
export function placeTile(
  tileId: TileId,
  coordinate: HexCoordinate
): (board: GameBoard) => GameBoard;

/**
 * Place a tile on a board.
 *
 * @beta
 */
export function placeTile(
  boardOrTileId: GameBoard | TileId,
  tileIdOrCoordinate: TileId | HexCoordinate,
  coordinate?: HexCoordinate
): GameBoard | ((board: GameBoard) => GameBoard) {
  // return a function that will do the tile placement
  if (arguments.length === 2) {
    return (board: GameBoard) =>
      placeTile(
        board,
        boardOrTileId as TileId,
        tileIdOrCoordinate as HexCoordinate
      );
  }

  // clone the board and do the tile placement
  const clone = structuredClone(boardOrTileId as GameBoard);
  return _placeTileMutate(
    clone,
    tileIdOrCoordinate as TileId,
    coordinate as HexCoordinate
  );
}

/**
 * Remove a tile from a board.
 *
 * @remarks
 * This function does not mutate the provided board. Rather, it removes the tile
 * from a copy of the board. Internally the copy of the board is created using
 * {@link https://developer.mozilla.org/en-US/docs/Web/API/structuredClone | structuredClone}.
 *
 * @param board - A game board.
 * @param coordinate - The coordinate from which the tile will be removed.
 * @returns A new game board with the tile at the specified coordinate removed.
 *
 * @throws {@link NoTileAtCoordinateError}
 * Throws if there is no tile at `coordinate`.
 *
 * @beta
 */
export function popTile(board: GameBoard, coordinate: HexCoordinate): GameBoard;

/**
 * Create a function that removes a tile from a board.
 *
 * @param coordinate - The coordinate from which the tile will be removed.
 * @returns A function that takes a game board as a parameter; when called, the
 * function will remove the tile at `coordinate` from the board. The function
 * will throw {@link NoTileAtCoordinateError} if there is no tile at
 * `coordinate`.
 *
 * @beta
 */
export function popTile(
  coordinate: HexCoordinate
): (board: GameBoard) => GameBoard;

/**
 * Remove a tile from a board.
 *
 * @beta
 */
export function popTile(
  boardOrCoordinate: GameBoard | HexCoordinate,
  coordinate?: HexCoordinate
): GameBoard | ((board: GameBoard) => GameBoard) {
  // return a function that will do the tile popping
  if (arguments.length === 1) {
    return (board: GameBoard) => {
      return popTile(board, boardOrCoordinate as HexCoordinate);
    };
  }

  // clone the board and pop the tile
  const clone = structuredClone(boardOrCoordinate as GameBoard);
  return _popTileMutate(clone, coordinate as HexCoordinate);
}

/**
 * Sort stacks of tiles so that they are ordered from back to front, shortest
 * to tallest.
 *
 * @param stacks - An array of stacks.
 * @returns A sorted copy of the array of stacks.
 *
 * @beta
 */
export function renderSort(stacks: HexStack[]): HexStack[] {
  return stacks.slice().sort((a, b) => {
    const dr = b.coordinate.r - a.coordinate.r;
    if (dr < 0) return 1;
    if (dr === 0) return a.tiles.length - b.tiles.length;
    return -1;
  });
}

/**
 * Determine if there is some coordinate neighboring the given coordinate for
 * which the given predicate holds true.
 *
 * @param board - A game board.
 * @param coordinate - The coordinate whose neighbors will be tested.
 * @param iteratee - The predicate function called for neighbors.
 * @returns true if the predicate evaluates to true for any neighbor, false otherwise.
 *
 * @beta
 */
export function someNeighboringCoordinate(
  board: GameBoard,
  coordinate: HexCoordinate,
  iteratee: NeighborFn
): boolean {
  return !eachNeighboringCoordinate(
    board,
    coordinate,
    (neighbor, stack, direction) => {
      return !iteratee(neighbor, stack, direction);
    }
  );
}

/**
 * Create a sequence of coordinates that represent walking the board, visiting
 * each occupied coordinate exactly once.
 *
 * @remarks
 * This function will visit every stack on the board by beginning at the
 * provided starting coordinate and recursively choosing an unvisited neighbor
 * to visit. Each occupied coordinate will be visited exactly once assuming that
 * the hive is not broken. If the `omit` coordinate is specified, that coordinate
 * will be treated as unoccupied; this is useful for determining whether moving
 * a tile breaks the one-hive rule.
 *
 * @param board - The game board.
 * @param start - The starting coordinate.
 * @param omit - A coordinate to treat as empty.
 * @returns The sequence of visited hex coordinates.
 *
 * @beta
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

/**
 * Mutate a game board object by moving the tile at the tope of `from` to the
 * top of `to`.
 *
 * @param board - A game board.
 * @param from - The hex coordinate of the tile to move.
 * @param to - The hex coordinate where the tile will be placed.
 *
 * @throws {@link NoTileAtCoordinateError}
 * Throws if there is no tile located at the specified `from` coordinate.
 *
 * @internal
 */
export function _moveTileMutate(
  board: GameBoard,
  from: HexCoordinate,
  to: HexCoordinate
): GameBoard {
  const tile = getTileAt(board, from);
  if (!tile) throw new NoTileAtCoordinateError(from);
  return _placeTileMutate(_popTileMutate(board, from), tile, to);
}

/**
 * Move a tile on the board to a new location.
 *
 * @remarks
 * This method uses Immer's `produce` to generate a new game board with the move
 * applied.
 *
 * @param board - A game board.
 * @param from - The hex coordinate of the tile to move.
 * @param to - The hex coordinate where the tile will be placed.
 * @returns A new game board with the move applied.
 *
 * @throws {@link NoTileAtCoordinateError}
 * Throws if there is no tile located at the specified `from` coordinate.
 *
 * @internal
 */
export function _moveTileProduce(
  board: GameBoard,
  from: HexCoordinate,
  to: HexCoordinate
) {
  return produce(board, (draft) => {
    _moveTileMutate(draft, from, to);
  });
}

/**
 * Mutate a game board object by placing a tile on the board.
 *
 * @param board - A game board.
 * @param tileId - The tile to place at `coordinate`.
 * @param coordinate - The location where `tileId` will be placed.
 * @returns The game board provided as the `board` parameter.
 *
 * @internal
 */
export function _placeTileMutate(
  board: GameBoard,
  tileId: TileId,
  coordinate: HexCoordinate
): GameBoard {
  const { q, r } = coordinate;
  if (!(q in board)) board[q] = {};
  if (!(r in board[q])) board[q][r] = [];
  board[q][r].push(tileId);
  return board;
}

/**
 * Place a tile on a board.
 *
 * @param board - A game board.
 * @param tileId - The tile to place at `coordinate`.
 * @param coordinate - The location where `tileId` will be placed.
 * @returns A new game board with the tile added.
 *
 * @internal
 */
export function _placeTileProduce(
  board: GameBoard,
  tileId: TileId,
  coordinate: HexCoordinate
): GameBoard {
  return produce(board, (draft) => {
    _placeTileMutate(draft, tileId, coordinate);
  });
}

/**
 * Mutate a game board object by removing a tile.
 *
 * @param board - A game board.
 * @param coordinate - The coordinate from which the tile will be removed.
 * @returns The game board provided as the `board` parameter.
 *
 * @throws {@link NoTileAtCoordinateError}
 * Throws if there is no tile at `coordinate`.
 *
 * @internal
 */
export function _popTileMutate(
  board: GameBoard,
  coordinate: HexCoordinate
): GameBoard {
  const { q, r } = coordinate;
  const stack = board[q]?.[r] || [];
  const tileId = stack.pop();
  if (!tileId) throw new NoTileAtCoordinateError(coordinate);
  if (stack.length === 0) delete board[q][r];
  if (Object.keys(board[q]).length === 0) delete board[q];
  return board;
}

/**
 * Remove a tile from a board.
 *
 * @param board - A game board.
 * @param coordinate - The coordinate from which a tile will be removed.
 * @returns A new game board with the tile removed.
 *
 * @throws {@link NoTileAtCoordinateError}
 * Throws if there is no tile at `coordinate`.
 *
 * @internal
 */
export function _popTileProduce(
  board: GameBoard,
  coordinate: HexCoordinate
): GameBoard {
  return produce(board, (draft) => _popTileMutate(draft, coordinate));
}
