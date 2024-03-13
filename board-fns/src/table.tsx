import styles from './table.module.css';
import { createContext, createSignal, ParentProps, useContext } from 'solid-js';
import { FLAT_TOP, HexOrientation, POINTY_TOP } from '@hive-lib';
import { BugSymbols } from './svg-components/bug-symbols';
import { createStore } from 'solid-js/store';

interface TableConfig {
  hexOrientation: HexOrientation;
  hexSize: number;
}

const TableContext = createContext<TableConfig>({
  hexOrientation: FLAT_TOP,
  hexSize: 48
});

export const Table = (props: ParentProps) => {
  const [table, setTable] = createStore({
    hexOrientation: { ...FLAT_TOP },
    hexSize: 96
  });

  const [tableDimensions, setTableDimensions] = createSignal({
    width: 0,
    height: 0
  });

  const viewbox = () => {
    const { width, height } = tableDimensions();
    return `${-width / 2} ${-height / 2} ${width} ${height}`;
  };

  const ref = (svg: SVGSVGElement) => {
    new ResizeObserver((entries) => {
      const contentRect = entries[0].contentRect;
      setTableDimensions({
        width: contentRect.width,
        height: contentRect.height
      });
    }).observe(svg);
  };

  const toggleOrientation = () => {
    setTable(
      'hexOrientation',
      table.hexOrientation.id === 'flat-top' ? POINTY_TOP : FLAT_TOP
    );
  };

  return (
    <TableContext.Provider value={table}>
      <svg ref={ref} class={styles.table} viewBox={viewbox()}>
        <BugSymbols />
        {props.children}
      </svg>
      <div style={{ position: 'absolute', top: '8px', right: '8px' }}>
        <button
          onClick={toggleOrientation}
        >{`${table.hexOrientation.id}`}</button>
      </div>
    </TableContext.Provider>
  );
};

export const useTable = () => useContext(TableContext);
