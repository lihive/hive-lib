import styles from './table.module.css';
import { useTable } from './table-provider';
import { hexToTransform } from '@hive-lib';
import { Show } from 'solid-js';
import { RoundedHex } from '../../hex-editor/src/rounded-hex';

export const SelectedHex = () => {
  const [table] = useTable();

  return (
    <Show when={table.selectedCoordinate}>
      {(coordinate) => {
        return (
          <g
            transform={hexToTransform(
              coordinate(),
              table.hexSize,
              table.hexOrientation
            )}
          >
            <RoundedHex
              class={styles.selectedHex}
              hexSize={table.hexSize}
              hexOrientation={table.hexOrientation}
              hexPrecision={table.hexPrecision}
              hexPadding={0}
              hexRounding={0}
            />
          </g>
        );
      }}
    </Show>
  );
};
