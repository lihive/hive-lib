import styles from './table.module.css';
import {
  Color,
  getTileAt,
  getTileBug,
  getTileColor,
  hexesEqual,
  HexStack,
  hexToTransform
} from '@hive-lib';
import { RoundedHex } from './rounded-hex';
import { useTable } from './table-provider';
import { Bug } from './bug';
import { SVGGMouseEventHandler } from './types';
import { For } from 'solid-js';
import { useBoard } from './board-provider';

interface StackProps {
  stack: HexStack;
}

export const Stack = (props: StackProps) => {
  const { table, setSelectedCoordinate } = useTable();
  const { board, setPlayerColor } = useBoard();
  const topTile = () => props.stack.tiles[props.stack.tiles.length - 1];
  const color = () => getTileColor(topTile());

  const onClickStack: SVGGMouseEventHandler = () => {
    if (hexesEqual(table.selectedCoordinate, props.stack.coordinate)) {
      const tile = getTileAt(board(), props.stack.coordinate);
      if (tile) {
        setPlayerColor(getTileColor(tile));
      }
    } else {
      setSelectedCoordinate({ ...props.stack.coordinate });
    }
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
