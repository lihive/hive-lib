import styles from './generator-controls.module.css';
import { useBoard } from './board-provider';
import { For, Show } from 'solid-js';
import { useTable } from './table-provider';
import { RoundedHex } from './rounded-hex';
import { hexToTransform } from '@hive-lib';
import { useGenerator } from './generator-provider';

export const GeneratorControls = () => {
  const { validMovesVisible, clearBoard } = useBoard();
  const { cases, clearSuite } = useGenerator();

  const boardKeys = () => Object.keys(cases);
  const saveSuite = () => {
    console.log(JSON.stringify(cases));
  };

  return (
    <div class={styles.generatorControls}>
      <Show when={validMovesVisible()}>
        <div class={styles.section}>
          <div class={styles.grid}>
            <ActivePlayerRow />
          </div>
        </div>
      </Show>
      <div class={styles.section}>
        <div class={styles.grid}>
          <OrientationRow />
        </div>
      </div>
      <div class={styles.sectionButtons}>
        <div class={styles.textButton} onClick={clearBoard}>
          Clear board
        </div>
        <div class={styles.textButton} onClick={clearSuite}>
          Clear test suite
        </div>
        <div class={styles.textButton}>Load test suite</div>
        <div class={styles.textButton} onClick={saveSuite}>
          Save test suite
        </div>
      </div>
      <div class={styles.sectionScrollable}>
        <div class={styles.cases}>
          <For each={boardKeys()}>
            {(board) => <TestCaseRow board={board} />}
          </For>
        </div>
      </div>
    </div>
  );
};

const ActivePlayerRow = () => {
  const { playerColor } = useBoard();

  return (
    <>
      <div>Active player is</div>
      <div
        classList={{
          [styles.cellText]: true,
          [styles.playerTagBlack]: playerColor() === 'b',
          [styles.playerTagWhite]: playerColor() === 'w'
        }}
      >
        {playerColor() === 'b' ? 'black' : 'white'}
      </div>
      <kbd>C</kbd>
    </>
  );
};

const OrientationRow = () => {
  const [table] = useTable();

  return (
    <>
      <div>Orientation</div>
      <div class={styles.rowText}>
        <svg width={16} height={16} viewBox='-8 -8 16 16'>
          <RoundedHex
            transform={hexToTransform({ q: 0, r: 0 }, 8, table.hexOrientation)}
            hexSize={8}
            hexPrecision={0}
          />
        </svg>
        {table.hexOrientation.id === 'flat-top' ? 'Flat Top' : 'Pointy Top'}
      </div>
      <kbd>O</kbd>
    </>
  );
};

const TestCaseRow = (props: { board: string }) => {
  const { deleteCase } = useGenerator();
  const { boardNotation, setBoardByNotation } = useBoard();
  const isActive = () => boardNotation() === props.board;
  return (
    <div class={styles.caseRow}>
      <div
        classList={{
          [styles.caseLabel]: true,
          [styles.boldText]: isActive()
        }}
        onClick={() => setBoardByNotation(props.board)}
      >
        {props.board}
      </div>
      <div class={styles.textButton} onClick={() => deleteCase(props.board)}>
        x
      </div>
    </div>
  );
};
