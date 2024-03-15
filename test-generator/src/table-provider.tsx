import {
  BugId,
  FLAT_TOP,
  GameBoard,
  getTileAt,
  getTileBug,
  getTileColor,
  HexCoordinate,
  HexOrientation,
  placeTileMut,
  popTileMut,
  tile
} from '@hive-lib';
import { createContext, ParentProps, useContext } from 'solid-js';
import { createStore, produce, SetStoreFunction, Store } from 'solid-js/store';
import { createShortcut } from '@solid-primitives/keyboard';

interface TableConfig {
  // global hex props
  hexOrientation: HexOrientation;
  hexSize: number;
  hexPrecision: number;

  // tile props
  tilePadding: number;
  tileRounding: number;

  // board + interactivity
  board: GameBoard;
  hoverCoordinate: HexCoordinate | undefined;
  selectedCoordinate: HexCoordinate | undefined;
}

const TableContext =
  createContext<[Store<TableConfig>, SetStoreFunction<TableConfig>]>();

export const TableProvider = (props: ParentProps) => {
  const [table, setTable] = createStore<TableConfig>({
    hexOrientation: { ...FLAT_TOP },
    hexSize: 48,
    hexPrecision: 0,
    tilePadding: 4,
    tileRounding: 8,
    board: {},
    hoverCoordinate: undefined,
    selectedCoordinate: undefined
  });

  const removeSelectedTile = () => {
    const coordinate = table.selectedCoordinate;
    if (!coordinate) return;
    setTable(
      produce((table) => {
        popTileMut(table.board, coordinate);
      })
    );
  };

  const toggleSelectedTile = (bug: BugId) => {
    const coordinate = table.selectedCoordinate;
    if (!coordinate) return;
    const currentTile = getTileAt(table.board, coordinate);

    // place white tile if there isn't any tile
    if (!currentTile) {
      setTable(
        produce((table) => {
          placeTileMut(table.board, tile('w', bug), coordinate);
        })
      );
      return;
    }

    const currentBug = getTileBug(currentTile);
    const currentColor = getTileColor(currentTile);

    // if a different bug is there, replace it
    if (currentBug !== bug) {
      setTable(
        produce((table) => {
          popTileMut(table.board, coordinate);
          placeTileMut(table.board, tile('w', bug), coordinate);
        })
      );
      return;
    }

    setTable(
      produce((table) => {
        popTileMut(table.board, coordinate);
        placeTileMut(
          table.board,
          tile(currentColor === 'w' ? 'b' : 'w', bug),
          coordinate
        );
      })
    );
  };

  createShortcut(['escape'], () => setTable('selectedCoordinate', undefined));
  createShortcut(['A'], () => toggleSelectedTile('A'));
  createShortcut(['B'], () => toggleSelectedTile('B'));
  createShortcut(['G'], () => toggleSelectedTile('G'));
  createShortcut(['L'], () => toggleSelectedTile('L'));
  createShortcut(['M'], () => toggleSelectedTile('M'));
  createShortcut(['P'], () => toggleSelectedTile('P'));
  createShortcut(['Q'], () => toggleSelectedTile('Q'));
  createShortcut(['S'], () => toggleSelectedTile('S'));
  createShortcut(['X'], () => removeSelectedTile());

  return (
    <TableContext.Provider value={[table, setTable]}>
      {props.children}
    </TableContext.Provider>
  );
};

export const useTable = () => {
  const table = useContext(TableContext);
  if (!table) throw new Error('useTable: could not find TableContext');
  return table;
};
