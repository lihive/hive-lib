import { getTileBug, getTileColor } from './tile';
import { Color, TileId } from './types';

/**
 * Determine if a tile is a mosquito, optionally of a specific color.
 *
 * @param tileId A tile id.
 * @param color A tile color.
 * @return true if the tile is a mosquito (of the specified color if provided), false otherwise.
 */
export function isMosquito(tileId: TileId, color?: Color): boolean {
  return (
    getTileBug(tileId) === 'M' &&
    (color ? getTileColor(tileId) === color : true)
  );
}
