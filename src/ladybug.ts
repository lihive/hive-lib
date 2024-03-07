import { ColorKey, TileId } from './types';
import { getBugLetter, getTileBug, getTileColor } from './tile';

/**
 * Determine if a tile is a ladybug, optionally of a specific color.
 *
 * @param tileId A tile id.
 * @param color A tile color.
 * @return true if the tile is a ladybug (of the specified color if provided), false otherwise.
 */
export function isLadybug(tileId: TileId, color?: ColorKey): boolean {
  return (
    getBugLetter(getTileBug(tileId)) === 'L' &&
    (color ? getTileColor(tileId) === color : true)
  );
}
