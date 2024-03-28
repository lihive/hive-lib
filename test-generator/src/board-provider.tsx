import {
  boardNotation,
  BugId,
  chainBoardChanges,
  Color,
  GameBoard,
  getStackHeight,
  getTileAt,
  getTileBug,
  getTileColor,
  HexCoordinate,
  parseBoardNotation,
  placeTile,
  popTile,
  tile,
  validMoves
} from '@hive-lib';
import {
  Accessor,
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
  boardNotation: Accessor<string>;
  playerColor: Accessor<Color>;
  validMoves: Accessor<HexCoordinate[]>;

  clearBoard: () => void;
  setBoardByNotation: (notation: string) => void;
  setPlayerColor: Setter<Color>;
}

const BoardContext = createContext<GameBoardAPI>();

export const BoardProvider = (props: ParentProps) => {
  const { table, setSelectedCoordinate } = useTable();
  const [board, setBoard] = createSignal<GameBoard>({});
  const [playerColor, setPlayerColor] = createSignal<Color>('w');

  const validPlayerMoves = createMemo(() => {
    if (!table.selectedCoordinate) return [];
    const tile = getTileAt(board(), table.selectedCoordinate);
    if (!tile) return [];

    return validMoves(board(), playerColor(), table.selectedCoordinate);
  });

  const pushSelectedTile = (bug: BugId) => {
    const coordinate = table.selectedCoordinate;
    if (!coordinate) return;
    setBoard(placeTile(tile(playerColor(), bug), coordinate));
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

  const togglePlayerColor = () => {
    setPlayerColor((curr) => (curr === 'w' ? 'b' : 'w'));
  };

  const removeTopTile = () => {
    const coordinate = table.selectedCoordinate;
    if (!coordinate) return;
    const stackHeight = getStackHeight(board(), coordinate);
    if (stackHeight === 0) return;

    setBoard(popTile(coordinate));
  };

  const clearBoard = () => {
    setBoard({});
    setSelectedCoordinate(undefined);
  };

  const getBoardNotation = () => boardNotation(board());

  const setBoardByNotation = (notation: string) => {
    setBoard(parseBoardNotation(notation));
  };

  const placeableBugs: BugId[] = ['A', 'B', 'G', 'L', 'M', 'P', 'Q', 'S', 'X'];
  placeableBugs.forEach((bug) => {
    createShortcut([bug], () => toggleSelectedTile(bug));
    createShortcut(['Shift', bug], () => pushSelectedTile(bug));
  });
  createShortcut(['-'], removeTopTile);
  createShortcut(['C'], togglePlayerColor);

  return (
    <BoardContext.Provider
      value={{
        board,
        boardNotation: getBoardNotation,
        playerColor,
        validMoves: validPlayerMoves,

        clearBoard,
        setBoardByNotation,
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
