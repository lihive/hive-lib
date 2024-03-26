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
  deleteCase: (board: string) => void;
}

const GeneratorContext = createContext<GeneratorAPI>();

export const GeneratorProvider = (props: ParentProps) => {
  const [cases, setCases] = makePersisted(createStore<TestCaseSet>({}));

  const [table] = useTable();
  const { board, playerColor, validMoves } = useBoard();

  const clearSuite = () => {
    setCases(reconcile({}));
  };

  const deleteCase = (board: string) => {
    setCases(board, undefined!);
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
    <GeneratorContext.Provider value={{ cases, clearSuite, deleteCase }}>
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
