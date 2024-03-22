import styles from './table.module.css';
import { createSignal, ParentProps } from 'solid-js';
import { BugSymbols } from './bug-symbols';
import { useTable } from './table-provider';

export const Table = (props: ParentProps) => {
  const [, setTable] = useTable();
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

    svg.addEventListener('mouseout', () => {
      setTable('hoverCoordinate', undefined);
    });
  };

  return (
    <svg ref={ref} class={styles.table} viewBox={viewbox()}>
      <BugSymbols />
      {props.children}
    </svg>
  );
};
