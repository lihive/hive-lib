import { getTileBug, getTileColor } from './tile';
import { Color, TileId } from './types';

/**
 * Determine if a tile is a pillbug, optionally of a specific color.
 *
 * @param tileId A tile id.
 * @param color A tile color.
 * @return true if the tile is a pillbug (of the specified color if provided), false otherwise.
 */
export function isPillbug(tileId: TileId, color?: Color): boolean {
  return (
    getTileBug(tileId) === 'P' &&
    (color ? getTileColor(tileId) === color : true)
  );
}
