import {
  BASE_GAME_TOURNAMENT,
  boardNotation,
  BugId,
  chainBoardChanges,
  Color,
  GameBoard,
  gameNotation,
  getStackHeight,
  getTileAt,
  getTileBug,
  getTileColor,
  HexCoordinate,
  hexesEqual,
  parseBoardNotation,
  parseGameNotation,
  placeTile,
  popTile,
  tile,
  TileMovement,
  TilePlacement,
  validMoves
} from '@hive-lib';
import {
  Accessor,
  createContext,
  createEffect,
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
  boardNotation: Accessor<string>;
  lastMove: Accessor<TilePlacement | TileMovement | undefined>;
  playerColor: Accessor<Color>;
  validMoves: Accessor<HexCoordinate[]>;

  clearBoard: () => void;
  moveTile: (move: TileMovement) => void;
  setBoardByNotation: (notation: string) => void;
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

  createEffect(() => {
    const lm = lastMove();
    const brd = board();
    if (lm) {
      const gn = gameNotation({
        config: BASE_GAME_TOURNAMENT,
        board: brd,
        moves: [lm]
      });
      console.log(gn);
      console.log(parseGameNotation(gn));
    } else {
      console.log(boardNotation(brd));
    }
  });

  const clearBoard = () => {
    setBoard({});
    setSelectedCoordinate(undefined);
  };

  const clearLastMove = () => {
    if (!table.selectedCoordinate) {
      setLastMove(undefined);
    }
  };

  const getBoardNotation = () => boardNotation(board());

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

  const setBoardByNotation = (notation: string) => {
    setBoard(parseBoardNotation(notation));
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

    return validMoves(board(), playerColor(), table.selectedCoordinate);
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
        boardNotation: getBoardNotation,
        playerColor,
        validMoves: validPlayerMoves,
        lastMove,

        clearBoard,
        moveTile,
        setBoardByNotation,
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
