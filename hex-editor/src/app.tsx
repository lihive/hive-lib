import styles from './app.module.css';
import { TableProvider, useTable } from './table-provider';
import { Table } from './table';
import { TableSettings } from './table-settings';
import { Grid } from './grid';
import { RoundedHex } from './RoundedHex';
import { HexCoordinate, hexToTransform } from '@hive-lib';

export const App = () => {
  return (
    <TableProvider>
      <div class={styles.app}>
        <TableSettings />
        <Table>
          <Grid />
          <Hex coordinate={{ q: 0, r: 0 }} />
        </Table>
      </div>
    </TableProvider>
  );
};

interface HexProps {
  coordinate: HexCoordinate;
}

const Hex = (props: HexProps) => {
  const [table] = useTable();
  return (
    <g
      transform={hexToTransform(
        props.coordinate,
        table.hexSize,
        table.hexOrientation
      )}
    >
      <RoundedHex
        hexSize={table.hexSize}
        hexOrientation={table.hexOrientation}
        hexPrecision={table.hexPrecision}
        hexPadding={table.hexPadding}
        hexRounding={table.hexRounding}
        stroke='#000'
        stroke-width={2}
        fill='none'
      />
    </g>
  );
};
