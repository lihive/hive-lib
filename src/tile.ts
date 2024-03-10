import { Bug, Color, TileId } from './types';

export function tile(color: Color, tileId: Bug): TileId {
  return `${color}${tileId}`;
}

/**
 * Get the bug key from a tile id.
 *
 * @param tileId The tile id.
 * @return The bug key portion of the tile id.
 */
export function getTileBug(tileId: TileId): Bug {
  return tileId[1] as Bug;
}

/**
 * Get the color of a tile.
 *
 * @param tileId The tile's tile id
 * @return The tile's color
 */
export function getTileColor(tileId: TileId): Color {
  return tileId[0] as Color;
}

/**
 * Determine if a tile belongs to a player.
 *
 * @param tileId The tile id in question.
 * @param player The player in question.
 * @return true if the tile id and player are the same color, false otherwise.
 */
export function isOwnTile(tileId: TileId, player: Color): boolean {
  return getTileColor(tileId) === player;
}
