import { useTable } from './table-provider';
import { getOccupiedNeighbors, hexToCartesian, walkBoard } from '@hive-lib';
import { useBoard } from './board-provider';
import { Show } from 'solid-js';

export const WalkingPath = () => {
  const [table] = useTable();
  const { board } = useBoard();

  const path = () => {
    if (!table.selectedCoordinate) return undefined;
    const randomNeighbor = getOccupiedNeighbors(
      board(),
      table.selectedCoordinate
    ).at(0);
    if (!randomNeighbor) return undefined;
    const coordinates = walkBoard(
      board(),
      randomNeighbor,
      table.selectedCoordinate
    );
    return coordinates
      .map((coord) =>
        hexToCartesian(coord, table.hexSize, table.hexOrientation)
      )
      .map((coord, index) => `${index === 0 ? 'M' : 'L'} ${coord.x} ${coord.y}`)
      .join(' ');
  };

  return (
    <Show when={path()}>
      {(path) => (
        <path d={path()} stroke='black' stroke-width={4} fill='none' />
      )}
    </Show>
  );
};
