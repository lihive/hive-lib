import { FLAT_TOP, HexOrientation } from '@hive-lib';
import { createContext, ParentProps, useContext } from 'solid-js';
import { createStore, SetStoreFunction, Store } from 'solid-js/store';

interface TableConfig {
  // global
  hexOrientation: HexOrientation;
  hexSize: number;

  // example hex
  hexPadding: number;
  hexRounding: number;
  hexPrecision: number;
}

const TableContext =
  createContext<[Store<TableConfig>, SetStoreFunction<TableConfig>]>();

export const TableProvider = (props: ParentProps) => {
  const [table, setTable] = createStore({
    hexOrientation: { ...FLAT_TOP },
    hexSize: 192,
    hexPadding: 24,
    hexRounding: 24,
    hexPrecision: 2
  });

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
