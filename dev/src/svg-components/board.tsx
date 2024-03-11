import { GameBoard } from '@hive-lib/types';
import { Hex } from './hex';
import { useTable } from '../table';
import { getStacks } from '@hive-lib/board';
import { For } from 'solid-js';
import { hexToTransform } from '@hive-lib/hex';

interface BoardProps {
  board: GameBoard;
}

export const Board = (props: BoardProps) => {
  const table = useTable();
  const stacks = () => getStacks(props.board, true);
  return (
    <g>
      <For each={stacks()}>
        {(stack) => {
          return (
            <g
              transform={hexToTransform(
                stack.coordinate,
                table.hexSize,
                table.hexOrientation
              )}
            >
              <Hex size={table.hexSize} />
            </g>
          );
        }}
      </For>
    </g>
  );
};
