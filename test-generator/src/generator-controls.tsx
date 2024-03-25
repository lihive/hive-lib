import styles from './generator-controls.module.css';
import { useBoard } from './board-provider';
import { For, Show } from 'solid-js';
import { useTable } from './table-provider';
import { RoundedHex } from './rounded-hex';
import { hexToTransform } from '@hive-lib';
import { useGenerator } from './generator-provider';

export const GeneratorControls = () => {
  const { validMovesVisible } = useBoard();
  const { cases, deleteBoard } = useGenerator();

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
      <For each={Object.keys(cases)}>
        {(board) => {
          return <div onClick={() => deleteBoard(board)}>{board}</div>;
        }}
      </For>
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
