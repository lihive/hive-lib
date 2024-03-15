import { useTable } from './table-provider';
import { For } from 'solid-js';
import { getStacks, renderSort } from '@hive-lib';
import { Stack } from './stack';

export const Stacks = () => {
  const [table] = useTable();

  return (
    <g>
      <For each={renderSort(getStacks(table.board))}>
        {(stack) => <Stack stack={stack} />}
      </For>
    </g>
  );
};
