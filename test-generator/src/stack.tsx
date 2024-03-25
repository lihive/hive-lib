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
import { For } from 'solid-js';

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
      <For each={props.stack.tiles}>
        {(tile, index) => {
          return (
            <g transform={tileOffsetTransform(index())}>
              <RoundedHex
                fill={fill(color())}
                stroke={stroke(color())}
                hexSize={table.hexSize}
                hexPrecision={table.hexPrecision}
                hexPadding={table.tilePadding}
                hexRounding={table.tileRounding}
              />
              <Bug
                transform={`rotate(${-table.hexOrientation.startAngle})`}
                bug={getTileBug(tile)}
                color={getTileColor(tile)}
              />
            </g>
          );
        }}
      </For>
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

function tileOffsetTransform(index: number) {
  return `translate(${3 * index} ${-2 * index})`;
}
