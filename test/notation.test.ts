import { describe, expect, test } from 'vitest';
import { Move } from '../src/types';
import { movesNotation, parseMovesNotation } from '../src/notation';

describe('notation', () => {
  describe('moves notation', () => {
    test('generate/parse', () => {
      const moves: Move[] = [
        { tileId: 'wA', to: { q: 0, r: 0 } },
        { tileId: 'bA', to: { q: 1, r: 0 } },
        { tileId: 'wB', to: { q: -1, r: 1 } },
        { tileId: 'bG', to: { q: 0, r: -1 } },
        { pass: true },
        { tileId: 'bQ', to: { q: -1, r: 0 } },
        { from: { q: -1, r: 1 }, to: { q: 0, r: 0 } },
        { from: { q: 0, r: -1 }, to: { q: 0, r: 1 } }
      ];
      const notation = movesNotation(moves);
      console.log(notation);
      const parsed: Move[] = parseMovesNotation(notation);
      expect(moves).toEqual(parsed);
    });
  });
});
