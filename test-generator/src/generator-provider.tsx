import { createContext, ParentProps, useContext } from 'solid-js';
import { createShortcut } from '@solid-primitives/keyboard';
import { boardNotation, hexCoordinateKey } from '@hive-lib';
import { useTable } from './table-provider';
import { useBoard } from './board-provider';
import { createStore, reconcile } from 'solid-js/store';
import { makePersisted } from '@solid-primitives/storage';

type TestCaseSet = {
  // board notation
  [key: string]: {
    // player color
    [key: string]: {
      // hex coordinate
      [key: string]: string; // valid moves
    };
  };
};

interface GeneratorAPI {
  cases: TestCaseSet;
  clearSuite: () => void;
  deleteBoard: (board: string) => void;
  deleteTarget: (board: string, color: string, target: string) => void;
  loadSuite: (suite: string) => void;
}

const GeneratorContext = createContext<GeneratorAPI>();

export const GeneratorProvider = (props: ParentProps) => {
  const [cases, setCases] = makePersisted(createStore<TestCaseSet>({}));

  const { table } = useTable();
  const { board, playerColor, validMoves } = useBoard();

  const clearSuite = () => {
    setCases(reconcile({}));
  };

  const deleteBoard = (board: string) => {
    setCases(board, undefined!);
  };

  const deleteTarget = (board: string, color: string, target: string) => {
    console.log('delete', board, color, target);

    setCases(board, color, target, undefined!);
    const black = Object.keys(cases[board]['b'] || {});
    const white = Object.keys(cases[board]['w'] || {});
    if (black.length === 0 && white.length === 0) {
      deleteBoard(board);
    }
  };

  const loadSuite = (suite: string) => {
    setCases(JSON.parse(suite));
  };

  const saveCurrent = () => {
    if (table.selectedCoordinate) {
      const notation = boardNotation(board());
      if (!cases[notation]) setCases(notation, {});
      if (!cases[notation][playerColor()])
        setCases(notation, playerColor(), {});
      setCases(
        notation,
        playerColor(),
        hexCoordinateKey(table.selectedCoordinate),
        validMoves().map(hexCoordinateKey).join(',')
      );
    }
  };

  createShortcut(['Meta', 'S'], saveCurrent, { preventDefault: true });

  return (
    <GeneratorContext.Provider
      value={{ cases, clearSuite, deleteBoard, deleteTarget, loadSuite }}
    >
      {props.children}
    </GeneratorContext.Provider>
  );
};

export const useGenerator = () => {
  const generator = useContext(GeneratorContext);
  if (!generator)
    throw new Error('useGenerator: could not find a GeneratorContext');
  return generator;
};
