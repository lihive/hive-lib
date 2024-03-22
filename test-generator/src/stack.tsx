import styles from './table.module.css';
import {
  Color,
  getTileBug,
  getTileColor,
  HexStack,
  hexToTransform
} from '@hive-lib';
import { RoundedHex } from './rounded-hex';
import { useTable } from './table-provider';
import { Bug } from './bug';
import { SVGGMouseEventHandler } from './types';

interface StackProps {
  stack: HexStack;
}

export const Stack = (props: StackProps) => {
  const [table, setTable] = useTable();
  const topTile = () => props.stack.tiles[props.stack.tiles.length - 1];
  const color = () => getTileColor(topTile());

  const onClickStack: SVGGMouseEventHandler = () => {
    setTable('selectedCoordinate', { ...props.stack.coordinate });
  };

  return (
    <g
      class={styles.clickable}
      onClick={onClickStack}
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
      <Bug bug={getTileBug(topTile())} color={getTileColor(topTile())} />
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
