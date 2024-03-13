import { HexCoordinate, hexToTransform } from '@hive-lib';
import { For } from 'solid-js';
import { useTable } from './table-provider';
import { RoundedHex } from './RoundedHex';

const grid: HexCoordinate[] = hexgrid(10);

export const Grid = () => {
  const [table] = useTable();
  return (
    <g>
      <For each={grid}>
        {(coord) => {
          return (
            <g
              transform={hexToTransform(
                coord,
                table.hexSize,
                table.hexOrientation
              )}
            >
              <RoundedHex
                hexSize={table.hexSize}
                hexOrientation={table.hexOrientation}
                hexPrecision={table.hexPrecision}
                stroke='#eee'
                fill='none'
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
