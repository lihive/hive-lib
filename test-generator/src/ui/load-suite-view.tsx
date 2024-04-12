import styles from './load-view.module.css';
import { createSignal } from 'solid-js';
import { TextButton } from './text-button';
import { useTable } from '../table-provider';
import { useGenerator } from '../generator-provider';

interface LoadSuiteViewProps {
  close: () => void;
}

export const LoadSuiteView = (props: LoadSuiteViewProps) => {
  const [input, setInput] = createSignal('');

  const { setSelectedCoordinate } = useTable();
  const { loadSuite } = useGenerator();

  const onCancel = () => {
    props.close();
  };

  const onLoad = () => {
    loadSuite(input());
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
