import {
  BugId,
  chainBoardChanges,
  Color,
  eachStack,
  Game,
  GameBoard,
  GameConfig,
  gameNotation,
  getStackHeight,
  getTileAt,
  getTileBug,
  getTileColor,
  HexCoordinate,
  hexesEqual,
  isMovePass,
  parseGameNotation,
  placeTile,
  popTile,
  tile,
  TileMovement,
  TilePlacement,
  TileSet,
  validMoves
} from '@hive-lib';
import {
  Accessor,
  batch,
  createContext,
  createMemo,
  createSignal,
  ParentProps,
  Setter,
  useContext
} from 'solid-js';
import { useTable } from './table-provider';
import { createShortcut } from '@solid-primitives/keyboard';

interface GameBoardAPI {
  board: Accessor<GameBoard>;
  gameNotation: Accessor<string>;
  lastMove: Accessor<TilePlacement | TileMovement | undefined>;
  playerColor: Accessor<Color>;
  validMoves: Accessor<HexCoordinate[]>;

  clearBoard: () => void;
  moveTile: (move: TileMovement) => void;
  setBoard: (board: GameBoard) => void;
  setGameNotation: (notation: string) => void;
  setLastMove: Setter<TilePlacement | TileMovement | undefined>;
  setPlayerColor: Setter<Color>;
}

const BoardContext = createContext<GameBoardAPI>();

export const BoardProvider = (props: ParentProps) => {
  const { table, setSelectedCoordinate } = useTable();
  const [board, setBoard] = createSignal<GameBoard>({});
  const [playerColor, setPlayerColor] = createSignal<Color>('w');
  const [lastMove, setLastMove] = createSignal<
    TilePlacement | TileMovement | undefined
  >();

  const clearBoard = () => {
    setBoard({});
    setSelectedCoordinate(undefined);
    setLastMove(undefined);
  };

  const clearLastMove = () => {
    if (!table.selectedCoordinate) {
      setLastMove(undefined);
    }
  };

  const getGameNotation = () => {
    // the tileset will be the tiles on the board
    const tileset: TileSet = {};
    eachStack(board(), (_, stack) => {
      stack.forEach((tileId) => {
        const bug = getTileBug(tileId);
        if (!(bug in tileset)) {
          tileset[bug] = 0;
        }
        tileset[bug] += 1;
      });
    });

    return gameNotation({
      board: board(),
      moves: lastMove() ? [lastMove()!] : [],
      config: {
        tileset
      }
    });
  };

  const moveTile = (move: TileMovement) => {
    const tile = getTileAt(board(), move.from);
    if (!tile) return;

    setBoard(chainBoardChanges(popTile(move.from), placeTile(tile, move.to)));
  };

  const pushSelectedTile = (bug: BugId) => {
    const coordinate = table.selectedCoordinate;
    if (!coordinate) return;
    setBoard(placeTile(tile(playerColor(), bug), coordinate));
  };

  const removeTopTile = () => {
    const coordinate = table.selectedCoordinate;
    if (!coordinate) return;
    const stackHeight = getStackHeight(board(), coordinate);
    if (stackHeight === 0) return;

    setBoard(popTile(coordinate));

    // if we just removed the last tile from the last move destination, clear
    // the last move.
    if (
      hexesEqual(lastMove()?.to, coordinate) &&
      getStackHeight(board(), coordinate) === 0
    ) {
      setLastMove(undefined);
    }
  };

  const setGameBoard = (board: GameBoard) => {
    batch(() => {
      setBoard(board);
      setLastMove(undefined);
    });
  };

  const setGameNotation = (notation: string) => {
    batch(() => {
      const game = parseGameNotation(notation);
      setBoard(game.board);
      if (!game.moves.length) {
        setLastMove(undefined);
        return;
      }

      const last = game.moves[game.moves.length - 1];
      setLastMove(isMovePass(last) ? undefined : last);
    });
  };

  const togglePlayerColor = () => {
    setPlayerColor((curr) => (curr === 'w' ? 'b' : 'w'));
  };

  const toggleSelectedTile = (bug: BugId) => {
    const coordinate = table.selectedCoordinate;
    if (!coordinate) return;
    const currentTile = getTileAt(board(), coordinate);

    // place white tile if there is no tile at coordinate
    if (!currentTile) {
      setBoard(placeTile(tile('w', bug), coordinate));
      return;
    }

    const currentBug = getTileBug(currentTile);
    const currentColor = getTileColor(currentTile);

    // if a different bug is at coordinate, replace it with same color of new bug
    if (currentBug !== bug) {
      setBoard(
        chainBoardChanges(
          popTile(coordinate),
          placeTile(tile(currentColor, bug), coordinate)
        )
      );
      return;
    }

    // otherwise toggle the color
    setBoard(
      chainBoardChanges(
        popTile(coordinate),
        placeTile(tile(currentColor === 'w' ? 'b' : 'w', bug), coordinate)
      )
    );
  };

  const validPlayerMoves = createMemo(() => {
    if (!table.selectedCoordinate) return [];
    const tile = getTileAt(board(), table.selectedCoordinate);
    if (!tile) return [];

    const last = lastMove();
    if (!last)
      return validMoves(board(), playerColor(), table.selectedCoordinate);

    const fakeConfig: GameConfig = { tileset: {} };
    const game: Game = { config: fakeConfig, moves: [last], board: board() };
    return validMoves(game, playerColor(), table.selectedCoordinate);
  });

  const placeableBugs: BugId[] = ['A', 'B', 'G', 'L', 'M', 'P', 'Q', 'S', 'X'];
  placeableBugs.forEach((bug) => {
    createShortcut([bug], () => toggleSelectedTile(bug));
    createShortcut(['Shift', bug], () => pushSelectedTile(bug));
  });
  createShortcut(['-'], removeTopTile);
  createShortcut(['C'], togglePlayerColor);
  createShortcut(['escape'], clearLastMove);

  return (
    <BoardContext.Provider
      value={{
        board,
        gameNotation: getGameNotation,
        playerColor,
        validMoves: validPlayerMoves,
        lastMove,

        clearBoard,
        moveTile,
        setBoard: setGameBoard,
        setGameNotation,
        setLastMove,
        setPlayerColor
      }}
    >
      {props.children}
    </BoardContext.Provider>
  );
};

export const useBoard = () => {
  const board = useContext(BoardContext);
  if (!board) throw new Error('useBoard: could not find a BoardContext');
  return board;
};
