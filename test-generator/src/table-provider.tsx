import {
  FLAT_TOP,
  HexCoordinate,
  HexOrientation,
  relativeHexCoordinate
} from '@hive-lib';
import { createContext, ParentProps, useContext } from 'solid-js';
import { createStore, SetStoreFunction, Store } from 'solid-js/store';
import { createShortcut } from '@solid-primitives/keyboard';

interface TableConfig {
  // global hex props
  hexOrientation: HexOrientation;
  hexSize: number;
  hexPrecision: number;

  // tile props
  tilePadding: number;
  tileRounding: number;

  // interactive coordinates
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
    hoverCoordinate: undefined,
    selectedCoordinate: undefined
  });

  const selectInDirection = (flat: number, pointy: number) => () => {
    if (!table.selectedCoordinate) return;
    setTable(
      'selectedCoordinate',
      table.hexOrientation.id === 'flat-top'
        ? relativeHexCoordinate(table.selectedCoordinate, flat)
        : relativeHexCoordinate(table.selectedCoordinate, pointy)
    );
  };

  createShortcut(['ArrowUp'], selectInDirection(6, 1));
  createShortcut(['ArrowDown'], selectInDirection(3, 4));
  createShortcut(['ArrowLeft'], selectInDirection(4, 5));
  createShortcut(['ArrowRight'], selectInDirection(1, 2));
  createShortcut(['escape'], () => setTable('selectedCoordinate', undefined));

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
