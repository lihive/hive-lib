import styles from './table.module.css';
import { useTable } from './table-provider';
import { getStackHeight, hexToTransform } from '@hive-lib';
import { Show } from 'solid-js';
import { useBoard } from './board-provider';
import { RoundedHex } from './rounded-hex';

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
            <g transform={tileOffsetTransform(Math.max(0, stackHeight() - 1))}>
              <RoundedHex
                class={styles.selectedHex}
                hexSize={table.hexSize}
                hexPrecision={table.hexPrecision}
                hexPadding={stackHeight() === 0 ? 1 : table.tilePadding}
                hexRounding={table.tileRounding}
              />
            </g>
          </g>
        );
      }}
    </Show>
  );
};

function tileOffsetTransform(index: number) {
  return `translate(${3 * index} ${-2 * index})`;
}
