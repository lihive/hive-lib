import styles from './table.module.css';
import { useBoard } from './board-provider';
import { Show } from 'solid-js';
import { RoundedHex } from './rounded-hex';
import { useTable } from './table-provider';
import { getStackHeight, hexToTransform } from '@hive-lib';

export const LastMoveHex = () => {
  const { table } = useTable();
  const { board, lastMove } = useBoard();

  return (
    <Show when={lastMove()?.to}>
      {(to) => {
        const stackHeight = () => getStackHeight(board(), to());
        return (
          <g
            transform={hexToTransform(
              to(),
              table.hexSize,
              table.hexOrientation
            )}
          >
            <g transform={tileOffsetTransform(Math.max(0, stackHeight() - 1))}>
              <RoundedHex
                class={styles.lastMoveHex}
                hexSize={table.hexSize}
                hexPrecision={table.hexPrecision}
                hexPadding={stackHeight() === 0 ? 0 : table.tilePadding}
                hexRounding={stackHeight() === 0 ? 0 : table.tileRounding}
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
