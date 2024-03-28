import styles from './suite-view.module.css';
import { useTable } from '../table-provider';
import { hexToTransform } from '@hive-lib';
import { RoundedHex } from '../rounded-hex';
import { useBoard } from '../board-provider';

export const GridRowOrientation = () => {
  const { table } = useTable();
  const { playerColor } = useBoard();

  const hexTransform = () =>
    hexToTransform({ q: 0, r: 0 }, 8, table.hexOrientation);

  const orientationText = () =>
    table.hexOrientation.id === 'flat-top' ? 'Flat Top' : 'Pointy Top';

  const fill = () => (playerColor() === 'b' ? 'black' : 'none');

  return (
    <>
      <div class={styles.rowText}>
        Hex orientation
        <svg width={16} height={16} viewBox='-8 -8 16 16'>
          <RoundedHex
            stroke={'black'}
            fill={fill()}
            hexSize={8}
            hexPrecision={0}
            transform={hexTransform()}
          />
        </svg>
        {orientationText()}
      </div>
      <kbd>O</kbd>
    </>
  );
};
