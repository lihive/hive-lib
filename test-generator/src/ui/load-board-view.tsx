import { createSignal } from 'solid-js';
import { useBoard } from '../board-provider';
import { parseBoardNotation } from '@hive-lib';
import styles from './load-view.module.css';
import { TextButton } from './text-button';
import { useTable } from '../table-provider';

interface LoadBoardViewProps {
  close: () => void;
}

export const LoadBoardView = (props: LoadBoardViewProps) => {
  const [input, setInput] = createSignal('');

  const { setBoard } = useBoard();
  const { setSelectedCoordinate } = useTable();

  const onCancel = () => {
    props.close();
  };

  const onLoad = () => {
    setBoard(parseBoardNotation(input()));
    props.close();
  };

  return (
    <>
      <div class={styles.buttons}>
        <TextButton onClick={onCancel}>Cancel</TextButton>
        <TextButton onClick={onLoad}>Load</TextButton>
      </div>
      <textarea
        class={styles.input}
        placeholder='Paste test suite JSON here'
        spellcheck={false}
        value={input()}
        onFocus={() => setSelectedCoordinate(undefined)}
        onInput={(event) => setInput(event.currentTarget.value)}
      />
    </>
  );
};
