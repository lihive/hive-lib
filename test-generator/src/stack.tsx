import styles from './table.module.css';
import { Color, getTileColor, HexStack, hexToTransform } from '@hive-lib';
import { RoundedHex } from './rounded-hex';
import { useTable } from './table-provider';

interface StackProps {
  stack: HexStack;
}

export const Stack = (props: StackProps) => {
  const [table, setTable] = useTable();
  const topTile = () => props.stack.tiles[props.stack.tiles.length - 1];
  const color = () => getTileColor(topTile());
  return (
    <g
      class={styles.clickable}
      onMouseEnter={() => setTable('hoverCoordinate', props.stack.coordinate)}
      onClick={() => setTable('selectedCoordinate', props.stack.coordinate)}
      transform={hexToTransform(
        props.stack.coordinate,
        table.hexSize,
        table.hexOrientation
      )}
    >
      <RoundedHex
        fill={fill(color())}
        stroke={stroke(color())}
        hexSize={table.hexSize}
        hexOrientation={table.hexOrientation}
        hexPrecision={table.hexPrecision}
        hexPadding={table.tilePadding}
        hexRounding={table.tileRounding}
      />
      <text
        text-anchor='middle'
        dominant-baseline='middle'
        fill={stroke(color())}
      >
        {topTile()}
      </text>
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
