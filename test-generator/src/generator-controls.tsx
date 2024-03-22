import styles from './generator-controls.module.css';
import { useBoard } from './board-provider';

export const GeneratorControls = () => {
  const { board } = useBoard();
  return (
    <div class={styles.generatorControls}>
      <pre>{JSON.stringify(board(), null, 2)}</pre>
    </div>
  );
};
