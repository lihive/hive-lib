import styles from './suite-view.module.css';
import { useBoard } from '../board-provider';
import { TextButton } from './text-button';
import { useGenerator } from '../generator-provider';
import { For, Show } from 'solid-js';
import { GridRowValidMoveSet, ValidMoveSet } from './grid-row-valid-move-set';
import { Color, parseHexCoordinateKey } from '@hive-lib';

interface GridRowBoardProps {
  gameNotation: string;
  suite: BoardSuite;
}

interface BoardSuite {
  // player color
  [key: string]: {
    // hex coordinate
    [key: string]: string; // valid moves
  };
}

export const GridRowBoard = (props: GridRowBoardProps) => {
  const { deleteBoard } = useGenerator();
  const { gameNotation, setGameNotation } = useBoard();

  const isActiveBoard = () => {
    return props.gameNotation === gameNotation();
  };

  const classList = () => ({
    [styles.boardLabel]: true,
    [styles.bold]: isActiveBoard()
  });

  const onClickBoard = () => {
    setGameNotation(props.gameNotation);
  };

  const onClickDelete = () => {
    deleteBoard(props.gameNotation);
  };

  return (
    <div class={styles.rowContents}>
      <div classList={classList()} onClick={onClickBoard}>
        {props.gameNotation}
      </div>
      <TextButton onClick={onClickDelete}>x</TextButton>
      <Show when={isActiveBoard()}>
        <For each={validMoveSet(props.suite)}>
          {(validMoveSet) => (
            <GridRowValidMoveSet
              board={props.gameNotation}
              validMoveSet={validMoveSet}
            />
          )}
        </For>
      </Show>
    </div>
  );
};

function validMoveSet(suite: BoardSuite): ValidMoveSet[] {
  const validMoveSet: ValidMoveSet[] = [];
  parse('b');
  parse('w');
  return validMoveSet;

  function parse(color: Color) {
    if (!suite[color]) return;
    Object.entries(suite[color]).forEach(([targetKey, validKeys]) => {
      const target = parseHexCoordinateKey(targetKey);
      const valid = validKeys.length
        ? validKeys.split(',').map(parseHexCoordinateKey)
        : [];
      validMoveSet.push({ color, target, valid });
    });
  }
}
