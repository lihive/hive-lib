"use strict";
(() => {
  // src/move.ts
  function createMovePass() {
    return {
      pass: true
    };
  }
  function createTilePlacement(tileId, to) {
    return {
      tileId,
      to
    };
  }
  function createTileMovement(from, to) {
    return {
      from,
      to
    };
  }
  function getNextMoveColor(moves) {
    return moves.length % 2 ? "b" : "w";
  }
  function isMovePass(move) {
    return "pass" in move && move.pass;
  }
  function isMovePlacement(move) {
    return "tileId" in move && "to" in move;
  }
  function isMoveMovement(move) {
    return "from" in move && "to" in move;
  }
  function moveBreaksHive(board, coordinate) {
    if (getStackHeight(board, coordinate) > 1)
      return false;
    const neighbor = getOccupiedNeighbors(board, coordinate)[0];
    const walkedPath = walkBoard(board, neighbor, coordinate);
    const coordinates = getOccupiedCoordinates(board);
    return walkedPath.length !== coordinates.length;
  }

  // src/error.ts
  var CoordinatesNotAdjacentError = class extends Error {
    constructor(a, b) {
      super(`Tiles (${a.q},${a.r}) and (${b.q},${b.r}) are not adjacent.`);
    }
  };
  var InvalidDirectionError = class extends Error {
    constructor(direction) {
      super(`${direction} is not a valid direction.`);
    }
  };
  var NoTileAtCoordinateError = class extends Error {
    constructor(coordinate) {
      super(`No tile at (${coordinate.q}, ${coordinate.r})`);
    }
  };

  // src/hex.ts
  var SQRT3 = Math.sqrt(3);
  function cartesianToHex(coordinate, size) {
    const x = (SQRT3 / 3 * coordinate.x - 1 / 3 * coordinate.y) / size;
    const y = 2 / 3 * coordinate.y / size;
    const z = -x - y;
    let rx = Math.round(x);
    let ry = Math.round(y);
    let rz = Math.round(z);
    const xd = Math.abs(rx - x);
    const yd = Math.abs(ry - y);
    const zd = Math.abs(rz - z);
    if (xd > yd && xd > zd)
      rx = -ry - rz;
    else if (yd > zd)
      ry = -rx - rz;
    return {
      q: rx,
      r: ry
    };
  }
  function hexCoordinateKey(coordinate) {
    return `${coordinate.q}${coordinate.r}`;
  }
  function hexesAreNeighbors(a, b) {
    return Math.abs(a.q - b.q) <= 1 && Math.abs(a.r - b.r) <= 1;
  }
  function hexesEqual(a, b) {
    if (!a || !b)
      return false;
    return a.q === b.q && a.r === b.r;
  }
  function hexHeight(hexSize) {
    return 2 * hexSize;
  }
  function hexToCartesian(coordinate, size) {
    const { q, r } = coordinate;
    return {
      x: size * (SQRT3 * q + SQRT3 / 2 * r),
      y: size * (3 / 2 * r)
    };
  }
  function hexToTransform(coordinate, size) {
    const { x, y } = hexToCartesian(coordinate, size);
    return `translate(${x} ${y})`;
  }
  function hexWidth(hexSize) {
    return SQRT3 * hexSize;
  }
  function includesHex(hexes, hex) {
    return hexes.findIndex((curr) => hexesEqual(hex, curr)) !== -1;
  }
  function relativeHexCoordinate(coordinate, direction) {
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
  function relativeHexDirection(source, target) {
    const dq = target.q - source.q;
    const dr = target.r - source.r;
    if (dq === -1) {
      if (dr === 0)
        return 5;
      if (dr === 1)
        return 4;
    }
    if (dq === 0) {
      if (dr === -1)
        return 6;
      if (dr === 1)
        return 3;
    }
    if (dq === 1) {
      if (dr === -1)
        return 1;
      if (dr === 0)
        return 2;
    }
    throw new CoordinatesNotAdjacentError(source, target);
  }
  function toHexDirection(number) {
    while (number < 1)
      number += 6;
    return 1 + (number - 1) % 6;
  }

  // src/tile.ts
  function tile(color, tileId) {
    return `${color}${tileId}`;
  }
  function getTileBug(tileId) {
    return tileId[1];
  }
  function getTileColor(tileId) {
    return tileId[0];
  }
  function isOwnTile(tileId, player) {
    return getTileColor(tileId) === player;
  }

  // src/board.ts
  function allQueensPlaced(board, color, config) {
    let count = 0;
    const queenId = `${color}Q`;
    const queenCoordinates = findTileCoordinates(board, queenId);
    queenCoordinates.forEach((coordinate) => {
      getStack(board, coordinate).forEach((tileId) => {
        if (tileId === queenId)
          count += 1;
      });
    });
    return count === config.tileset.Q;
  }
  function allQueensSurrounded(board, color) {
    const queenCoordinates = findTileCoordinates(board, `${color}Q`);
    return queenCoordinates.every((queenCoordinate) => {
      return everyNeighbor(
        board,
        queenCoordinate,
        (_, stack) => stack.length > 0
      );
    });
  }
  function eachClimbDirection(board, coordinate, iteratee) {
    const stackHeight = getStackHeight(board, coordinate);
    if (!stackHeight)
      return true;
    return eachDirection((direction) => {
      const neighbor = relativeHexCoordinate(coordinate, direction);
      const neighborStack = getStack(board, neighbor);
      return neighborStack.length >= stackHeight && !isGated(board, coordinate, direction) ? iteratee(neighbor, neighborStack, direction) : true;
    });
  }
  function eachDirection(iteratee) {
    for (let i = 1; i <= 6; ++i) {
      if (iteratee(i) == false)
        return false;
    }
    return true;
  }
  function eachDropDirection(board, coordinate, iteratee) {
    const stackHeight = getStackHeight(board, coordinate);
    if (!stackHeight)
      return true;
    return eachDirection((direction) => {
      const neighbor = relativeHexCoordinate(coordinate, direction);
      const neighborStack = getStack(board, neighbor);
      return stackHeight - neighborStack.length >= 2 && !isGated(board, coordinate, direction) ? iteratee(neighbor, neighborStack, direction) : true;
    });
  }
  function eachNeighboringSpace(board, coordinate, iteratee) {
    return eachDirection((direction) => {
      const neighbor = relativeHexCoordinate(coordinate, direction);
      return iteratee(neighbor, getStack(board, neighbor), direction) !== false;
    });
  }
  function eachNeighboringStack(board, coordinate, iteratee) {
    return eachDirection((direction) => {
      const neighbor = relativeHexCoordinate(coordinate, direction);
      const stack = getStack(board, neighbor);
      return stack.length ? iteratee(neighbor, stack) !== false : true;
    });
  }
  function eachSlideDirection(board, coordinate, iteratee) {
    const stack = getStack(board, coordinate);
    const neighbors = getOccupiedNeighbors(board, coordinate);
    const isOccupiedNeighbor = (coordinate2) => includesHex(neighbors, coordinate2);
    if (!stack)
      return true;
    return eachNeighboringSpace(
      board,
      coordinate,
      (neighbor, neighborStack, direction) => {
        return stack.length - neighborStack.length === 1 && !isGated(board, coordinate, direction) && (stack.length > 1 || someNeighboringSpace(board, neighbor, isOccupiedNeighbor)) ? iteratee(neighbor, neighborStack, direction) : true;
      }
    );
  }
  function eachStack(board, iteratee) {
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
  function eachUnoccupiedCoordinate(board, iteratee) {
    const visited = /* @__PURE__ */ new Set();
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
  function everyNeighbor(board, coordinate, predicate) {
    return eachNeighboringSpace(
      board,
      coordinate,
      (neighbor, space) => predicate(neighbor, space) === true
    );
  }
  function findNeighborCoordinate(board, coordinate, predicate) {
    let result;
    eachNeighboringSpace(board, coordinate, (neighbor, stack) => {
      if (predicate(neighbor, stack)) {
        result = neighbor;
        return false;
      }
      return true;
    });
    return result;
  }
  function findTileCoordinates(board, tileId) {
    const coordinates = [];
    eachStack(board, (coordinate, stack) => {
      if (stack.includes(tileId)) {
        coordinates.push(coordinate);
      }
    });
    return coordinates;
  }
  function gameBoard(moves, upTo) {
    const board = {};
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
  function getNumTiles(board, color, bug) {
    let count = 0;
    eachStack(board, (_, stack) => {
      if (!color && !bug) {
        count += stack.length;
      } else {
        stack.forEach((tileId) => {
          const sameColor = color !== void 0 ? getTileColor(tileId) === color : true;
          const sameBug = bug !== void 0 ? getTileBug(tileId) === bug : true;
          if (sameColor && sameBug)
            count += 1;
        });
      }
    });
    return count;
  }
  function getOccupiedCoordinates(board) {
    const coordinates = [];
    eachStack(board, (coordinate) => coordinates.push(coordinate));
    return coordinates;
  }
  function getOccupiedNeighbors(board, coordinate) {
    const coordinates = [];
    eachNeighboringStack(board, coordinate, (neighbor) => {
      coordinates.push(neighbor);
    });
    return coordinates;
  }
  function getStack(board, coordinate) {
    const { q, r } = coordinate;
    const rs = board[q];
    return rs ? rs[r] ?? [] : [];
  }
  function getStackHeight(board, coordinate) {
    return getStack(board, coordinate).length;
  }
  function getTileAt(board, coordinate) {
    return getStack(board, coordinate).pop();
  }
  function getTiles(board) {
    const tiles = [];
    eachStack(board, (_, ids) => tiles.push(...ids));
    return tiles;
  }
  function getTilesOnBoard(board) {
    const tiles = [];
    eachStack(board, (_, ids) => tiles.push(...ids));
    return tiles;
  }
  function getUnoccupiedCoordinates(board) {
    const visited = /* @__PURE__ */ new Set();
    const surr = [];
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
  function isBoardEmpty(board) {
    return Object.keys(board).length === 0;
  }
  function isGated(board, coordinate, direction) {
    const ldir = toHexDirection(direction - 1);
    const rdir = toHexDirection(direction + 1);
    const dest = relativeHexCoordinate(coordinate, direction);
    const left = relativeHexCoordinate(coordinate, ldir);
    const rght = relativeHexCoordinate(coordinate, rdir);
    const srcHeight = getStackHeight(board, coordinate);
    const destHeight = getStackHeight(board, dest);
    const leftHeight = getStackHeight(board, left);
    const rghtHeight = getStackHeight(board, rght);
    return srcHeight <= leftHeight && srcHeight <= rghtHeight && destHeight < leftHeight && destHeight < rghtHeight;
  }
  function isSpaceOccupied(board, coordinate) {
    return getStack(board, coordinate).length > 0;
  }
  function moveTile(board, from, to) {
    placeTile(board, popTile(board, from), to);
  }
  function placeTile(board, tileId, coordinate) {
    const { q, r } = coordinate;
    if (!(q in board))
      board[q] = {};
    if (!(r in board[q]))
      board[q][r] = [];
    board[q][r].push(tileId);
  }
  function popTile(board, coordinate) {
    const { q, r } = coordinate;
    const stack = board[q]?.[r] || [];
    const tileId = stack.pop();
    if (!tileId)
      throw new NoTileAtCoordinateError(coordinate);
    if (stack.length === 0)
      delete board[q][r];
    if (Object.keys(board[q]).length === 0)
      delete board[q];
    return tileId;
  }
  function someNeighboringSpace(board, coordinate, iteratee) {
    return !eachNeighboringSpace(
      board,
      coordinate,
      (neighbor, stack, direction) => {
        return !iteratee(neighbor, stack, direction);
      }
    );
  }
  function walkBoard(board, start, omit) {
    const visited = /* @__PURE__ */ new Set();
    const path = [];
    const visit = (coordinate) => {
      visited.add(hexCoordinateKey(coordinate));
      path.push(coordinate);
      eachNeighboringStack(board, coordinate, (neighbor) => {
        if (!hexesEqual(omit, neighbor) && !visited.has(hexCoordinateKey(neighbor))) {
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

  // src/constants.ts
  var BASE_GAME = {
    tileset: {
      A: 3,
      B: 2,
      G: 3,
      S: 2,
      Q: 1
    }
  };

  // src/ladybug.ts
  function isLadybug(tileId, color) {
    return getTileBug(tileId) === "L" && (color ? getTileColor(tileId) === color : true);
  }

  // src/mosquito.ts
  function isMosquito(tileId, color) {
    return getTileBug(tileId) === "M" && (color ? getTileColor(tileId) === color : true);
  }

  // src/notation.ts
  function gameNotation(moves) {
    return moves.map((move) => {
      if (isMovePass(move))
        return passNotation();
      if (isMovePlacement(move))
        return placementNotation(move.tileId, move.to);
      if (isMoveMovement(move))
        return movementNotation(move.from, move.to);
      return "";
    }).join();
  }
  function movementNotation(from, to) {
    return `(${from.q},${from.r})(${to.q},${to.r})`;
  }
  function passNotation() {
    return "x";
  }
  function placementNotation(tileId, coordinate) {
    return `(${coordinate.q},${coordinate.r})[${tileId}]`;
  }
  function parseGameNotation(notation) {
    function parseToken(token2) {
      if (token2[0] === "(") {
        const nums = token2.slice(1, -1).split(",");
        return {
          q: parseInt(nums[0]),
          r: parseInt(nums[1])
        };
      }
      if (token2[0] === "[") {
        return token2.slice(1, -1);
      }
      throw new Error(`Invalid token: ${token2}`);
    }
    const moves = [];
    let tokens = [];
    let move = "";
    let token = "";
    for (let i = 0, len = notation.length; i < len; ++i) {
      const char = notation[i];
      if (char === "#")
        break;
      if (char === "x") {
        moves.push({ pass: true });
        continue;
      }
      move += char;
      token += char;
      if (char === ")" || char === "]") {
        tokens.push(token);
        token = "";
      }
      if (tokens.length === 2) {
        const tokA = parseToken(tokens[0]);
        const tokB = parseToken(tokens[1]);
        if (typeof tokB === "string") {
          moves.push({
            tileId: tokB,
            to: tokA
          });
        } else {
          moves.push({
            from: tokA,
            to: tokB
          });
        }
        tokens = [];
        move = "";
      }
    }
    return moves;
  }

  // src/pillbug.ts
  function isPillbug(tileId, color) {
    return getTileBug(tileId) === "P" && (color ? getTileColor(tileId) === color : true);
  }
})();
