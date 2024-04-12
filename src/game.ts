import { Game, GameConfig } from './types';
import { BASE_GAME } from './constants';

/**
 * Generate a new game with the provided configuration.
 *
 * @param config - A game config
 * @returns A game object.
 *
 * @beta
 */
export function createGame(config: GameConfig): Game {
  return {
    config,
    board: {},
    moves: []
  };
}

/**
 * Generate a game config using the base game tile counts, optionally including
 * any of the three expansion tiles.
 *
 * @param options - An object indicating which expansion tiles to include.
 * @returns A game object.
 *
 * @beta
 */
export function createBaseGameConfig(options?: {
  ladybug?: boolean;
  mosquito?: boolean;
  pillbug?: boolean;
}): GameConfig {
  const config: GameConfig = structuredClone(BASE_GAME);
  if (options?.ladybug) config.tileset.L = 1;
  if (options?.mosquito) config.tileset.M = 1;
  if (options?.pillbug) config.tileset.P = 1;
  return config;
}
