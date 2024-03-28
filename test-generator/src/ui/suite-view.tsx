import styles from './suite-view.module.css';
import { useBoard } from '../board-provider';
import { useGenerator } from '../generator-provider';
import { TextButton } from './text-button';
import { GridRowActivePlayer } from './grid-row-active-player';
import { GridRowOrientation } from './grid-row-orientation';
import { For } from 'solid-js';
import { GridRowBoard } from './grid-row-board';

interface SuiteViewProps {
  load: () => void;
  save: () => void;
}

export const SuiteView = (props: SuiteViewProps) => {
  const { clearBoard } = useBoard();
  const { cases, clearSuite } = useGenerator();

  const boards = () => Object.entries(cases);

  return (
    <>
      <div class={styles.info}>
        <GridRowActivePlayer />
        <GridRowOrientation />
      </div>
      <div class={styles.buttons}>
        <TextButton onClick={clearSuite}>Clear suite</TextButton>
        <TextButton onClick={props.load}>Load suite</TextButton>
        <TextButton onClick={clearBoard}>Clear board</TextButton>
        <TextButton onClick={props.save}>Save suite</TextButton>
      </div>
      <div class={styles.boardsScroller}>
        <div class={styles.boards}>
          <For each={boards()}>
            {([boardNotation, suite]) => (
              <GridRowBoard boardNotation={boardNotation} suite={suite} />
            )}
          </For>
        </div>
      </div>
    </>
  );
};
