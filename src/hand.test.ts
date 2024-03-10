import { GameConfig } from './types';
import { describe, expect, test } from 'vitest';
import { stacksInHand, tilesInHand } from './hand';
import { createBaseGameConfig } from './game';

describe('player hands', () => {
  describe('getStacksInHand', () => {
    test('all stacks in hand', () => {
      const config: GameConfig = createBaseGameConfig({
        ladybug: true,
        mosquito: true,
        pillbug: true
      });
      const blackHand = stacksInHand({}, 'b', config);
      const whiteHand = stacksInHand({}, 'w', config);
      expect(blackHand).toHaveLength(8);
      expect(whiteHand).toHaveLength(8);
      expect(blackHand).toEqual(
        expect.arrayContaining([
          expect.arrayContaining(['bA', 'bA', 'bA']),
          expect.arrayContaining(['bB', 'bB']),
          expect.arrayContaining(['bG', 'bG', 'bG']),
          expect.arrayContaining(['bS', 'bS']),
          expect.arrayContaining(['bQ']),
          expect.arrayContaining(['bL']),
          expect.arrayContaining(['bM']),
          expect.arrayContaining(['bP'])
        ])
      );
      expect(whiteHand).toEqual(
        expect.arrayContaining([
          expect.arrayContaining(['wA', 'wA', 'wA']),
          expect.arrayContaining(['wB', 'wB']),
          expect.arrayContaining(['wG', 'wG', 'wG']),
          expect.arrayContaining(['wS', 'wS']),
          expect.arrayContaining(['wQ']),
          expect.arrayContaining(['wL']),
          expect.arrayContaining(['wM']),
          expect.arrayContaining(['wP'])
        ])
      );
    });
  });
  describe('getTilesInHand', () => {
    const options: GameConfig = createBaseGameConfig({
      ladybug: true,
      mosquito: true,
      pillbug: true
    });
    test('all tiles in hand', () => {
      const blackHand = tilesInHand({ 0: { 0: ['bQ'] } }, 'b', options);
      const whiteHand = tilesInHand({ 0: { 0: ['wQ', 'wM'] } }, 'w', options);
      expect(blackHand).toHaveLength(13);
      expect(whiteHand).toHaveLength(12);
    });
  });
});
