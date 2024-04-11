import styles from './mouse-coordinates.module.css';
import { useTable } from './table-provider';

export const MouseCoordinates = () => {
  const { table } = useTable();
  return (
    <div class={styles.container}>
      <div>{`(${table.mouseCoordinate?.x ?? '-'}, ${table.mouseCoordinate?.y ?? '-'})`}</div>
      <div
        class={table.hoverCoordinate ? styles.hightedLightGreen : undefined}
      >{`(${table.hoverCoordinate?.q ?? '-'}, ${table.hoverCoordinate?.r ?? '-'})`}</div>
      <div
        class={styles.highlightedGreen}
      >{`(${table.selectedCoordinate?.q ?? '-'}, ${table.selectedCoordinate?.r ?? '-'})`}</div>
    </div>
  );
};
