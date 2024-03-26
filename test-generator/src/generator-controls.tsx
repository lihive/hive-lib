import styles from './generator-controls.module.css';
import { useBoard } from './board-provider';
import { createSignal, For, Match, Show, Switch } from 'solid-js';
import { useTable } from './table-provider';
import { RoundedHex } from './rounded-hex';
import {
  Color,
  HexCoordinate,
  hexesEqual,
  hexToTransform,
  parseHexCoordinateKey
} from '@hive-lib';
import { useGenerator } from './generator-provider';

export const GeneratorControls = () => {
  const { validMovesVisible, clearBoard } = useBoard();
  const { cases, clearSuite } = useGenerator();

  const [view, setView] = createSignal<'default' | 'save' | 'load'>('default');

  const boardKeys = () => Object.keys(cases);

  const loadSuite = () => {};

  return (
    <div class={styles.generatorControls}>
      <Switch>
        <Match when={view() === 'save'}>
          <div class={styles.sectionButtons}>
            <div class={styles.textButton} onClick={() => setView('default')}>
              Back
            </div>
          </div>
          <div class={styles.sectionScrollable}>
            <div class={styles.pre}>{JSON.stringify(cases)}</div>
          </div>
        </Match>
        <Match when={view() === 'default'}>
          <Show when={validMovesVisible()}>
            <div class={styles.section}>
              <div class={styles.grid}>
                <ActivePlayerRow />
              </div>
            </div>
          </Show>
          <div class={styles.section}>
            <div class={styles.grid}>
              <OrientationRow />
            </div>
          </div>
          <div class={styles.sectionButtons}>
            <div class={styles.textButton} onClick={clearBoard}>
              Clear board
            </div>
            <div class={styles.textButton} onClick={clearSuite}>
              Clear test suite
            </div>
            <div class={styles.textButton} onClick={loadSuite}>
              Load test suite
            </div>
            <div class={styles.textButton} onClick={() => setView('save')}>
              Save test suite
            </div>
          </div>
          <div class={styles.sectionScrollable}>
            <div class={styles.cases}>
              <For each={boardKeys()}>
                {(board) => <TestCaseRow board={board} />}
              </For>
            </div>
          </div>
        </Match>
      </Switch>
    </div>
  );
};

const ActivePlayerRow = () => {
  const { playerColor } = useBoard();

  return (
    <>
      <div>Active player is</div>
      <div
        classList={{
          [styles.cellText]: true,
          [styles.playerTagBlack]: playerColor() === 'b',
          [styles.playerTagWhite]: playerColor() === 'w'
        }}
      >
        {playerColor() === 'b' ? 'black' : 'white'}
      </div>
      <kbd>C</kbd>
    </>
  );
};

const OrientationRow = () => {
  const [table] = useTable();

  return (
    <>
      <div>Orientation</div>
      <div class={styles.rowText}>
        <svg width={16} height={16} viewBox='-8 -8 16 16'>
          <RoundedHex
            transform={hexToTransform({ q: 0, r: 0 }, 8, table.hexOrientation)}
            hexSize={8}
            hexPrecision={0}
          />
        </svg>
        {table.hexOrientation.id === 'flat-top' ? 'Flat Top' : 'Pointy Top'}
      </div>
      <kbd>O</kbd>
    </>
  );
};

interface DetailData {
  color: Color;
  target: HexCoordinate;
  valid: HexCoordinate[];
}

const TestCaseRow = (props: { board: string }) => {
  const { cases, deleteCase } = useGenerator();
  const { boardNotation, setBoardByNotation, setPlayerColor } = useBoard();
  const [table, setTable] = useTable();

  const isActive = () => boardNotation() === props.board;

  const details = (): DetailData[] => {
    const detailData: DetailData[] = [];
    const parse = (color: Color) => {
      const data = cases[props.board][color];
      if (!data) return;
      Object.entries(data).forEach(([targetKey, validKeys]) => {
        const target = parseHexCoordinateKey(targetKey);
        const valid = validKeys.length
          ? validKeys.split(',').map(parseHexCoordinateKey)
          : [];
        detailData.push({ color, target, valid });
      });
    };
    parse('b');
    parse('w');
    return detailData;
  };

  return (
    <div class={styles.caseRow}>
      <div
        classList={{
          [styles.caseLabel]: true,
          [styles.boldText]: isActive()
        }}
        onClick={() => setBoardByNotation(props.board)}
      >
        {props.board}
      </div>
      <div class={styles.textButton} onClick={() => deleteCase(props.board)}>
        x
      </div>
      <Show when={isActive()}>
        <div class={styles.caseDetails}>
          <For each={details()}>
            {(detail: DetailData) => {
              const isDetailActive = () =>
                hexesEqual(table.selectedCoordinate, detail.target);
              return (
                <div
                  classList={{
                    [styles.caseDetailRow]: true,
                    [styles.boldText]: isDetailActive()
                  }}
                  onClick={() => {
                    setPlayerColor(detail.color);
                    setTable('selectedCoordinate', detail.target);
                  }}
                >
                  {detail.color}({detail.target.q}, {detail.target.r}){' '}
                  {detail.valid.length} valid moves
                </div>
              );
            }}
          </For>
        </div>
      </Show>
    </div>
  );
};
