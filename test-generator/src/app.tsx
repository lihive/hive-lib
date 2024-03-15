import styles from './app.module.css';
import { Table } from './table';
import { Grid } from './grid';
import { TableProvider } from './table-provider';
import { HoverHex } from './hover-hex';
import { GeneratorControls } from './generator-controls';
import { SelectedHex } from './selected-hex';
import { Stacks } from './stacks';

export const App = () => {
  return (
    <TableProvider>
      <div class={styles.app}>
        <GeneratorControls />
        <Table>
          <Grid />
          <Stacks />
          <HoverHex />
          <SelectedHex />
        </Table>
      </div>
    </TableProvider>
  );
};
