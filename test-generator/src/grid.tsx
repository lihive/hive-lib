import styles from './table.module.css';
import { createTileMovement, HexCoordinate, hexToTransform } from '@hive-lib';
import { For } from 'solid-js';
import { useTable } from './table-provider';
import { RoundedHex } from './rounded-hex';
import { SVGGMouseEventHandler } from './types';
import { useBoard } from './board-provider';

const grid: HexCoordinate[] = hexgrid(10);

export const Grid = () => {
  const { table, setSelectedCoordinate, setHoverCoordinate } = useTable();
  const { moveTile, setLastMove } = useBoard();
  return (
    <g>
      <For each={grid}>
        {(coord) => {
          const onClickHex: SVGGMouseEventHandler = (event) => {
            if (event.shiftKey && table.selectedCoordinate) {
              const move = createTileMovement(table.selectedCoordinate, coord);
              moveTile(move);
              setLastMove(move);
            }
            setSelectedCoordinate({ ...coord });
          };

          const onMouseEnterHex: SVGGMouseEventHandler = () => {
            setHoverCoordinate({ ...coord });
          };

          return (
            <g
              class={styles.clickable}
              onMouseEnter={onMouseEnterHex}
              onClick={onClickHex}
              transform={hexToTransform(
                coord,
                table.hexSize,
                table.hexOrientation
              )}
            >
              <RoundedHex
                hexSize={table.hexSize}
                hexPrecision={table.hexPrecision}
                stroke='#eee'
                fill='#fff'
              />
            </g>
          );
        }}
      </For>
    </g>
  );
};

function hexgrid(n: number): HexCoordinate[] {
  const coords: HexCoordinate[] = [];
  for (let q = -n; q <= n; ++q) {
    const r1 = Math.max(-n, -q - n);
    const r2 = Math.min(n, -q + n);
    for (let r = r1; r <= r2; ++r) {
      coords.push({ q, r });
    }
  }
  return coords;
}
