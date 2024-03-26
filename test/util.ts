import { describe, it } from 'vitest';
import { parseBoardNotation } from '../src/notation';
import { hexCoordinateKey, parseHexCoordinateKey } from '../src/hex';
import { validMoves } from '../src/move';
import { Color } from '../src/types';

export type ValidMoveTestSuite = {
  // board notation
  [key: string]: {
    // player color
    [key: string]: {
      // hex coordinate
      [key: string]: string; // valid moves
    };
  };
};

export function runValidMoveTestSuite(suite: ValidMoveTestSuite) {
  Object.entries(suite).forEach(([boardNotation, data]) => {
    describe(boardNotation, () => {
      const board = parseBoardNotation(boardNotation);
      ['w', 'b'].forEach((color) => {
        if (!data[color]) return;
        Object.entries(data[color]).forEach(([coordinateKey, solutionSet]) => {
          const coordinate = parseHexCoordinateKey(coordinateKey);
          const validMoveSet = new Set(
            solutionSet.length ? solutionSet.split(',') : []
          );
          const validMovesResult = validMoves(
            board,
            color as Color,
            coordinate
          );

          it(`(${coordinate.q}, ${coordinate.r}): ${color === 'w' ? 'white' : 'black'} has ${validMovesResult.length} valid moves`, async ({
            expect
          }) => {
            expect(validMovesResult.length).toBe(validMoveSet.size);
            validMovesResult.forEach((validMove) => {
              expect(
                validMoveSet.has(hexCoordinateKey(validMove))
              ).toBeTruthy();
            });
          });
        });
      });
    });
  });
}
