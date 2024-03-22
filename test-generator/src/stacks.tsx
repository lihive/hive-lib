import { For } from 'solid-js';
import { getStacks, renderSort } from '@hive-lib';
import { Stack } from './stack';
import { useBoard } from './board-provider';

export const Stacks = () => {
  const { board } = useBoard();

  return (
    <g>
      <For each={renderSort(getStacks(board()))}>
        {(stack) => <Stack stack={stack} />}
      </For>
    </g>
  );
};
