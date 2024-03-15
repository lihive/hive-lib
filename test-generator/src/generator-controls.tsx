import styles from './generator-controls.module.css';
import { useTable } from './table-provider';

export const GeneratorControls = () => {
  const [table] = useTable();
  return (
    <div class={styles.generatorControls}>
      <pre>{JSON.stringify(table.board, null, 2)}</pre>
    </div>
  );
};
