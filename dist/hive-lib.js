"use strict";
(() => {
  // src/error.ts
  var CoordinatesNotAdjacentError = class extends Error {
    constructor(a, b) {
      super(`Tiles (${a.q},${a.r}) and (${b.q},${b.r}) are not adjacent.`);
    }
  };
  var ExpectedTileAtCoordinateError = class extends Error {
    constructor(coordinate) {
      super(
        `Expected there to be a tile located at (${coordinate.q}, ${coordinate.r})`
      );
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

  // src/constants.ts
  var SQRT3 = Math.sqrt(3);
  var M_PI = Math.PI;
  var BASE_GAME = {
    tileset: {
      A: 3,
      B: 2,
      G: 3,
      S: 2,
      Q: 1
    }
  };
  var POINTY_TOP = {
    id: "pointy-top",
    f0: SQRT3,
    f1: SQRT3 / 2,
    f2: 0,
    f3: 3 / 2,
    b0: SQRT3 / 3,
    b1: -1 / 3,
    b2: 0,
    b3: 2 / 3,
    startAngle: 30
  };
  var FLAT_TOP = {
    id: "flat-top",
    f0: 3 / 2,
    f1: 0,
    f2: SQRT3 / 2,
    f3: SQRT3,
    b0: 2 / 3,
    b1: 0,
    b2: -1 / 3,
    b3: SQRT3 / 3,
    startAngle: 0
  };

  // src/hex.ts
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
  function hexToCartesian(coordinate, size, orientation) {
    const { q, r } = coordinate;
    const M = orientation;
    return {
      x: size * (M.f0 * q + M.f1 * r),
      y: size * (M.f2 * q + M.f3 * r)
    };
  }
  function hexToTransform(coordinate, size, orientation) {
    const { x, y } = hexToCartesian(coordinate, size, orientation);
    return `translate(${x} ${y}) rotate(${orientation.startAngle})`;
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
  function tile(color, bugId) {
    return `${color}${bugId}`;
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

  // src/beetle.ts
  function validBeetleMoves(board, coordinate) {
    if (moveBreaksHive(board, coordinate))
      return [];
    const valid = [];
    eachClimbDirection(board, coordinate, (neighbor) => {
      valid.push(neighbor);
    });
    eachSlideDirection(board, coordinate, (neighbor) => {
      valid.push(neighbor);
    });
    eachDropDirection(board, coordinate, (neighbor) => {
      valid.push(neighbor);
    });
    return valid;
  }

  // src/grasshopper.ts
  function validGrasshopperMoves(board, coordinate) {
    if (moveBreaksHive(board, coordinate))
      return [];
    const valid = [];
    eachDirection((direction) => {
      const neighbor = relativeHexCoordinate(coordinate, direction);
      let current2 = neighbor;
      while (isSpaceOccupied(board, current2)) {
        current2 = relativeHexCoordinate(current2, direction);
      }
      if (!hexesEqual(current2, neighbor)) {
        valid.push(current2);
      }
    });
    return valid;
  }

  // src/ladybug.ts
  function validLadybugMoves(board, coordinate) {
    if (moveBreaksHive(board, coordinate))
      return [];
    const valid = [];
    const visited = /* @__PURE__ */ new Set();
    const walk = (board2, path) => {
      const current2 = path[path.length - 1];
      if (path.length === 1) {
        eachClimbDirection(board2, current2, (neighbor) => {
          walk(moveTileProduce(board2, current2, neighbor), [...path, neighbor]);
        });
      }
      if (path.length === 2) {
        eachSlideDirection(board2, current2, (neighbor) => {
          if (!includesHex(path, neighbor)) {
            walk(moveTileProduce(board2, current2, neighbor), [...path, neighbor]);
          }
        });
        eachClimbDirection(board2, current2, (neighbor) => {
          if (!includesHex(path, neighbor)) {
            walk(moveTileProduce(board2, current2, neighbor), [...path, neighbor]);
          }
        });
        eachDropDirection(board2, current2, (neighbor, neighborStack) => {
          if (neighborStack.length > 0 && !includesHex(path, neighbor)) {
            walk(moveTileProduce(board2, current2, neighbor), [...path, neighbor]);
          }
        });
      }
      if (path.length === 3) {
        eachDropDirection(board2, current2, (neighbor, neighborStack) => {
          if (neighborStack.length === 0 && !includesHex(path, neighbor) && !visited.has(hexCoordinateKey(neighbor))) {
            valid.push(neighbor);
            visited.add(hexCoordinateKey(neighbor));
          }
        });
      }
    };
    walk(board, [coordinate]);
    return valid;
  }

  // src/queen.ts
  function validQueenMoves(board, coordinate) {
    if (moveBreaksHive(board, coordinate))
      return [];
    const valid = [];
    eachSlideDirection(board, coordinate, (neighbor) => {
      valid.push(neighbor);
    });
    return valid;
  }

  // src/spider.ts
  function validSpiderMoves(board, coordinate) {
    if (moveBreaksHive(board, coordinate))
      return [];
    const valid = [];
    const visited = /* @__PURE__ */ new Set();
    const walk = (board2, path) => {
      const current2 = path[path.length - 1];
      eachSlideDirection(board2, current2, (neighbor) => {
        if (!includesHex(path, neighbor)) {
          if (path.length === 3) {
            const key = hexCoordinateKey(neighbor);
            if (!visited.has(key)) {
              visited.add(key);
              valid.push(neighbor);
            }
          } else {
            walk(moveTileProduce(board2, current2, neighbor), [...path, neighbor]);
          }
        }
      });
    };
    walk(board, [coordinate]);
    return valid;
  }

  // src/pillbug.ts
  function validPillbugMoves(board, coordinate) {
    if (moveBreaksHive(board, coordinate))
      return [];
    const valid = [];
    eachSlideDirection(board, coordinate, (neighbor) => {
      valid.push(neighbor);
    });
    return valid;
  }
  function validPillbugPushes(board, target, pillbug) {
    if (moveBreaksHive(board, target))
      return [];
    const valid = [];
    const pickupDirection = relativeHexDirection(target, pillbug);
    if (getStackHeight(board, target) > 1 || isGated(board, target, pickupDirection))
      return [];
    board = moveTileProduce(board, target, pillbug);
    eachDropDirection(board, pillbug, (neighbor) => {
      if (!hexesEqual(target, neighbor)) {
        valid.push(neighbor);
      }
    });
    return valid;
  }

  // src/mosquito.ts
  function validMosquitoMoves(board, coordinate) {
    if (moveBreaksHive(board, coordinate))
      return [];
    const isBeetle = getStackHeight(board, coordinate) > 1;
    if (isBeetle)
      return validBeetleMoves(board, coordinate);
    const bugTypes = /* @__PURE__ */ new Set();
    eachNeighboringStack(board, coordinate, (_, stack) => {
      const topTile = getTileBug(stack[stack.length - 1]);
      bugTypes.add(topTile);
    });
    const valid = [];
    const visited = /* @__PURE__ */ new Set();
    const addValidMoves = (coordinates) => {
      coordinates.forEach((coordinate2) => {
        const key = hexCoordinateKey(coordinate2);
        if (!visited.has(key)) {
          visited.add(key);
          valid.push(coordinate2);
        }
      });
    };
    bugTypes.forEach((bug) => {
      switch (bug) {
        case "A":
          addValidMoves(validAntMoves(board, coordinate));
          break;
        case "B":
          addValidMoves(validBeetleMoves(board, coordinate));
          break;
        case "G":
          addValidMoves(validGrasshopperMoves(board, coordinate));
          break;
        case "L":
          addValidMoves(validLadybugMoves(board, coordinate));
          break;
        case "P":
          addValidMoves(validPillbugMoves(board, coordinate));
          break;
        case "Q":
          addValidMoves(validQueenMoves(board, coordinate));
          break;
        case "S":
          addValidMoves(validSpiderMoves(board, coordinate));
          break;
      }
    });
    return valid;
  }

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
    const neighbor = getOccupiedNeighbors(board, coordinate).at(0);
    if (!neighbor)
      return false;
    const walkedPath = walkBoard(board, neighbor, coordinate);
    const coordinates = getOccupiedCoordinates(board);
    return walkedPath.length !== coordinates.length - 1;
  }
  function validMoves(board, color, coordinate) {
    const tile2 = getTileAt(board, coordinate);
    if (!tile2)
      return [];
    let valid = [];
    if (getTileColor(tile2) === color) {
      switch (getTileBug(tile2)) {
        case "A":
          valid = validAntMoves(board, coordinate);
          break;
        case "B":
          valid = validBeetleMoves(board, coordinate);
          break;
        case "G":
          valid = validGrasshopperMoves(board, coordinate);
          break;
        case "L":
          valid = validLadybugMoves(board, coordinate);
          break;
        case "M":
          valid = validMosquitoMoves(board, coordinate);
          break;
        case "P":
          valid = validPillbugMoves(board, coordinate);
          break;
        case "Q":
          valid = validQueenMoves(board, coordinate);
          break;
        case "S":
          valid = validSpiderMoves(board, coordinate);
          break;
      }
    }
    const pillbugs = [];
    eachNeighboringStack(board, coordinate, (neighbor, neighborStack) => {
      const topTile = neighborStack[neighborStack.length - 1];
      if (getTileBug(topTile) === "P" && getTileColor(topTile) === color) {
        pillbugs.push(neighbor);
      }
    });
    if (pillbugs.length) {
      const visited = new Set(valid.map(hexCoordinateKey));
      const addValidMoves = (coordinates) => {
        coordinates.forEach((coordinate2) => {
          const key = hexCoordinateKey(coordinate2);
          if (!visited.has(key)) {
            visited.add(key);
            valid.push(coordinate2);
          }
        });
      };
      pillbugs.forEach((pillbug) => {
        addValidMoves(validPillbugPushes(board, coordinate, pillbug));
      });
    }
    return valid;
  }

  // node_modules/immer/dist/immer.mjs
  var NOTHING = Symbol.for("immer-nothing");
  var DRAFTABLE = Symbol.for("immer-draftable");
  var DRAFT_STATE = Symbol.for("immer-state");
  var errors = true ? [
    // All error codes, starting by 0:
    function(plugin) {
      return `The plugin for '${plugin}' has not been loaded into Immer. To enable the plugin, import and call \`enable${plugin}()\` when initializing your application.`;
    },
    function(thing) {
      return `produce can only be called on things that are draftable: plain objects, arrays, Map, Set or classes that are marked with '[immerable]: true'. Got '${thing}'`;
    },
    "This object has been frozen and should not be mutated",
    function(data) {
      return "Cannot use a proxy that has been revoked. Did you pass an object from inside an immer function to an async process? " + data;
    },
    "An immer producer returned a new value *and* modified its draft. Either return a new value *or* modify the draft.",
    "Immer forbids circular references",
    "The first or second argument to `produce` must be a function",
    "The third argument to `produce` must be a function or undefined",
    "First argument to `createDraft` must be a plain object, an array, or an immerable object",
    "First argument to `finishDraft` must be a draft returned by `createDraft`",
    function(thing) {
      return `'current' expects a draft, got: ${thing}`;
    },
    "Object.defineProperty() cannot be used on an Immer draft",
    "Object.setPrototypeOf() cannot be used on an Immer draft",
    "Immer only supports deleting array indices",
    "Immer only supports setting array indices and the 'length' property",
    function(thing) {
      return `'original' expects a draft, got: ${thing}`;
    }
    // Note: if more errors are added, the errorOffset in Patches.ts should be increased
    // See Patches.ts for additional errors
  ] : [];
  function die(error, ...args) {
    if (true) {
      const e = errors[error];
      const msg = typeof e === "function" ? e.apply(null, args) : e;
      throw new Error(`[Immer] ${msg}`);
    }
    throw new Error(
      `[Immer] minified error nr: ${error}. Full error at: https://bit.ly/3cXEKWf`
    );
  }
  var getPrototypeOf = Object.getPrototypeOf;
  function isDraft(value) {
    return !!value && !!value[DRAFT_STATE];
  }
  function isDraftable(value) {
    if (!value)
      return false;
    return isPlainObject(value) || Array.isArray(value) || !!value[DRAFTABLE] || !!value.constructor?.[DRAFTABLE] || isMap(value) || isSet(value);
  }
  var objectCtorString = Object.prototype.constructor.toString();
  function isPlainObject(value) {
    if (!value || typeof value !== "object")
      return false;
    const proto = getPrototypeOf(value);
    if (proto === null) {
      return true;
    }
    const Ctor = Object.hasOwnProperty.call(proto, "constructor") && proto.constructor;
    if (Ctor === Object)
      return true;
    return typeof Ctor == "function" && Function.toString.call(Ctor) === objectCtorString;
  }
  function each(obj, iter) {
    if (getArchtype(obj) === 0) {
      Reflect.ownKeys(obj).forEach((key) => {
        iter(key, obj[key], obj);
      });
    } else {
      obj.forEach((entry, index) => iter(index, entry, obj));
    }
  }
  function getArchtype(thing) {
    const state = thing[DRAFT_STATE];
    return state ? state.type_ : Array.isArray(thing) ? 1 : isMap(thing) ? 2 : isSet(thing) ? 3 : 0;
  }
  function has(thing, prop) {
    return getArchtype(thing) === 2 ? thing.has(prop) : Object.prototype.hasOwnProperty.call(thing, prop);
  }
  function set(thing, propOrOldValue, value) {
    const t = getArchtype(thing);
    if (t === 2)
      thing.set(propOrOldValue, value);
    else if (t === 3) {
      thing.add(value);
    } else
      thing[propOrOldValue] = value;
  }
  function is(x, y) {
    if (x === y) {
      return x !== 0 || 1 / x === 1 / y;
    } else {
      return x !== x && y !== y;
    }
  }
  function isMap(target) {
    return target instanceof Map;
  }
  function isSet(target) {
    return target instanceof Set;
  }
  function latest(state) {
    return state.copy_ || state.base_;
  }
  function shallowCopy(base, strict) {
    if (isMap(base)) {
      return new Map(base);
    }
    if (isSet(base)) {
      return new Set(base);
    }
    if (Array.isArray(base))
      return Array.prototype.slice.call(base);
    if (!strict && isPlainObject(base)) {
      if (!getPrototypeOf(base)) {
        const obj = /* @__PURE__ */ Object.create(null);
        return Object.assign(obj, base);
      }
      return { ...base };
    }
    const descriptors = Object.getOwnPropertyDescriptors(base);
    delete descriptors[DRAFT_STATE];
    let keys = Reflect.ownKeys(descriptors);
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      const desc = descriptors[key];
      if (desc.writable === false) {
        desc.writable = true;
        desc.configurable = true;
      }
      if (desc.get || desc.set)
        descriptors[key] = {
          configurable: true,
          writable: true,
          // could live with !!desc.set as well here...
          enumerable: desc.enumerable,
          value: base[key]
        };
    }
    return Object.create(getPrototypeOf(base), descriptors);
  }
  function freeze(obj, deep = false) {
    if (isFrozen(obj) || isDraft(obj) || !isDraftable(obj))
      return obj;
    if (getArchtype(obj) > 1) {
      obj.set = obj.add = obj.clear = obj.delete = dontMutateFrozenCollections;
    }
    Object.freeze(obj);
    if (deep)
      Object.entries(obj).forEach(([key, value]) => freeze(value, true));
    return obj;
  }
  function dontMutateFrozenCollections() {
    die(2);
  }
  function isFrozen(obj) {
    return Object.isFrozen(obj);
  }
  var plugins = {};
  function getPlugin(pluginKey) {
    const plugin = plugins[pluginKey];
    if (!plugin) {
      die(0, pluginKey);
    }
    return plugin;
  }
  var currentScope;
  function getCurrentScope() {
    return currentScope;
  }
  function createScope(parent_, immer_) {
    return {
      drafts_: [],
      parent_,
      immer_,
      // Whenever the modified draft contains a draft from another scope, we
      // need to prevent auto-freezing so the unowned draft can be finalized.
      canAutoFreeze_: true,
      unfinalizedDrafts_: 0
    };
  }
  function usePatchesInScope(scope, patchListener) {
    if (patchListener) {
      getPlugin("Patches");
      scope.patches_ = [];
      scope.inversePatches_ = [];
      scope.patchListener_ = patchListener;
    }
  }
  function revokeScope(scope) {
    leaveScope(scope);
    scope.drafts_.forEach(revokeDraft);
    scope.drafts_ = null;
  }
  function leaveScope(scope) {
    if (scope === currentScope) {
      currentScope = scope.parent_;
    }
  }
  function enterScope(immer2) {
    return currentScope = createScope(currentScope, immer2);
  }
  function revokeDraft(draft) {
    const state = draft[DRAFT_STATE];
    if (state.type_ === 0 || state.type_ === 1)
      state.revoke_();
    else
      state.revoked_ = true;
  }
  function processResult(result, scope) {
    scope.unfinalizedDrafts_ = scope.drafts_.length;
    const baseDraft = scope.drafts_[0];
    const isReplaced = result !== void 0 && result !== baseDraft;
    if (isReplaced) {
      if (baseDraft[DRAFT_STATE].modified_) {
        revokeScope(scope);
        die(4);
      }
      if (isDraftable(result)) {
        result = finalize(scope, result);
        if (!scope.parent_)
          maybeFreeze(scope, result);
      }
      if (scope.patches_) {
        getPlugin("Patches").generateReplacementPatches_(
          baseDraft[DRAFT_STATE].base_,
          result,
          scope.patches_,
          scope.inversePatches_
        );
      }
    } else {
      result = finalize(scope, baseDraft, []);
    }
    revokeScope(scope);
    if (scope.patches_) {
      scope.patchListener_(scope.patches_, scope.inversePatches_);
    }
    return result !== NOTHING ? result : void 0;
  }
  function finalize(rootScope, value, path) {
    if (isFrozen(value))
      return value;
    const state = value[DRAFT_STATE];
    if (!state) {
      each(
        value,
        (key, childValue) => finalizeProperty(rootScope, state, value, key, childValue, path)
      );
      return value;
    }
    if (state.scope_ !== rootScope)
      return value;
    if (!state.modified_) {
      maybeFreeze(rootScope, state.base_, true);
      return state.base_;
    }
    if (!state.finalized_) {
      state.finalized_ = true;
      state.scope_.unfinalizedDrafts_--;
      const result = state.copy_;
      let resultEach = result;
      let isSet2 = false;
      if (state.type_ === 3) {
        resultEach = new Set(result);
        result.clear();
        isSet2 = true;
      }
      each(
        resultEach,
        (key, childValue) => finalizeProperty(rootScope, state, result, key, childValue, path, isSet2)
      );
      maybeFreeze(rootScope, result, false);
      if (path && rootScope.patches_) {
        getPlugin("Patches").generatePatches_(
          state,
          path,
          rootScope.patches_,
          rootScope.inversePatches_
        );
      }
    }
    return state.copy_;
  }
  function finalizeProperty(rootScope, parentState, targetObject, prop, childValue, rootPath, targetIsSet) {
    if (childValue === targetObject)
      die(5);
    if (isDraft(childValue)) {
      const path = rootPath && parentState && parentState.type_ !== 3 && // Set objects are atomic since they have no keys.
      !has(parentState.assigned_, prop) ? rootPath.concat(prop) : void 0;
      const res = finalize(rootScope, childValue, path);
      set(targetObject, prop, res);
      if (isDraft(res)) {
        rootScope.canAutoFreeze_ = false;
      } else
        return;
    } else if (targetIsSet) {
      targetObject.add(childValue);
    }
    if (isDraftable(childValue) && !isFrozen(childValue)) {
      if (!rootScope.immer_.autoFreeze_ && rootScope.unfinalizedDrafts_ < 1) {
        return;
      }
      finalize(rootScope, childValue);
      if ((!parentState || !parentState.scope_.parent_) && typeof prop !== "symbol" && Object.prototype.propertyIsEnumerable.call(targetObject, prop))
        maybeFreeze(rootScope, childValue);
    }
  }
  function maybeFreeze(scope, value, deep = false) {
    if (!scope.parent_ && scope.immer_.autoFreeze_ && scope.canAutoFreeze_) {
      freeze(value, deep);
    }
  }
  function createProxyProxy(base, parent) {
    const isArray = Array.isArray(base);
    const state = {
      type_: isArray ? 1 : 0,
      // Track which produce call this is associated with.
      scope_: parent ? parent.scope_ : getCurrentScope(),
      // True for both shallow and deep changes.
      modified_: false,
      // Used during finalization.
      finalized_: false,
      // Track which properties have been assigned (true) or deleted (false).
      assigned_: {},
      // The parent draft state.
      parent_: parent,
      // The base state.
      base_: base,
      // The base proxy.
      draft_: null,
      // set below
      // The base copy with any updated values.
      copy_: null,
      // Called by the `produce` function.
      revoke_: null,
      isManual_: false
    };
    let target = state;
    let traps = objectTraps;
    if (isArray) {
      target = [state];
      traps = arrayTraps;
    }
    const { revoke, proxy } = Proxy.revocable(target, traps);
    state.draft_ = proxy;
    state.revoke_ = revoke;
    return proxy;
  }
  var objectTraps = {
    get(state, prop) {
      if (prop === DRAFT_STATE)
        return state;
      const source = latest(state);
      if (!has(source, prop)) {
        return readPropFromProto(state, source, prop);
      }
      const value = source[prop];
      if (state.finalized_ || !isDraftable(value)) {
        return value;
      }
      if (value === peek(state.base_, prop)) {
        prepareCopy(state);
        return state.copy_[prop] = createProxy(value, state);
      }
      return value;
    },
    has(state, prop) {
      return prop in latest(state);
    },
    ownKeys(state) {
      return Reflect.ownKeys(latest(state));
    },
    set(state, prop, value) {
      const desc = getDescriptorFromProto(latest(state), prop);
      if (desc?.set) {
        desc.set.call(state.draft_, value);
        return true;
      }
      if (!state.modified_) {
        const current2 = peek(latest(state), prop);
        const currentState = current2?.[DRAFT_STATE];
        if (currentState && currentState.base_ === value) {
          state.copy_[prop] = value;
          state.assigned_[prop] = false;
          return true;
        }
        if (is(value, current2) && (value !== void 0 || has(state.base_, prop)))
          return true;
        prepareCopy(state);
        markChanged(state);
      }
      if (state.copy_[prop] === value && // special case: handle new props with value 'undefined'
      (value !== void 0 || prop in state.copy_) || // special case: NaN
      Number.isNaN(value) && Number.isNaN(state.copy_[prop]))
        return true;
      state.copy_[prop] = value;
      state.assigned_[prop] = true;
      return true;
    },
    deleteProperty(state, prop) {
      if (peek(state.base_, prop) !== void 0 || prop in state.base_) {
        state.assigned_[prop] = false;
        prepareCopy(state);
        markChanged(state);
      } else {
        delete state.assigned_[prop];
      }
      if (state.copy_) {
        delete state.copy_[prop];
      }
      return true;
    },
    // Note: We never coerce `desc.value` into an Immer draft, because we can't make
    // the same guarantee in ES5 mode.
    getOwnPropertyDescriptor(state, prop) {
      const owner = latest(state);
      const desc = Reflect.getOwnPropertyDescriptor(owner, prop);
      if (!desc)
        return desc;
      return {
        writable: true,
        configurable: state.type_ !== 1 || prop !== "length",
        enumerable: desc.enumerable,
        value: owner[prop]
      };
    },
    defineProperty() {
      die(11);
    },
    getPrototypeOf(state) {
      return getPrototypeOf(state.base_);
    },
    setPrototypeOf() {
      die(12);
    }
  };
  var arrayTraps = {};
  each(objectTraps, (key, fn) => {
    arrayTraps[key] = function() {
      arguments[0] = arguments[0][0];
      return fn.apply(this, arguments);
    };
  });
  arrayTraps.deleteProperty = function(state, prop) {
    if (isNaN(parseInt(prop)))
      die(13);
    return arrayTraps.set.call(this, state, prop, void 0);
  };
  arrayTraps.set = function(state, prop, value) {
    if (prop !== "length" && isNaN(parseInt(prop)))
      die(14);
    return objectTraps.set.call(this, state[0], prop, value, state[0]);
  };
  function peek(draft, prop) {
    const state = draft[DRAFT_STATE];
    const source = state ? latest(state) : draft;
    return source[prop];
  }
  function readPropFromProto(state, source, prop) {
    const desc = getDescriptorFromProto(source, prop);
    return desc ? `value` in desc ? desc.value : (
      // This is a very special case, if the prop is a getter defined by the
      // prototype, we should invoke it with the draft as context!
      desc.get?.call(state.draft_)
    ) : void 0;
  }
  function getDescriptorFromProto(source, prop) {
    if (!(prop in source))
      return void 0;
    let proto = getPrototypeOf(source);
    while (proto) {
      const desc = Object.getOwnPropertyDescriptor(proto, prop);
      if (desc)
        return desc;
      proto = getPrototypeOf(proto);
    }
    return void 0;
  }
  function markChanged(state) {
    if (!state.modified_) {
      state.modified_ = true;
      if (state.parent_) {
        markChanged(state.parent_);
      }
    }
  }
  function prepareCopy(state) {
    if (!state.copy_) {
      state.copy_ = shallowCopy(
        state.base_,
        state.scope_.immer_.useStrictShallowCopy_
      );
    }
  }
  var Immer2 = class {
    constructor(config) {
      this.autoFreeze_ = true;
      this.useStrictShallowCopy_ = false;
      this.produce = (base, recipe, patchListener) => {
        if (typeof base === "function" && typeof recipe !== "function") {
          const defaultBase = recipe;
          recipe = base;
          const self = this;
          return function curriedProduce(base2 = defaultBase, ...args) {
            return self.produce(base2, (draft) => recipe.call(this, draft, ...args));
          };
        }
        if (typeof recipe !== "function")
          die(6);
        if (patchListener !== void 0 && typeof patchListener !== "function")
          die(7);
        let result;
        if (isDraftable(base)) {
          const scope = enterScope(this);
          const proxy = createProxy(base, void 0);
          let hasError = true;
          try {
            result = recipe(proxy);
            hasError = false;
          } finally {
            if (hasError)
              revokeScope(scope);
            else
              leaveScope(scope);
          }
          usePatchesInScope(scope, patchListener);
          return processResult(result, scope);
        } else if (!base || typeof base !== "object") {
          result = recipe(base);
          if (result === void 0)
            result = base;
          if (result === NOTHING)
            result = void 0;
          if (this.autoFreeze_)
            freeze(result, true);
          if (patchListener) {
            const p = [];
            const ip = [];
            getPlugin("Patches").generateReplacementPatches_(base, result, p, ip);
            patchListener(p, ip);
          }
          return result;
        } else
          die(1, base);
      };
      this.produceWithPatches = (base, recipe) => {
        if (typeof base === "function") {
          return (state, ...args) => this.produceWithPatches(state, (draft) => base(draft, ...args));
        }
        let patches, inversePatches;
        const result = this.produce(base, recipe, (p, ip) => {
          patches = p;
          inversePatches = ip;
        });
        return [result, patches, inversePatches];
      };
      if (typeof config?.autoFreeze === "boolean")
        this.setAutoFreeze(config.autoFreeze);
      if (typeof config?.useStrictShallowCopy === "boolean")
        this.setUseStrictShallowCopy(config.useStrictShallowCopy);
    }
    createDraft(base) {
      if (!isDraftable(base))
        die(8);
      if (isDraft(base))
        base = current(base);
      const scope = enterScope(this);
      const proxy = createProxy(base, void 0);
      proxy[DRAFT_STATE].isManual_ = true;
      leaveScope(scope);
      return proxy;
    }
    finishDraft(draft, patchListener) {
      const state = draft && draft[DRAFT_STATE];
      if (!state || !state.isManual_)
        die(9);
      const { scope_: scope } = state;
      usePatchesInScope(scope, patchListener);
      return processResult(void 0, scope);
    }
    /**
     * Pass true to automatically freeze all copies created by Immer.
     *
     * By default, auto-freezing is enabled.
     */
    setAutoFreeze(value) {
      this.autoFreeze_ = value;
    }
    /**
     * Pass true to enable strict shallow copy.
     *
     * By default, immer does not copy the object descriptors such as getter, setter and non-enumrable properties.
     */
    setUseStrictShallowCopy(value) {
      this.useStrictShallowCopy_ = value;
    }
    applyPatches(base, patches) {
      let i;
      for (i = patches.length - 1; i >= 0; i--) {
        const patch = patches[i];
        if (patch.path.length === 0 && patch.op === "replace") {
          base = patch.value;
          break;
        }
      }
      if (i > -1) {
        patches = patches.slice(i + 1);
      }
      const applyPatchesImpl = getPlugin("Patches").applyPatches_;
      if (isDraft(base)) {
        return applyPatchesImpl(base, patches);
      }
      return this.produce(
        base,
        (draft) => applyPatchesImpl(draft, patches)
      );
    }
  };
  function createProxy(value, parent) {
    const draft = isMap(value) ? getPlugin("MapSet").proxyMap_(value, parent) : isSet(value) ? getPlugin("MapSet").proxySet_(value, parent) : createProxyProxy(value, parent);
    const scope = parent ? parent.scope_ : getCurrentScope();
    scope.drafts_.push(draft);
    return draft;
  }
  function current(value) {
    if (!isDraft(value))
      die(10, value);
    return currentImpl(value);
  }
  function currentImpl(value) {
    if (!isDraftable(value) || isFrozen(value))
      return value;
    const state = value[DRAFT_STATE];
    let copy;
    if (state) {
      if (!state.modified_)
        return state.base_;
      state.finalized_ = true;
      copy = shallowCopy(value, state.scope_.immer_.useStrictShallowCopy_);
    } else {
      copy = shallowCopy(value, true);
    }
    each(copy, (key, childValue) => {
      set(copy, key, currentImpl(childValue));
    });
    if (state) {
      state.finalized_ = false;
    }
    return copy;
  }
  var immer = new Immer2();
  var produce = immer.produce;
  var produceWithPatches = immer.produceWithPatches.bind(
    immer
  );
  var setAutoFreeze = immer.setAutoFreeze.bind(immer);
  var setUseStrictShallowCopy = immer.setUseStrictShallowCopy.bind(immer);
  var applyPatches = immer.applyPatches.bind(immer);
  var createDraft = immer.createDraft.bind(immer);
  var finishDraft = immer.finishDraft.bind(immer);

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
  function chainBoardChanges(...fns) {
    return (board) => fns.reduce((brd, fn) => fn(brd), board);
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
        placeTileMutate(board, move.tileId, move.to);
      }
      if (isMoveMovement(move)) {
        moveTileMutate(board, move.from, move.to);
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
  function getStacks(board, sortForRender) {
    const stacks = [];
    eachStack(board, (coordinate, tiles) => stacks.push({ coordinate, tiles }));
    if (sortForRender)
      renderSort(stacks);
    return stacks;
  }
  function getStackHeight(board, coordinate) {
    return getStack(board, coordinate).length;
  }
  function getTileAt(board, coordinate) {
    return getStack(board, coordinate).at(-1);
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
  function moveTileProduce(board, from, to) {
    return produce(board, (draft) => {
      moveTileMutate(draft, from, to);
    });
  }
  function moveTileMutate(board, from, to) {
    const tile2 = getTileAt(board, from);
    if (!tile2)
      throw new NoTileAtCoordinateError(from);
    return placeTileMutate(popTileMutate(board, from), tile2, to);
  }
  function moveTile(board, from, to) {
    const clone = structuredClone(board);
    return moveTileMutate(clone, from, to);
  }
  function placeTileProduce(board, tileId, coordinate) {
    return produce(board, (draft) => {
      placeTileMutate(draft, tileId, coordinate);
    });
  }
  function placeTileMutate(board, tileId, coordinate) {
    const { q, r } = coordinate;
    if (!(q in board))
      board[q] = {};
    if (!(r in board[q]))
      board[q][r] = [];
    board[q][r].push(tileId);
    return board;
  }
  function placeTile(boardOrTileId, tileIdOrCoordinate, coordinate) {
    if (arguments.length === 2) {
      return (board) => placeTile(
        board,
        boardOrTileId,
        tileIdOrCoordinate
      );
    }
    const clone = structuredClone(boardOrTileId);
    return placeTileMutate(
      clone,
      tileIdOrCoordinate,
      coordinate
    );
  }
  function popTileProduce(board, coordinate) {
    return produce(board, (draft) => popTileMutate(draft, coordinate));
  }
  function popTileMutate(board, coordinate) {
    const { q, r } = coordinate;
    const stack = board[q]?.[r] || [];
    const tileId = stack.pop();
    if (!tileId)
      throw new NoTileAtCoordinateError(coordinate);
    if (stack.length === 0)
      delete board[q][r];
    if (Object.keys(board[q]).length === 0)
      delete board[q];
    return board;
  }
  function popTile(boardOrCoordinate, coordinate) {
    if (arguments.length === 1) {
      return (board) => {
        return popTile(board, boardOrCoordinate);
      };
    }
    const clone = structuredClone(boardOrCoordinate);
    return popTileMutate(clone, coordinate);
  }
  function renderSort(stacks) {
    return stacks.slice().sort((a, b) => {
      const dr = b.coordinate.r - a.coordinate.r;
      if (dr < 0)
        return 1;
      if (dr === 0)
        return a.tiles.length - b.tiles.length;
      return -1;
    });
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

  // src/ant.ts
  function validAntMoves(board, coordinate) {
    if (moveBreaksHive(board, coordinate))
      return [];
    const valid = [];
    const visited = /* @__PURE__ */ new Set([hexCoordinateKey(coordinate)]);
    const walk = (board2, coordinate2) => {
      eachSlideDirection(board2, coordinate2, (neighbor) => {
        const key = hexCoordinateKey(neighbor);
        if (!visited.has(key)) {
          const tile2 = getTileAt(board2, coordinate2);
          if (!tile2)
            throw new ExpectedTileAtCoordinateError(coordinate2);
          visited.add(key);
          valid.push(neighbor);
          walk(moveTileProduce(board2, coordinate2, neighbor), neighbor);
        }
      });
    };
    walk(board, coordinate);
    return valid;
  }

  // src/hand.ts
  function stacksInHand(board, color, config) {
    const hand = tilesInHand(board, color, config);
    const groups = hand.reduce(
      (groups2, tileId) => {
        groups2[tileId] = groups2[tileId] ?? [];
        groups2[tileId].push(tileId);
        return groups2;
      },
      {}
    );
    return Object.values(groups);
  }
  function tilesInHand(board, color, config) {
    const handTiles = [];
    const countByTileId = {};
    getTilesOnBoard(board).forEach((tileId) => {
      countByTileId[tileId] = (countByTileId[tileId] || 0) + 1;
    });
    let bug;
    for (bug in config.tileset) {
      const tileId = tile(color, bug);
      const numInGame = config.tileset[bug] || 0;
      const numOnBoard = countByTileId[tileId] || 0;
      const numInHand = Math.max(0, numInGame - numOnBoard);
      const tilesInHand2 = Array.from({ length: numInHand }, () => tileId);
      handTiles.push(...tilesInHand2);
    }
    return handTiles;
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

  // src/svg.ts
  function hexPath(size, rounding, precision) {
    const corners = [];
    for (let i = 0; i < 6; ++i) {
      const angle = 2 * M_PI * i / 6;
      corners.push({
        x: size * Math.cos(angle),
        y: size * Math.sin(angle)
      });
    }
    if (rounding === 0) {
      return [
        moveTo(corners[5], precision),
        ...corners.map((corner) => lineTo(corner, precision))
      ].join(" ") + "z";
    }
    const edgePoints = generateEdgePoints(corners, rounding / 2);
    const pathPoints = groupEdgePointsForPathRendering(edgePoints);
    const commands = convertPathPointGroupsToCommands(pathPoints, precision);
    return commands.join(" ") + "z";
  }
  function moveTo(point, precision) {
    return `M${point.x.toFixed(precision)} ${point.y.toFixed(precision)}`;
  }
  function lineTo(point, precision) {
    return `L${point.x.toFixed(precision)} ${point.y.toFixed(precision)}`;
  }
  function curveTo(control, point, precision) {
    return `Q ${control.x.toFixed(precision)} ${control.y.toFixed(precision)}, ${point.x.toFixed(precision)} ${point.y.toFixed(precision)}`;
  }
  function toPaddedPair(pair, pad) {
    const p0 = pair[0];
    const p1 = pair[1];
    const dx = p1.x - p0.x;
    const dy = p1.y - p0.y;
    const mag = Math.hypot(dx, dy);
    return [
      {
        x: p0.x + pad * dx / mag,
        y: p0.y + pad * dy / mag
      },
      {
        x: p1.x - pad * dx / mag,
        y: p1.y - pad * dy / mag
      }
    ];
  }
  function generateEdgePoints(corners, padding) {
    const edgePoints = corners.map((corner, index) => {
      const nextCorner = index === corners.length - 1 ? corners[0] : corners[index + 1];
      return [corner, ...toPaddedPair([corner, nextCorner], padding)];
    });
    const first = edgePoints[0];
    const last = edgePoints[edgePoints.length - 1];
    return [last, ...edgePoints, first];
  }
  function groupEdgePointsForPathRendering(edgePoints) {
    let cPrev = null;
    const groups = [];
    edgePoints.forEach(([a, b, c]) => {
      if (cPrev) {
        groups.push([cPrev, a, b]);
      }
      cPrev = c;
    });
    return groups;
  }
  function convertPathPointGroupsToCommands(groups, precision) {
    let commands = [];
    const lastIndex = groups.length - 1;
    groups.forEach(([a, b, c], index) => {
      if (index === 0) {
        commands.push(moveTo(a, precision));
      } else {
        commands.push(lineTo(a, precision));
      }
      if (index !== lastIndex) {
        commands.push(curveTo(b, c, precision));
      }
    });
    return commands;
  }
})();
