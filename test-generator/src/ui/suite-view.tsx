import styles from './suite-view.module.css';
import { useBoard } from '../board-provider';
import { useGenerator } from '../generator-provider';
import { TextButton } from './text-button';
import { GridRowActivePlayer } from './grid-row-active-player';
import { GridRowOrientation } from './grid-row-orientation';
import { createSignal, For } from 'solid-js';
import { GridRowBoard } from './grid-row-board';
import { GridRowLastMove } from './grid-row-last-move';
import { writeClipboard } from '@solid-primitives/clipboard';
import { boardNotation } from '@hive-lib';

interface SuiteViewProps {
  loadBoard: () => void;
  loadSuite: () => void;
}

export const SuiteView = (props: SuiteViewProps) => {
  const { board, clearBoard } = useBoard();
  const { cases, clearSuite } = useGenerator();
  const [copyBoardText, setCopyBoardText] = createSignal('Copy board');
  const [copySuiteText, setCopySuiteText] = createSignal('Copy suite');

  const boards = () => Object.entries(cases);

  const copyBoard = () => {
    writeClipboard(boardNotation(board()))
      .then(() => {
        setCopyBoardText('Copied!');
        setTimeout(() => setCopyBoardText('Copy board'), 2000);
      })
      .catch(() => console.error('Unable to write to clipboard'));
  };

  const copySuite = () => {
    writeClipboard(JSON.stringify(cases))
      .then(() => {
        setCopySuiteText('Copied!');
        setTimeout(() => setCopySuiteText('Copy suite'), 2000);
      })
      .catch(() => console.error('Unable to write to clipboard'));
  };

  return (
    <>
      <div class={styles.info}>
        <div>Keyboard shortcuts</div>
        <kbd>?</kbd>
        <GridRowActivePlayer />
        <GridRowOrientation />
        <GridRowLastMove />
      </div>
      <div class={styles.buttons}>
        <TextButton onClick={clearSuite}>Clear suite</TextButton>
        <TextButton onClick={props.loadSuite}>Load suite</TextButton>
        <TextButton onClick={copySuite}>{copySuiteText()}</TextButton>
        <TextButton onClick={clearBoard}>Clear board</TextButton>
        <TextButton onClick={props.loadBoard}>Load board</TextButton>
        <TextButton onClick={copyBoard}>{copyBoardText()}</TextButton>
      </div>
      <div class={styles.boardsScroller}>
        <div class={styles.boards}>
          <For each={boards()}>
            {([gameNotation, suite]) => (
              <GridRowBoard gameNotation={gameNotation} suite={suite} />
            )}
          </For>
        </div>
      </div>
    </>
  );
};
