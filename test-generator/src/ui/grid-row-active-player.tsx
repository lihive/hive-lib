import styles from './suite-view.module.css';
import { useBoard } from '../board-provider';

export const GridRowActivePlayer = () => {
  const { playerColor } = useBoard();

  const classList = () => ({
    [styles.playerTagBlack]: playerColor() === 'b',
    [styles.playerTagWhite]: playerColor() === 'w'
  });

  const colorText = () => (playerColor() === 'b' ? 'black' : 'white');

  return (
    <>
      <div class={styles.rowText}>
        <div>Showing valid moves for</div>
        <div classList={classList()}>{colorText()}</div>
      </div>
      <kbd>C</kbd>
    </>
  );
};
