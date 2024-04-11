import styles from './table.module.css';
import { createSignal, ParentProps } from 'solid-js';
import { BugSymbols } from './bug-symbols';
import { useTable } from './table-provider';
import { SVGSVGMouseEventHandler } from './types';

export const Table = (props: ParentProps) => {
  let svgElement: SVGSVGElement | null = null;
  const { setMouseCoordinate, setHoverCoordinate } = useTable();
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
      setHoverCoordinate(undefined);
    });

    svgElement = svg;
  };

  const onMouseLeave = () => {
    setMouseCoordinate(undefined);
  };

  const onMouseMove: SVGSVGMouseEventHandler = (event) => {
    if (svgElement) {
      let pt = svgElement.createSVGPoint();
      pt.x = event.clientX;
      pt.y = event.clientY;
      pt = pt.matrixTransform(svgElement.getScreenCTM()?.inverse());
      setMouseCoordinate({
        x: Math.round(pt.x),
        y: Math.round(pt.y)
      });
    }
  };

  return (
    <svg
      ref={ref}
      class={styles.table}
      viewBox={viewbox()}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
    >
      <BugSymbols />
      {props.children}
    </svg>
  );
};
