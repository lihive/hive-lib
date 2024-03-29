import {
  CartesianCoordinate,
  FLAT_TOP,
  HexCoordinate,
  HexOrientation,
  POINTY_TOP,
  relativeHexCoordinate
} from '@hive-lib';
import { createContext, ParentProps, useContext } from 'solid-js';
import { createStore } from 'solid-js/store';
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
  mouseCoordinate: CartesianCoordinate | undefined;
  hoverCoordinate: HexCoordinate | undefined;
  selectedCoordinate: HexCoordinate | undefined;
}

interface TableAPI {
  table: TableConfig;
  setHoverCoordinate: (coordinate: HexCoordinate | undefined) => void;
  setMouseCoordinate: (coordinate: CartesianCoordinate | undefined) => void;
  setSelectedCoordinate: (coordinate: HexCoordinate | undefined) => void;
}

const TableContext = createContext<TableAPI>();

export const TableProvider = (props: ParentProps) => {
  const [table, setTable] = createStore<TableConfig>({
    hexOrientation: { ...FLAT_TOP },
    hexSize: 48,
    hexPrecision: 0,
    tilePadding: 4,
    tileRounding: 8,
    mouseCoordinate: undefined,
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

  const setHoverCoordinate = (coordinate: HexCoordinate | undefined) =>
    setTable('hoverCoordinate', coordinate);

  const setMouseCoordinate = (coordinate: CartesianCoordinate | undefined) =>
    setTable('mouseCoordinate', coordinate);

  const setSelectedCoordinate = (coordinate: HexCoordinate | undefined) =>
    setTable('selectedCoordinate', coordinate);

  createShortcut(['ArrowUp'], selectInDirection(6, 1));
  createShortcut(['ArrowDown'], selectInDirection(3, 4));
  createShortcut(['ArrowLeft'], selectInDirection(4, 5));
  createShortcut(['ArrowRight'], selectInDirection(1, 2));
  createShortcut(['escape'], () => setTable('selectedCoordinate', undefined));
  createShortcut(['O'], () =>
    setTable(
      'hexOrientation',
      table.hexOrientation.id === 'flat-top' ? POINTY_TOP : FLAT_TOP
    )
  );

  return (
    <TableContext.Provider
      value={{
        table,
        setHoverCoordinate,
        setMouseCoordinate,
        setSelectedCoordinate
      }}
    >
      {props.children}
    </TableContext.Provider>
  );
};

export const useTable = () => {
  const table = useContext(TableContext);
  if (!table) throw new Error('useTable: could not find TableContext');
  return table;
};
