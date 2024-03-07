import { getBugLetter, getTileBug, getTileColor } from './tile';
import { ColorKey, TileId } from './types';

/**
 * Determine if a tile is a pillbug, optionally of a specific color.
 *
 * @param tileId A tile id.
 * @param color A tile color.
 * @return true if the tile is a pillbug (of the specified color if provided), false otherwise.
 */
export function isPillbug(tileId: TileId, color?: ColorKey): boolean {
  return (
    getBugLetter(getTileBug(tileId)) === 'P' &&
    (color ? getTileColor(tileId) === color : true)
  );
}
