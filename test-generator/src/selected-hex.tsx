import styles from './table.module.css';
import { useTable } from './table-provider';
import { getStackHeight, hexToTransform } from '@hive-lib';
import { Show } from 'solid-js';
import { RoundedHex } from '../../hex-editor/src/rounded-hex';
import { useBoard } from './board-provider';

export const SelectedHex = () => {
  const { table } = useTable();
  const { board } = useBoard();

  return (
    <Show when={table.selectedCoordinate}>
      {(coordinate) => {
        const stackHeight = () => getStackHeight(board(), coordinate());
        return (
          <g
            transform={hexToTransform(
              coordinate(),
              table.hexSize,
              table.hexOrientation
            )}
          >
            <RoundedHex
              class={styles.selectedHex}
              hexSize={table.hexSize}
              hexOrientation={table.hexOrientation}
              hexPrecision={table.hexPrecision}
              hexPadding={() => (stackHeight() === 0 ? 0 : table.tilePadding)}
              hexRounding={() => (stackHeight() === 0 ? 0 : table.tileRounding)}
            />
          </g>
        );
      }}
    </Show>
  );
};
