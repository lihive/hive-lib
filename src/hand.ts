import { ColorKey, GameBoard, GameOptions, TileId } from './types';
import { tilesOnBoard } from './board';
import { BLACK_TILES, WHITE_TILES } from './constants';
import { isPillbug } from './pillbug';
import { isMosquito } from './mosquito';
import { isLadybug } from './ladybug';
import { compareTileNumber, getBugLetter, getTileBug } from './tile';
import { groupBy, values } from 'lodash';

/**
 * Get a list of tiles that a player has in their hand, grouped by bug type.
 *
 * @param board A game board.
 * @param color A player color.
 * @param options A game options object.
 * @return A list of tile ids in the given players hand, grouped by bug type.
 */
export function stacksInHand(
  board: GameBoard,
  color: ColorKey,
  options: GameOptions
): TileId[][] {
  const hand = tilesInHand(board, color, options);
  const groups = groupBy(hand, (tileId) => getBugLetter(getTileBug(tileId)));
  const stacks = values(groups);
  stacks.forEach((stack) => stack.sort(compareTileNumber));
  return stacks;
}

/**
 * Get a list of tiles that a player has in their hand (ie. those that are
 * not on the board.
 *
 * @param board A game board.
 * @param color A player color.
 * @param options A game options object.
 * @return A list of tile ids in the given player's hand.
 */
export function tilesInHand(
  board: GameBoard,
  color: ColorKey,
  options: GameOptions
): TileId[] {
  const boardTiles = new Set<string>(tilesOnBoard(board));
  const colorTiles = color === 'b' ? BLACK_TILES : WHITE_TILES;
  return colorTiles.filter((tileId: TileId) => {
    if (!options.ladybug && isLadybug(tileId)) return false;
    if (!options.mosquito && isMosquito(tileId)) return false;
    if (!options.pillbug && isPillbug(tileId)) return false;
    return !boardTiles.has(tileId);
  });
}
