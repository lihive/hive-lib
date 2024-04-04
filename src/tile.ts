import { BugId, Color, TileId } from './types';

/**
 * Create a tile id.
 *
 * @param color - The tile color.
 * @param bugId - The bug id.
 * @returns A tile id.
 *
 * @beta
 */
export function tile(color: Color, bugId: BugId): TileId {
  return `${color}${bugId}`;
}

/**
 * Get the bug id from a tile id.
 *
 * @param tileId - The tile id.
 * @returns The bug id portion of the tile id.
 *
 * @beta
 */
export function getTileBug(tileId: TileId): BugId {
  return tileId[1] as BugId;
}

/**
 * Get the color of a tile.
 *
 * @param tileId - The tile's tile id
 * @returns The tile's color
 *
 * @beta
 */
export function getTileColor(tileId: TileId): Color {
  return tileId[0] as Color;
}

/**
 * Determine if a tile belongs to a player.
 *
 * @param tileId - The tile id in question.
 * @param player - The player in question.
 * @returns true if the tile id and player are the same color, false otherwise.
 *
 * @beta
 */
export function isOwnTile(tileId: TileId, player: Color): boolean {
  return getTileColor(tileId) === player;
}
