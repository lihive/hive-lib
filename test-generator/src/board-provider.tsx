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
  validMovesVisible: Accessor<boolean>;

  clearBoard: () => void;
  setBoardByNotation: (notation: string) => void;
  setPlayerColor: Setter<Color>;
}

const BoardContext = createContext<GameBoardAPI>();

export const BoardProvider = (props: ParentProps) => {
  const [table, setTable] = useTable();
  const [board, setBoard] = createSignal<GameBoard>({});
  const [playerColor, setPlayerColor] = createSignal<Color>('w');
  const [validMovesVisible, setValidMovesVisible] = createSignal(true);

  const validPlayerMoves = createMemo(() => {
    if (!validMovesVisible() || !table.selectedCoordinate) return [];
    const tile = getTileAt(board(), table.selectedCoordinate);
    if (!tile) return [];

    return validMoves(board(), playerColor(), table.selectedCoordinate);
  });

  const removeSelectedTile = () => {
    const coordinate = table.selectedCoordinate;
    if (!coordinate || !getTileAt(board(), coordinate)) return;
    setBoard(popTile(coordinate));
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

  const toggleValidMovesVisible = () => {
    setValidMovesVisible((curr) => !curr);
  };

  const increaseStackHeight = () => {
    const coordinate = table.selectedCoordinate;
    if (!coordinate) return;
    const topTile = getTileAt(board(), coordinate);
    if (!topTile) return;

    setBoard(
      chainBoardChanges(
        popTile(coordinate),
        placeTile(tile('w', 'A'), coordinate),
        placeTile(topTile, coordinate)
      )
    );
  };

  const decreaseStackHeight = () => {
    const coordinate = table.selectedCoordinate;
    if (!coordinate) return;
    const stackHeight = getStackHeight(board(), coordinate);
    if (stackHeight <= 1) return;
    const topTile = getTileAt(board(), coordinate);
    if (!topTile) return;

    setBoard(
      chainBoardChanges(
        popTile(coordinate),
        popTile(coordinate),
        placeTile(topTile, coordinate)
      )
    );
  };

  const clearBoard = () => {
    setBoard({});
    setTable('selectedCoordinate', undefined);
  };

  const getBoardNotation = () => boardNotation(board());

  const setBoardByNotation = (notation: string) => {
    setBoard(parseBoardNotation(notation));
  };

  createShortcut(['A'], () => toggleSelectedTile('A'));
  createShortcut(['B'], () => toggleSelectedTile('B'));
  createShortcut(['G'], () => toggleSelectedTile('G'));
  createShortcut(['L'], () => toggleSelectedTile('L'));
  createShortcut(['M'], () => toggleSelectedTile('M'));
  createShortcut(['P'], () => toggleSelectedTile('P'));
  createShortcut(['Q'], () => toggleSelectedTile('Q'));
  createShortcut(['S'], () => toggleSelectedTile('S'));
  createShortcut(['X'], () => removeSelectedTile());
  createShortcut(['tab'], toggleValidMovesVisible, { preventDefault: true });
  createShortcut(['Shift', '+'], increaseStackHeight);
  createShortcut(['-'], decreaseStackHeight);
  createShortcut(['C'], togglePlayerColor);

  return (
    <BoardContext.Provider
      value={{
        board,
        boardNotation: getBoardNotation,
        playerColor,
        validMoves: validPlayerMoves,
        validMovesVisible,

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
