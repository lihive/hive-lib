import { BugId, Color, GameBoard, GameConfig, TileId } from './types';
import { getTilesOnBoard } from './board';
import { tile } from './tile';

/**
 * Get a list of tiles that a player has in their hand, grouped by bug type.
 *
 * @param board A game board.
 * @param color A player color.
 * @param config A game config object.
 * @return A list of tile ids in the given players hand, grouped by bug type.
 */
export function stacksInHand(
  board: GameBoard,
  color: Color,
  config: GameConfig
): TileId[][] {
  const hand = tilesInHand(board, color, config);
  const groups = hand.reduce(
    (groups, tileId) => {
      groups[tileId] = groups[tileId] ?? [];
      groups[tileId].push(tileId);
      return groups;
    },
    {} as Record<TileId, TileId[]>
  );
  return Object.values(groups);
}

/**
 * Get a list of tiles that a player has in their hand.
 *
 * @param board A game board.
 * @param color A player color.
 * @param config A game config object.
 * @return A list of tile ids in the given player's hand.
 */
export function tilesInHand(
  board: GameBoard,
  color: Color,
  config: GameConfig
): TileId[] {
  const handTiles: TileId[] = [];
  const countByTileId: Partial<Record<TileId, number>> = {};
  getTilesOnBoard(board).forEach((tileId) => {
    countByTileId[tileId] = (countByTileId[tileId] || 0) + 1;
  });
  let bug: BugId;
  for (bug in config.tileset) {
    const tileId: TileId = tile(color, bug);
    const numInGame = config.tileset[bug] || 0;
    const numOnBoard = countByTileId[tileId] || 0;
    const numInHand = Math.max(0, numInGame - numOnBoard);
    const tilesInHand = Array.from({ length: numInHand }, () => tileId);
    handTiles.push(...tilesInHand);
  }
  return handTiles;
}
