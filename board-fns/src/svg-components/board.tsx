import { GameBoard, getStacks } from '@hive-lib';
import { For } from 'solid-js';
import { Stack } from './stack';

interface BoardProps {
  board: GameBoard;
}

export const Board = (props: BoardProps) => {
  const stacks = () => getStacks(props.board, true);
  return (
    <g>
      <For each={stacks()}>{(stack) => <Stack stack={stack} />}</For>
    </g>
  );
};
