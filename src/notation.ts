import {
  BugId,
  Game,
  GameBoard,
  GameConfig,
  HexCoordinate,
  Move,
  TileId
} from './types';
import { isMoveMovement, isMovePass, isMovePlacement } from './move';
import { NotationParsingError } from './error';

// board notation consts
const OPEN_BRACKET = '.';
const CLOSE_BRACKET = '~';

// game notation consts
const SECTION_SEP = '_';

/**
 * Generate a board notation string.
 *
 * @remarks
 * A game board notation string is a simple compressed string representation of
 * the result of passing the board into `JSON.stringify`. The opening and
 * closing brackets are replaced with URL-safe characters and tiles are assumed
 * to be white unless explicitly noted as black. Finally, extraneous characters
 * are omitted and a simple change to the first and last characters of the string
 * are made to simplify parsing. Note that board notation is not intended to be
 * human-readable; rather, it's optimized for size and potential use in a URL.
 *
 * @param board - A game board.
 * @returns A board notation string.
 *
 * @beta
 */
export function boardNotation(board: GameBoard): string {
  const str = JSON.stringify(board);
  if (str === '{}') return CLOSE_BRACKET + OPEN_BRACKET;
  let notation = '';
  for (let c of str) {
    switch (c) {
      case '{':
        notation += OPEN_BRACKET;
        break;
      case '}':
        notation += CLOSE_BRACKET;
        break;
      case '"':
      case ',':
      case ':':
      case '[':
      case ']':
      case 'w':
        break;
      default:
        notation += c;
    }
  }
  notation = CLOSE_BRACKET + notation.slice(1, -2);
  return notation;
}

/**
 * Generate a game config notation string.
 *
 * @param config
 */
export function configNotation(config: GameConfig): string {
  const tileset = config.tileset;
  const tilesetString = Object.keys(tileset)
    .map((bug) => `${bug}${tileset[bug as BugId]}`)
    .join('');
  return config.tournament ? 't' + tilesetString : tilesetString;
}

/**
 * Generate a game notation string.
 *
 * @param game - A game object.
 * @returns A game notation string.
 *
 * @beta
 */
export function gameNotation(game: Game): string {
  const config = configNotation(game.config);
  const board = boardNotation(game.board);
  const moves = movesNotation(game.moves);
  return config + SECTION_SEP + moves + SECTION_SEP + board;
}

/**
 * Generate a moves notation string from an array of {@link Move}s.
 *
 * TODO: Refactor moves to have a lead character indicating type of move
 *
 * @param moves An array of moves.
 * @returns A moves notation string.
 *
 * @beta
 */
export function movesNotation(moves: Move[]): string {
  return moves
    .map((move) => {
      if (isMovePass(move)) return passNotation();
      if (isMovePlacement(move)) return placementNotation(move.tileId, move.to);
      if (isMoveMovement(move)) return movementNotation(move.from, move.to);
      return '';
    })
    .join();
}

/**
 * Generate a tile movement notation string.
 *
 * @param from - The location of the tile being moved.
 * @param to - The movement destination.
 * @returns A tile movement notation string.
 *
 * @beta
 */
export function movementNotation(
  from: HexCoordinate,
  to: HexCoordinate
): string {
  return `(${from.q},${from.r})(${to.q},${to.r})`;
}

/**
 * Generate a {@link GameBoard} from a board notation string.
 *
 * @param notation - A board notation string.
 * @returns A game board.
 *
 * @beta
 */
export function parseBoardNotation(notation: string): GameBoard {
  const iter = notation[Symbol.iterator]();
  const board: GameBoard = {};
  if (notation === CLOSE_BRACKET + OPEN_BRACKET) return board;
  let q: number | undefined = undefined;
  let r: number | undefined = undefined;
  let char = iter.next();

  const readNumber = (advance = false) => {
    if (advance) char = iter.next();
    let acc = '';
    while (!char.done && isNumberChar(char.value)) {
      acc += char.value;
      char = iter.next();
    }
    return +acc;
  };

  const readBug = () => {
    let acc = char.value;
    char = iter.next();
    if (!char.done && acc === 'b') {
      acc += char.value;
      char = iter.next();
    }
    return acc.length === 1 ? 'w' + acc : acc;
  };

  const isNumberChar = (char: string) => {
    return /[-\d]/.test(char);
  };

  while (!char.done) {
    if (char.value === CLOSE_BRACKET) {
      q = readNumber(true);
      board[q] = {};
    } else if (char.value === OPEN_BRACKET) {
      r = readNumber(true);
      board[q!][r] = [];
    } else if (isNumberChar(char.value)) {
      r = readNumber();
      board[q!][r] = [];
    } else {
      board[q!][r!].push(readBug());
    }
  }

  return board;
}

/**
 * Generate a ${@link GameConfig} from a game config notation string.
 *
 * @param notation - A game config notation string.
 * @returns A game config.
 *
 * @beta
 */
export function parseConfigNotation(notation: string): GameConfig {
  const config: GameConfig = {
    tournament: notation.charAt(0) === 't',
    tileset: {}
  };
  const tilesetNotation = config.tournament ? notation.slice(1) : notation;
  const tiles = tilesetNotation.match(/[A-Z]\d+/g);
  if (!tiles) return config;

  tiles.forEach((match) => {
    const bugId = match[0] as BugId;
    config.tileset[bugId] = +match.slice(1);
  });
  return config;
}

/**
 * Generate a ${@link Game} from a game notation string.
 *
 * @param notation - A game notation string.
 * @returns A game.
 * @throws {@link NotationParsingError}
 * Throws if the notation string could not be parsed.
 *
 * @beta
 */
export function parseGameNotation(notation: string): Game {
  const sections = notation.split(SECTION_SEP);
  if (sections.length !== 3) throw new NotationParsingError('game', notation);

  const [configNotation, movesNotation, boardNotation] = sections;
  const config = parseConfigNotation(configNotation);
  const moves = parseMovesNotation(movesNotation);
  const board = parseBoardNotation(boardNotation);

  return {
    config,
    board,
    moves
  };
}

/**
 * Generate an ordered array of {@link Move} objects from a moves notation
 * string.
 *
 * @param notation - A moves notation string.
 * @returns An array of moves.
 *
 * @beta
 */
export function parseMovesNotation(notation: string): Move[] {
  function parseToken(token: string): HexCoordinate | TileId {
    if (token[0] === '(') {
      const nums = token.slice(1, -1).split(',');
      return {
        q: parseInt(nums[0]),
        r: parseInt(nums[1])
      };
    }
    if (token[0] === '[') {
      return token.slice(1, -1) as TileId;
    }
    throw new Error(`Invalid token: ${token}`);
  }

  const moves: Move[] = [];
  let tokens = [];
  let move = '';
  let token = '';
  for (let i = 0, len = notation.length; i < len; ++i) {
    const char = notation[i];
    /// game end
    if (char === '#') break;

    /// passing move
    if (char === 'x') {
      moves.push({ pass: true });
      continue;
    }

    /// placement or movement
    move += char;
    token += char;
    if (char === ')' || char === ']') {
      tokens.push(token);
      token = '';
    }
    if (tokens.length === 2) {
      const tokA = parseToken(tokens[0]);
      const tokB = parseToken(tokens[1]);
      if (typeof tokB === 'string') {
        moves.push({
          tileId: tokB,
          to: tokA as HexCoordinate
        });
      } else {
        moves.push({
          from: tokA as HexCoordinate,
          to: tokB as HexCoordinate
        });
      }
      tokens = [];
      move = '';
    }
  }
  return moves;
}

/**
 * Generate a passing move notation string.
 *
 * @returns A passing move notation string.
 *
 * @beta
 */
export function passNotation(): string {
  return 'x';
}

/**
 * Generate a tile placement notation string.
 *
 * @param tileId - The tile being placed.
 * @param coordinate - The placement location.
 * @returns A tile placement notation string.
 *
 * @beta
 */
export function placementNotation(
  tileId: TileId,
  coordinate: HexCoordinate
): string {
  return `(${coordinate.q},${coordinate.r})[${tileId}]`;
}
