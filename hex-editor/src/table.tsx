import styles from './table.module.css';
import { createSignal, ParentProps } from 'solid-js';

export const Table = (props: ParentProps) => {
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

  return (
    <svg ref={ref} class={styles.table} viewBox={viewbox()}>
      {props.children}
    </svg>
  );
};
