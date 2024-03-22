import styles from './app.module.css';
import { Table } from './table';
import { Grid } from './grid';
import { TableProvider } from './table-provider';
import { HoverHex } from './hover-hex';
import { GeneratorControls } from './generator-controls';
import { SelectedHex } from './selected-hex';
import { Stacks } from './stacks';
import { ValidMoves } from './valid-moves';
import { BoardProvider } from './board-provider';

export const App = () => {
  return (
    <TableProvider>
      <BoardProvider>
        <div class={styles.app}>
          <GeneratorControls />
          <Table>
            <Grid />
            <Stacks />
            <ValidMoves />
            <SelectedHex />
            <HoverHex />
          </Table>
          <g></g>
        </div>
      </BoardProvider>
    </TableProvider>
  );
};
