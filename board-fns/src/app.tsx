import styles from './app.module.css';
import { Table } from './table';
import { GameBoard } from '@hive-lib';
import { Board } from './svg-components/board';

export const App = () => {
  const board: GameBoard = {
    0: {
      '-1': ['wB'],
      0: ['bB'],
      1: ['wB']
    },
    1: {
      0: ['bB']
    }
  };
  return (
    <div class={styles.app}>
      <Table>
        <Board board={board} />
      </Table>
    </div>
  );
};
