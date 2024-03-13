import { Color, getTileColor, TileId } from '@hive-lib';
import { Hex } from './hex';
import { useTable } from '../table';

interface TileProps {
  tile: TileId;
}

export const Tile = (props: TileProps) => {
  const table = useTable();
  const color = () => getTileColor(props.tile);
  return (
    <g>
      <Hex
        fill={fill(color())}
        size={table.hexSize}
        stroke={stroke(color(), false)}
        stroke-width={strokeWidth(false)}
      />
    </g>
  );
};

function fill(color: Color): string {
  if (color === 'b') return '#222';
  if (color === 'w') return 'white';
  return 'none';
}

function stroke(color: Color, selected?: boolean): string {
  if (selected) return '#f8a61c';
  if (color === 'b') return '#aaa';
  if (color === 'w') return '#888';
  return 'none';
}

function strokeWidth(selected?: boolean): number {
  if (selected) return 5;
  return 3;
}
