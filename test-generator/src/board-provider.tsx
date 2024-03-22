import {
  BugId,
  chainBoardChanges,
  GameBoard,
  getTileAt,
  getTileBug,
  getTileColor,
  HexCoordinate,
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
  useContext
} from 'solid-js';
import { useTable } from './table-provider';
import { createShortcut } from '@solid-primitives/keyboard';

interface GameBoardAPI {
  board: Accessor<GameBoard>;
  validMoves: Accessor<HexCoordinate[]>;
}

const BoardContext = createContext<GameBoardAPI>();

export const BoardProvider = (props: ParentProps) => {
  const [table] = useTable();
  const [board, setBoard] = createSignal<GameBoard>({});
  const [validMovesVisible, setValidMovesVisible] = createSignal(true);

  const validPlayerMoves = createMemo(() => {
    if (!validMovesVisible() || !table.selectedCoordinate) return [];
    const tile = getTileAt(board(), table.selectedCoordinate);
    if (!tile) return [];

    return validMoves(board(), 'w', table.selectedCoordinate);
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

  const toggleValidMovesVisible = () => {
    setValidMovesVisible((curr) => !curr);
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

  return (
    <BoardContext.Provider value={{ board, validMoves: validPlayerMoves }}>
      {props.children}
    </BoardContext.Provider>
  );
};

export const useBoard = () => {
  const board = useContext(BoardContext);
  if (!board) throw new Error('useBoard: could not find a BoardContext');
  return board;
};
