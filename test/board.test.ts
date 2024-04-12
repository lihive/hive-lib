import { describe, expect, test } from 'vitest';
import { BASE_GAME } from '../src/constants';
import { parseBoardNotation } from '../src/notation';
import { allQueensPlaced, allQueensSurrounded } from '../src/board';
import { createBaseGameConfig } from '../src/game';

describe('game board', () => {
  describe('allQueensPlaced', () => {
    test('all queens placed (base game)', () => {
      const config = BASE_GAME;
      const board = parseBoardNotation('~0.0Q~1.-1bQ');
      expect(allQueensPlaced(board, 'b', config)).toBe(true);
      expect(allQueensPlaced(board, 'w', config)).toBe(true);
    });
    test('all queens not placed (base game)', () => {
      const config = BASE_GAME;
      const board = parseBoardNotation('~0.0A1B-1bG~1.0bB-1G~-1.0P1bA');
      expect(allQueensPlaced(board, 'b', config)).toBe(false);
      expect(allQueensPlaced(board, 'w', config)).toBe(false);
    });
    test('all queens placed (multi queen game)', () => {
      const config = createBaseGameConfig();
      config.tileset.Q = 3;
      const board = parseBoardNotation('~0.0Q~1.0bQ-1bQ~2.-1bQ~-1.0Q1Q');
      expect(allQueensPlaced(board, 'b', config)).toBe(true);
      expect(allQueensPlaced(board, 'w', config)).toBe(true);
    });
    test('all queens not placed (multi queen game)', () => {
      const config = createBaseGameConfig();
      config.tileset.Q = 3;
      const board = parseBoardNotation('~0.0Q1bQ~1.0bQ~-1.1Q');
      expect(allQueensPlaced(board, 'b', config)).toBe(false);
      expect(allQueensPlaced(board, 'w', config)).toBe(false);
    });
  });

  describe('allQueensSurrounded', () => {
    test('no queen on board', () => {
      const board = parseBoardNotation('~0.0Q1X-1X~1.0X-1X~-1.0X1X');
      expect(allQueensSurrounded(board, 'b')).toBe(true);
    });
    test('single queen surrounded', () => {
      const board = parseBoardNotation('~0.0Q1X-1X~1.0X-1X~-1.0X1X');
      expect(allQueensSurrounded(board, 'w')).toBe(true);
    });
    test('multiple queens surrounded', () => {
      const board = parseBoardNotation('~0.0Q1X-1X~1.0Q1X-1X~2.0X-1X~-1.0X1X');
      expect(allQueensSurrounded(board, 'w')).toBe(true);
    });
    test('single queen not surrounded', () => {
      const board = parseBoardNotation('~0.0Q1X~1.0X-1X~-1.0X1X');
      expect(allQueensSurrounded(board, 'w')).toBe(false);
    });
    test('multiple queens not surrounded', () => {
      const board = parseBoardNotation('~0.0Q1Q-1X~1.0X1X-1X~-1.0X1X2X');
      expect(allQueensSurrounded(board, 'w')).toBe(false);
    });
  });
});
