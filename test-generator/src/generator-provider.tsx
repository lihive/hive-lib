import { createContext, ParentProps, useContext } from 'solid-js';
import { createShortcut } from '@solid-primitives/keyboard';
import {
  boardNotation,
  Color,
  HexCoordinate,
  hexCoordinateKey
} from '@hive-lib';
import { useTable } from './table-provider';
import { useBoard } from './board-provider';
import { createStore } from 'solid-js/store';
import { makePersisted } from '@solid-primitives/storage';

type TestCaseSet = {
  // board notation
  [key: string]: {
    // player color
    [key in Color]: {
      // hex coordinate
      [key: string]: HexCoordinate[]; // valid moves
    };
  };
};

interface GeneratorAPI {
  cases: TestCaseSet;
  deleteBoard: (board: string) => void;
}

const GeneratorContext = createContext<GeneratorAPI>();

export const GeneratorProvider = (props: ParentProps) => {
  const [cases, setCases] = makePersisted(createStore<TestCaseSet>({}));

  const [table] = useTable();
  const { board, playerColor, validMoves } = useBoard();

  const deleteBoard = (board: string) => {
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
        validMoves()
      );
    }
  };

  createShortcut(['Meta', 'S'], saveCurrent, { preventDefault: true });

  return (
    <GeneratorContext.Provider value={{ cases, deleteBoard }}>
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
