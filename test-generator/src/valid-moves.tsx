import { useTable } from './table-provider';
import { For } from 'solid-js';
import { hexToTransform } from '@hive-lib';
import { useBoard } from './board-provider';

export const ValidMoves = () => {
  const { table } = useTable();
  const { validMoves } = useBoard();

  return (
    <For each={validMoves()}>
      {(coord) => {
        return (
          <g
            style={{ 'pointer-events': 'none' }}
            transform={hexToTransform(
              coord,
              table.hexSize,
              table.hexOrientation
            )}
          >
            <circle
              r={table.hexSize / 4}
              fill='mediumseagreen'
              stroke='seagreen'
              stroke-width='2px'
            />
          </g>
        );
      }}
    </For>
  );
};
