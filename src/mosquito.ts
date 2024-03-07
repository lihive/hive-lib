import { getBugLetter, getTileBug, getTileColor } from './tile';
import { ColorKey, TileId } from './types';

/**
 * Determine if a tile is a mosquito, optionally of a specific color.
 *
 * @param tileId A tile id.
 * @param color A tile color.
 * @return true if the tile is a mosquito (of the specified color if provided), false otherwise.
 */
export function isMosquito(tileId: TileId, color?: ColorKey): boolean {
  return (
    getBugLetter(getTileBug(tileId)) === 'M' &&
    (color ? getTileColor(tileId) === color : true)
  );
}
