import styles from './table-settings.module.css';
import { FLAT_TOP, hexPath, POINTY_TOP } from '@hive-lib';
import { useTable } from './table-provider';
import { JSX } from 'solid-js';

export const TableSettings = () => {
  const [table, setTable] = useTable();
  const toggleOrientation = () => {
    setTable(
      'hexOrientation',
      table.hexOrientation.id === 'flat-top' ? POINTY_TOP : FLAT_TOP
    );
  };

  const onSizeChange: JSX.InputEventHandlerUnion<
    HTMLInputElement,
    InputEvent
  > = (event) => {
    const value = +event.currentTarget.value;
    setTable('hexSize', value);
  };

  const onPaddingChange: JSX.InputEventHandlerUnion<
    HTMLInputElement,
    InputEvent
  > = (event) => {
    const value = +event.currentTarget.value;
    setTable('hexPadding', value);
  };

  const onRoundingChange: JSX.InputEventHandlerUnion<
    HTMLInputElement,
    InputEvent
  > = (event) => {
    const value = +event.currentTarget.value;
    setTable('hexRounding', value);
  };

  const onPrecisionChange: JSX.InputEventHandlerUnion<
    HTMLInputElement,
    InputEvent
  > = (event) => {
    const value = +event.currentTarget.value;
    setTable('hexPrecision', value);
  };

  return (
    <div class={styles.tableSettings}>
      <div class={styles.settingsGrid}>
        <label for='hexOrientation'>Orientation</label>
        <button
          id='hexOrientation'
          onClick={toggleOrientation}
        >{`${table.hexOrientation.id}`}</button>
        <label for='hexSize'>Size</label>
        <div class={styles.cell}>
          <input
            id='hexSize'
            type='range'
            min={1}
            max={256}
            value={table.hexSize}
            onInput={onSizeChange}
          />
          <label>{table.hexSize}</label>
        </div>
        <label for='hexPadding'>Padding</label>
        <div class={styles.cell}>
          <input
            id='hexPadding'
            type='range'
            min={0}
            max={table.hexSize - table.hexRounding}
            value={table.hexPadding}
            onInput={onPaddingChange}
          />
          <label>{table.hexPadding}</label>
        </div>
        <label for='hexRounding'>Rounding</label>
        <div class={styles.cell}>
          <input
            id='hexRounding'
            type='range'
            min={0}
            max={table.hexSize - table.hexPadding}
            value={table.hexRounding}
            onInput={onRoundingChange}
          />
          <label>{table.hexRounding}</label>
        </div>
        <label for='hexPrecision'>SVG Precision</label>
        <div class={styles.cell}>
          <input
            id='hexPrecision'
            type='range'
            min={0}
            max={8}
            value={table.hexPrecision}
            onInput={onPrecisionChange}
          />
          <label>{table.hexPrecision}</label>
        </div>
      </div>
      <div class={styles.settingsPath}>
        <h3>SVG Path Data</h3>
        {hexPath(
          table.hexSize - (table.hexPadding || 0),
          table.hexRounding || 0,
          table.hexPrecision
        )}
      </div>
    </div>
  );
};
