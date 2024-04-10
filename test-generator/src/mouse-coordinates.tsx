import styles from './mouse-coordinates.module.css';
import { useTable } from './table-provider';

export const MouseCoordinates = () => {
  const { table } = useTable();
  const classList = () => ({
    [styles.greenText]: table.selectedCoordinate !== undefined
  });
  return (
    <div class={styles.container}>
      <div>{`x: ${table.mouseCoordinate?.x ?? '-'}`}</div>
      <div>{`y: ${table.mouseCoordinate?.y ?? '-'}`}</div>
      <div>{`q: ${table.hoverCoordinate?.q ?? '-'}`}</div>
      <div>{`r: ${table.hoverCoordinate?.r ?? '-'}`}</div>
      <div
        classList={classList()}
      >{`q: ${table.selectedCoordinate?.q ?? '-'}`}</div>
      <div
        classList={classList()}
      >{`r: ${table.selectedCoordinate?.r ?? '-'}`}</div>
    </div>
  );
};
